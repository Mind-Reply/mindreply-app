# Syncfusion MCP setup

The repository's `.mcp.json` includes configuration templates for the Syncfusion Document SDK, ASP.NET Core, and React MCP servers, while preserving the existing Supabase connection.

## Before connecting

1. Install and verify the required .NET tools for `sf-documentsdk-mcp` and `sf-aspnetcore-mcp`; verify the React package and its published version before running it.
2. Replace every `/absolute/path/to/secure-accounting-key.txt` placeholder in your **local** MCP configuration with the real absolute path to a securely stored Syncfusion key file. Do not commit the key or a machine-specific secret path.
3. Confirm the accounting process can write to `/var/log/accounting/mcp_audit.log`, and that the directory and log file have restrictive permissions. Adjust the path for your operating system if needed.
4. Treat `FINANCE_DATA_ISOLATION=TRUE` as a configuration signal, not proof of isolation. Enforce and test tenant/data boundaries in the server implementation before using real financial records.
5. Start with synthetic accounting data. Verify each server starts, the expected tools are exposed, access is appropriately restricted, and audit entries are written without credentials or sensitive financial payloads.

## Financial controls

Do not use this configuration alone as proof of revenue or profit. Profit reporting must reconcile actual receipts against refunds and operating costs. Do not connect production financial data until the relevant access controls and audit behavior have been tested.

## Current status

This is a repository configuration change only. The GitHub-hosted configuration cannot resolve a developer's local key-file path, install tools on their machine, or establish that any MCP server is connected. Validate locally after replacing the placeholders.
