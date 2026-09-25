# API Contract — MindReply (initial)

Base URL: /api (rewrites may proxy to backend)

## Health
GET /health
Response: { "ok": true }

## Agents
GET /api/agents
Response: [{ "id": "string", "name": "string", "status": "idle|running|error" }]

POST /api/agents/:id/activate
Request: { "memory": {} }
Response: { "activated": true }

## Memory
GET /api/memory
Response: { "entries": [] }

POST /api/memory
Request: { "key": "string", "value": any }
Response: { "stored": true }

## Chat
POST /api/chat
Request: { "message": "string", "context": {} }
Response: { "reply": "string" }

## Auth (if implemented)
POST /api/auth/login
Request: { "username": "string", "password": "string" }
Response: { "token": "jwt" }

Notes:
- This is an initial contract to unblock frontend development and CI smoke tests. Final OpenAPI/Swagger spec to be added after backend implementation decisions.
