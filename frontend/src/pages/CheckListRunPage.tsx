import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useChecklistChecklistRunItemsPartialUpdateMutation,
  useChecklistChecklistRunRetrieveQuery,
  useChecklistChecklistRunPartialUpdateMutation,
  CheckListRunStatusEnum,
  CheckListRunSectionItemCommentRead,
  CheckListRunSectionItemRead
} from "../redux/api";
import Header from "../components/shared/Header";
import {
  List,
  Row,
  Col,
  Button,
  Input,
  Progress,
  Card,
  Typography,
  Space,
  Badge,
  Tag,
  Statistic
} from "antd";
import dayjs from "dayjs";
import { ReactNode, useEffect, useState } from "react";
import { ChecklistRunStatuses, DateFormat } from "../settings/settings";
import ModalPopup from "../components/shared/ModalPopup";
import Footer from "../components/shared/Footer";
import CheckListRunItemMessageForm from "../components/checklist/linear/CheckListRunItemMessageForm";
import { useDuration } from "../hooks/useDuration";
import { Content } from "antd/es/layout/layout";
import StatusBadge from "../components/shared/StatusBadge";

export default function CheckListRunPage() {
  const { project, template_run } = useParams();
  const [duration, setDuration] = useState(0);
  const { data } = useChecklistChecklistRunRetrieveQuery({
    id: Number(template_run)
  });
  const [update] = useChecklistChecklistRunItemsPartialUpdateMutation();
  const [updateRun] = useChecklistChecklistRunPartialUpdateMutation();
  const navigate = useNavigate();
  const disabler = (status: string) => {
    if (status == "PASSED" || status == "FAILED") {
      return true;
    }
    return false;
  };
  const renderComments = (comments?: CheckListRunSectionItemCommentRead[]) => {
    return comments?.map((comment) => {
      return <List.Item key={comment.id}>{comment.message}</List.Item>;
    });
  };
  const renderFooter = (status?: CheckListRunStatusEnum) => {
    const statuses = ChecklistRunStatuses.filter((item) => item !== status);
    if (status == "FAILED" || status == "PASSED" || !data) {
      return [];
    }
    const actions: ReactNode[] = [];
    statuses.forEach((item) => {
      actions.push(
        <Button
          key={item}
          danger={item == "FAILED"}
          onClick={() =>
            updateRun({
              id: Number(data.id),
              patchedCheckListRunRequest: { status: item, duration: data.duration + duration }
            }).then(() => {
              navigate(`/${project}/`);
            })
          }
        >
          {item}
        </Button>
      );
    });
    return actions;
  };

  const renderInfo = () => {
    return (
      <>
        {}
        {data?.duration ? (
          <Statistic
            title="Duration"
            value={`${useDuration(data?.duration)} by ${data?.updated_by?.email ?? ""} `}
          />
        ) : null}
        <Tag color="blue">Total: {data?.line_items}</Tag>
        <Tag color="red">Failed: {data?.failed}</Tag>
        <Tag color="green">Passed: {data?.passed}</Tag>
      </>
    );
  };
  const renderSuffix = (item: CheckListRunSectionItemRead) => {
    return (
      <Space>
        {item.description}
        {item.status == "NOT_PERFORMED" && (
          <Space>
            <ModalPopup danger={true} message="Fail">
              <CheckListRunItemMessageForm id={item.id} />
            </ModalPopup>
            <Button
              type="primary"
              onClick={() =>
                update({
                  id: item.id,
                  patchedCheckListRunSectionItemRequest: {
                    status: "PASSED"
                  }
                })
              }
            >
              Check
            </Button>
          </Space>
        )}
        {Number(item.comments?.length) > 0 && (
          <Badge count={item.comments?.length}>
            <ModalPopup message="Comments" type="primary">
              <List>{renderComments(item.comments)}</List>
            </ModalPopup>
          </Badge>
        )}
      </Space>
    );
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
      <Header
        links={[
          {
            key: "project",
            icon: <Link to={`/${project}`}>{project}</Link>
          }
        ]}
      />
      <Content>
        <Row justify={"center"}>
          <Col span={18} offset={2}>
            {data && (
              <Card
                title={
                  <Space>
                    <StatusBadge status={data.status} />
                    {`${data?.checklist} started ${dayjs(data?.created_at).format(DateFormat)} by
                    ${data.created_by?.email}`}
                  </Space>
                }
              >
                {renderInfo()}
                {data?.status == "STARTED" && <Progress percent={data?.progress} size="small" />}
                {data?.sections?.map((section, index) => (
                  <List
                    key={index}
                    size="small"
                    header={
                      <Typography.Title level={4}>
                        {`${index + 1}.${section.title}`}
                        {data?.status == "STARTED" && (
                          <Progress percent={section.progress} size="small" />
                        )}
                      </Typography.Title>
                    }
                    dataSource={section.items}
                    renderItem={(item, item_index) => (
                      <Row>
                        <Col span={24}>
                          <List.Item>
                            <Input
                              readOnly
                              disabled={disabler(item.status)}
                              value={item.title}
                              addonBefore={`${index + 1}.${item_index + 1}`}
                              suffix={renderSuffix(item)}
                            />
                          </List.Item>
                        </Col>
                      </Row>
                    )}
                  />
                ))}
              </Card>
            )}
          </Col>
        </Row>
      </Content>
      <Footer elements={renderFooter(data?.status)} />
    </>
  );
}
