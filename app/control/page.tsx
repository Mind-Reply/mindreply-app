import { OperatingSurface } from "../../apps/web-replycontrol/app/components/controlSurface";

export default function ControlPage(){
  return <OperatingSurface code="CONTROL" title="Control" kicker="CROWNLINE" thesis="Authority stays visible." body="The owner-control surface makes permission, approval, rollback and irreversible boundaries explicit before consequential work moves." mode="AUTHORIZE" items={["Owner authority","Approval queue","Permission boundary","Rollback path","Release state","Audit record"]} next="/platform" nextLabel="Return to platform" />;
}
