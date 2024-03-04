import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Text,
  Group,
  Menu,
  ActionIcon,
  rem,
  Badge,
  Fieldset,
  TextInput,
  Button,
} from '@mantine/core';
import {
  IconCircle,
  IconCircleCheck,
  IconCircleOff,
  IconCircleX,
  IconDots,
  IconEye,
  IconFileZip,
  IconTrash,
} from '@tabler/icons-react';
import {
  CheckListRunRead,
  CheckListRunSectionItemRead,
  CheckListRunSectionRead,
  useChecklistChecklistRunItemsPartialUpdateMutation,
  useChecklistChecklistRunPartialUpdateMutation,
  useChecklistChecklistRunRetrieveQuery,
} from '@/redux/api';
import formatDate from '@/hooks/formatDate';

function RunItem() {
  const { project, run } = useParams();
  const [duration, setDuration] = useState(0);
  const { data } = useChecklistChecklistRunRetrieveQuery({ id: Number(run) }, { skip: !run });
  const [update] = useChecklistChecklistRunItemsPartialUpdateMutation();
  const [updateRun] = useChecklistChecklistRunPartialUpdateMutation();
  const navigate = useNavigate();

  const renderInfo = () => (
    <Group>
      <Text>
        Regression for: {data?.check_list.title} from {formatDate(data?.created_at)}
      </Text>
      <Badge>{data?.status}</Badge>
    </Group>
  );
  const renderLeft = (item: CheckListRunSectionItemRead) => {
    if (item.status === 'PASSED') {
      return <IconCircleCheck color="green" />;
    }
    if (item.status === 'FAILED') {
      return <IconCircleX color="red" />;
    }
    if (item.status === 'NOT_PERFORMED') {
      return <IconCircle />;
    }
    return null;
  };
  const renderRight = (item: CheckListRunSectionItemRead) => {
    if (item.status === 'PASSED' || item.status === 'FAILED') {
      return null;
    }
    return (
      <>
        <ActionIcon
          size={32}
          color="green"
          variant="filled"
          onClick={() => {
            update({
              id: item.id,
              patchedCheckListRunSectionItemRequest: {
                status: 'PASSED',
              },
            });
          }}
        >
          <IconCircleCheck />
        </ActionIcon>
        <ActionIcon
          size={32}
          variant="filled"
          color="red"
          onClick={() => {
            update({
              id: item.id,
              patchedCheckListRunSectionItemRequest: {
                status: 'FAILED',
              },
            });
          }}
        >
          <IconCircleOff />
        </ActionIcon>
      </>
    );
  };
  const renderFooter = (run_data?: CheckListRunRead) => {
    if (run_data?.status === 'PASSED' || run_data?.status === 'FAILED') {
      return null;
    }
    if (run_data?.status === 'STARTED') {
      return (
        <Group>
          <Button
            color="red"
            onClick={() =>
              updateRun({
                id: Number(data?.id),
                patchedCheckListRunRequest: {
                  status: 'FAILED',
                  duration: Number(data?.duration) + duration,
                },
              }).then(() => {
                navigate(`project/${project}`);
              })
            }
          >
            Fail
          </Button>
          <Button
            color="green"
            onClick={() =>
              updateRun({
                id: Number(data?.id),
                patchedCheckListRunRequest: {
                  status: 'PASSED',
                  duration: Number(data?.duration) + duration,
                },
              }).then(() => {
                navigate(`/project/${project}`);
              })
            }
          >
            Pass
          </Button>
          <Button
            color="grey"
            onClick={() =>
              updateRun({
                id: Number(data?.id),
                patchedCheckListRunRequest: {
                  status: 'PAUSED',
                  duration: Number(data?.duration) + duration,
                },
              }).then(() => {
                navigate(`/project/${project}/`);
              })
            }
          >
            Pause
          </Button>
        </Group>
      );
    }
    return null;
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prevTimer) => prevTimer + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Card withBorder shadow="sm" radius="md">
        <Card.Section withBorder inheritPadding py="xs">
          <Group justify="space-between">
            {renderInfo()}
            <Menu withinPortal position="bottom-end" shadow="sm">
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray">
                  <IconDots style={{ width: rem(16), height: rem(16) }} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconFileZip style={{ width: rem(14), height: rem(14) }} />}
                >
                  Download zip
                </Menu.Item>
                <Menu.Item leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
                  Preview all
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                  color="red"
                >
                  Delete all
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Card.Section>
        {data?.sections?.map((section: CheckListRunSectionRead, index) => (
          <Fieldset legend={section.title} key={index}>
            {section.items?.map((item: CheckListRunSectionItemRead, item_index) => (
              <TextInput
                radius="xl"
                key={item_index}
                size="md"
                disabled
                placeholder={item.title}
                rightSectionWidth={42}
                leftSection={renderLeft(item)}
                rightSection={renderRight(item)}
              />
            ))}
          </Fieldset>
        ))}
        {renderFooter(data)}
      </Card>
    </>
  );
}

export default RunItem;
