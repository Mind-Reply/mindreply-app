# Salesforce mapping

## Standard objects
- **Lead** — Communication Audit intake lead.
- **Task** — internal follow-up / owner review task linked to the Lead.
- **Contact** — only after an owner-approved qualification flow.
- **Account** — customer/company record when appropriate.

## Dashboard projection
Lead + Task status is projected into approval cards. Salesforce remains the CRM system of record; MindReply does not expose Salesforce credentials.

## Required owner connection
Create/authorize a Salesforce Connected App with the minimum scopes needed for Lead and Task operations. Store credentials in n8n Credentials or Cloudflare Secrets. Do not commit them.
