import { Card, Statistic, Tag } from "antd";
import { useChecklistChecklistRunStatisticRetrieveQuery } from "../../../redux/api";
import { useDuration } from "../../../hooks/useDuration";

export default function CheckListStats(props: { project: string }) {
  const { data, isLoading } = useChecklistChecklistRunStatisticRetrieveQuery({
    project: props.project
  });
  return (
    <Card loading={isLoading} title={`Statistics for ${props.project}`}>
      {data && (
        <>
          <Statistic
            title="Average regression duration"
            value={useDuration(data?.average_duration)}
          />
          <Statistic title="Total  regression duration" value={useDuration(data?.total_duration)} />
        </>
      )}
      <Tag color="blue">Total: {data?.total}</Tag>
      <Tag color="red">Failed: {data?.failed}</Tag>
      <Tag color="green">Passed: {data?.passed}</Tag>
    </Card>
  );
}
