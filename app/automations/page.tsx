import { OperatingSurface } from "../../apps/web-replycontrol/app/components/automationsSurface";

export default function AutomationsPage(){
  return <OperatingSurface code="AUTOMATIONS" title="Rail" kicker="RAIL" thesis="Move approved work through bounded paths." body="Controlled execution paths connect approved work to tools and release mechanisms without hiding who authorized the action." mode="EXECUTE" items={["Approved action","Tool route","Execution state","Rollback","Result","Record"]} next="/evidence" nextLabel="Inspect proof" />;
}
