# Syncfusion MCP setup

The repository's `.mcp.json` preserves the existing Supabase connection and defines 14 Syncfusion MCP server entries: Angular, React, Vue, JavaScript, TypeScript, Blazor, ASP.NET Core, ASP.NET MVC, MAUI, WPF, WinForms, WinUI, UWP, and Document SDK.

## Before connecting

1. Treat every `YOUR_ACTUAL_API_KEY_STRING` value as a placeholder. Replace it **only in your local MCP configuration** with the valid Syncfusion API key. Do not commit the real key, paste it into a pull request, or put it in a tracked file.
2. Confirm the required runtimes and launchers are installed: Node.js/npm for the `npx` entries and a compatible .NET SDK/runtime with `dnx` available for the .NET entries. Check each package/tool's current vendor instructions before starting it.
3. Verify all 14 servers start individually and expose the expected tools. Do not assume a configured package name is published, compatible, or successfully installed merely because it appears in JSON.
4. Confirm the accounting process can write to `/var/log/accounting/mcp_audit.log`, and that the directory and log file have restrictive permissions. Adjust the path for your operating system if needed.
5. Treat `FINANCE_DATA_ISOLATION=TRUE` as a configuration signal, not proof of isolation. Enforce and test tenant/data boundaries in the server implementation before using real financial records.
6. Start with synthetic data. Verify access boundaries and audit entries, and ensure logs do not contain credentials or sensitive financial payloads.

## Financial controls

Do not use this configuration alone as proof of revenue or profit. Profit reporting must reconcile actual receipts against refunds and operating costs. Do not connect production financial data until the relevant access controls and audit behavior have been tested.

## Current status

This is a repository configuration change only. GitHub cannot resolve a developer's local API key, install runtimes on their machine, or establish that any MCP server is connected. The key string in the committed configuration is a placeholder, not a credential. Validate locally after replacing placeholders.
