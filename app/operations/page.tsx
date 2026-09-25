import { OperatingSurface } from "../../apps/web-replycontrol/app/components/operationsSurface";

export default function OperationsPage(){
  return <OperatingSurface code="OPERATIONS" title="Vector" kicker="VECTOR" thesis="Turn ambiguity into a contract." body="Normalize the request into a precise operating contract: outcome, inputs, authority, validation, boundary and deliverable." mode="SHAPE" items={["Outcome contract","Inputs","Authority","Validation","Boundary","Deliverable"]} next="/agents" nextLabel="Enter the forge" />;
}
