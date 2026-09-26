"""Production document synchronization engine.

The engine is deliberately provider-agnostic: storage/vector implementations are
injected through the IndexSink protocol. No fake cloud calls are used.
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Protocol

from pydantic import BaseModel, Field

logger = logging.getLogger("mindreply.ingestion")


class DocumentPayload(BaseModel):
    source_id: str
    file_name: str
    file_type: str
    content: str
    chunk_hash: str
    metadata: dict[str, Any] = Field(default_factory=dict)


class IndexSink(Protocol):
    async def upsert(self, payload: DocumentPayload) -> None: ...
    async def delete_source(self, source_id: str) -> None: ...


@dataclass(frozen=True)
class FileState:
    source_id: str
    fingerprint: str


def fingerprint(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def chunk_text(text: str, max_chars: int = 2400) -> list[str]:
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks: list[str] = []
    current = ""
    for paragraph in paragraphs:
        if current and len(current) + len(paragraph) + 2 > max_chars:
            chunks.append(current)
            current = ""
        current = f"{current}\n\n{paragraph}".strip()
    if current:
        chunks.append(current)
    return chunks or [text[:max_chars]]


def parse_file(path: Path) -> list[tuple[str, dict[str, Any]]]:
    suffix = path.suffix.lower()
    if suffix == ".md":
        return [(path.read_text(encoding="utf-8"), {"format": "markdown"})]
    if suffix == ".json":
        value = json.loads(path.read_text(encoding="utf-8"))
        return [(json.dumps(value, ensure_ascii=False, indent=2), {"format": "json"})]
    if suffix == ".txt":
        return [(path.read_text(encoding="utf-8"), {"format": "text"})]
    if suffix == ".pdf":
        raise NotImplementedError(
            "PDF extraction must use an approved layout-aware parser; "
            "raw binary text extraction is intentionally rejected."
        )
    raise ValueError(f"Unsupported ingestion format: {suffix}")


class WorkspaceSyncAgent:
    def __init__(
        self,
        source_directory: str,
        index: IndexSink,
        state_file: str = ".ingestion-state.json",
        concurrency: int = 4,
    ) -> None:
        self.root = Path(source_directory).resolve()
        self.index = index
        self.state_path = self.root / state_file
        self.semaphore = asyncio.Semaphore(concurrency)

    def _load_state(self) -> dict[str, str]:
        if not self.state_path.exists():
            return {}
        return json.loads(self.state_path.read_text(encoding="utf-8"))

    def _save_state(self, state: dict[str, str]) -> None:
        tmp = self.state_path.with_suffix(".tmp")
        tmp.write_text(json.dumps(state, indent=2, sort_keys=True), encoding="utf-8")
        tmp.replace(self.state_path)

    async def _process(self, path: Path, state: dict[str, str]) -> str:
        async with self.semaphore:
            source_id = str(path.relative_to(self.root))
            current_hash = fingerprint(path)
            if state.get(source_id) == current_hash:
                return "unchanged"

            records = parse_file(path)
            for index, (text, metadata) in enumerate(records):
                for chunk_no, chunk in enumerate(chunk_text(text)):
                    chunk_hash = hashlib.sha256(
                        f"{current_hash}:{index}:{chunk_no}:{chunk}".encode()
                    ).hexdigest()
                    await self.index.upsert(
                        DocumentPayload(
                            source_id=source_id,
                            file_name=path.name,
                            file_type=path.suffix.lower(),
                            content=chunk,
                            chunk_hash=chunk_hash,
                            metadata={
                                **metadata,
                                "source_fingerprint": current_hash,
                                "chunk_index": chunk_no,
                            },
                        )
                    )
            state[source_id] = current_hash
            return "updated"

    async def synchronize(self) -> dict[str, Any]:
        if not self.root.is_dir():
            raise FileNotFoundError(self.root)

        state = self._load_state()
        files = {
            str(path.relative_to(self.root)): path
            for path in self.root.rglob("*")
            if path.is_file() and path.name != self.state_path.name
        }

        deleted = set(state) - set(files)
        for source_id in deleted:
            await self.index.delete_source(source_id)
            del state[source_id]

        results = await asyncio.gather(
            *(self._process(path, state) for path in files.values()),
            return_exceptions=True,
        )
        failures = [
            {"file": str(path.relative_to(self.root)), "error": str(result)}
            for path, result in zip(files.values(), results)
            if isinstance(result, Exception)
        ]

        self._save_state(state)
        return {
            "status": "FAILED" if failures else "SUCCESS",
            "scanned": len(files),
            "updated": sum(r == "updated" for r in results if isinstance(r, str)),
            "unchanged": sum(r == "unchanged" for r in results if isinstance(r, str)),
            "deleted": len(deleted),
            "failures": failures,
        }
