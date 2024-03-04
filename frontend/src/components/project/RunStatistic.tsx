import { Badge, Card, CardSection, Group, Text } from '@mantine/core';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useChecklistChecklistRunStatisticRetrieveQuery } from '@/redux/api';

function RunStatistic() {
  const { project } = useParams();

  const { data } = useChecklistChecklistRunStatisticRetrieveQuery({
    project,
  });
  return (
    <Card withBorder>
      <Text w={500}>Statistics for project: {project}</Text>
      <CardSection withBorder p="md">
        <Group>
          <Badge color="blue">Total Regressions: {data?.total}</Badge>
        </Group>
      </CardSection>
      <CardSection withBorder p="md">
        <Group>
          <Badge color="blue">Total duration: {data?.total_duration}</Badge>
          <Badge color="gray">Average duration: {data?.average_duration}</Badge>
        </Group>
      </CardSection>
      <CardSection withBorder p="md">
        <Group>
          <Badge color="blue">Started: {data?.started}</Badge>
          <Badge color="blue">Paused: {data?.paused}</Badge>
          <Badge color="blue">Total: {data?.total}</Badge>
          <Badge color="red">Failed: {data?.failed}</Badge>
          <Badge color="green">Passed: {data?.passed}</Badge>
        </Group>
      </CardSection>
    </Card>
  );
}

export default RunStatistic;
