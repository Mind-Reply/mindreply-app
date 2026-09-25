import { OperatingSurface } from "../../apps/web-replycontrol/app/components/knowledgeSurface";

export default function KnowledgePage(){
  return <OperatingSurface code="KNOWLEDGE" title="Signal" kicker="SIGNAL" thesis="Capture what actually matters." body="A focused intake surface for requests, constraints, source material and desired outcomes before any plan is formed." mode="INPUT" items={["Request","Constraints","Evidence","Desired outcome","Audience","Context"]} next="/operations" nextLabel="Shape an outcome" />;
}
