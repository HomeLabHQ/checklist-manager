import { Tag } from "antd";
import { CheckListRunStatusEnum } from "../../redux/api";

export default function StatusBadge(props: Readonly<{ status: CheckListRunStatusEnum }>) {
  if (props.status == "PASSED") {
    return <Tag color="green">{props.status}</Tag>;
  }
  if (props.status == "FAILED") {
    return <Tag color="red">{props.status}</Tag>;
  } else {
    return <Tag color="blue">{props.status}</Tag>;
  }
}
