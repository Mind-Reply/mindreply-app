---
name: postgres-sql
description: Helps write, review, optimize, and debug SQL specifically for PostgreSQL.
---

# PostgreSQL SQL Skill

Use PostgreSQL-specific guidance for SQL authoring, review, optimization, and debugging.

## Rules
- Clarify schema, data volume, access patterns, and performance goals; request EXPLAIN ANALYZE when available.
- Prefer standard SQL plus appropriate PostgreSQL extensions.
- Use parameterized queries; never interpolate untrusted values.
- Use CTEs for complex logic when they improve clarity.
- Review correctness, performance, security, maintainability, and edge cases.
- Consider BTREE, GIN, and BRIN indexes, partitioning, materialized views, and appropriate statistics for large datasets.
- Use PostgreSQL patterns such as ILIKE, DISTINCT ON, ON CONFLICT, and LATERAL when beneficial.
- Prefer keyset pagination for large/high-offset datasets.
- Use TIMESTAMPTZ for timezone-aware timestamps.
- Analyze plans with EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) when optimizing.
- Consider VACUUM/ANALYZE and transaction isolation where relevant.
- Follow snake_case naming and transactional multi-statement operations.
- Always provide testing steps for material SQL changes.
