import { OperatingSurface } from "../../apps/web-replycontrol/app/components/evidenceSurface";

export default function EvidencePage(){
  return <OperatingSurface code="PROOFLINE" title="Proof" kicker="EVIDENCE" thesis="Claims into inspectable evidence." body="The proof surface binds results to artifacts, logs and authoritative records so a finished action can be checked rather than merely announced." mode="VERIFY" items={["Artifact ledger","Source authority","Verification state","Evidence chain","Release record","Open uncertainty"]} next="/control" nextLabel="Open owner control" />;
}
