import { OperatingSurface } from "../../apps/web-replycontrol/app/components/agentsSurface";

export default function AgentsPage(){
  return <OperatingSurface code="FORGE" title="Forge" kicker="AGENTS" thesis="Decisions into bounded work." body="Agent surfaces compose plans, expose uncertainty and keep every proposed action attached to an explicit outcome." mode="CREATE" items={["Outcome framing","Decision graph","Tool boundary","Human approval","Execution brief","Handoff record"]} next="/realtime" nextLabel="Talk to the outcome" />;
}
