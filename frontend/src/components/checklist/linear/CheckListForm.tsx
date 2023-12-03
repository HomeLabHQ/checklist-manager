import { Button, Card, Form, Input, Row, Flex } from "antd";
import {
  CheckListRead,
  CheckListRequest,
  ProjectRead,
  useChecklistChecklistCreateMutation,
  useChecklistChecklistUpdateMutation
} from "../../../redux/api";
import CheckListItemForm from "./CheckListItemForm";
import { Link, useNavigate } from "react-router-dom";
import FormItemControl from "../../shared/FormItemControl";
import { useRef } from "react";
export default function CheckListForm(
  props: Readonly<{ project: ProjectRead; checklist?: CheckListRead }>
) {
  const [addChecklist] = useChecklistChecklistCreateMutation();
  const [update] = useChecklistChecklistUpdateMutation();
  const dragItem = useRef(0);
  const dragOverItem = useRef(0);
  const navigate = useNavigate();
  const handleSort = (move: (to: number, from: number) => void) => {
    move(dragItem.current, dragOverItem.current);
  };

  const submit = (values: CheckListRequest) => {
    const sections = values.sections?.map((item, index) => {
      const items = item.items?.map((line_item, line_index) => {
        return { ...line_item, order: line_index + 1 };
      });
      return { ...item, order: index + 1, items: items };
    });
    if (props.checklist) {
      update({ id: Number(props.checklist.id), checkListRequest: { ...values, sections } }).then(
        () => {
          navigate(`/${props.project.code}`);
        }
      );
      return;
    }
    addChecklist({ checkListRequest: { ...values, sections } })
      .unwrap()
      .then(() => {
        navigate(`/${props.project.code}`);
      })
      .catch(() => {});
  };
  return (
    <Form
      initialValues={props.checklist ? { ...props.checklist } : { project: props.project.id }}
      layout="vertical"
      onFinish={submit}
    >
      <Form.Item name="project" hidden={true}>
        <Input type="text" />
      </Form.Item>
      <Form.Item
        label="Checklist name"
        name="title"
        rules={[{ required: true, message: "Please input template name" }]}
      >
        <Input />
      </Form.Item>
      <Form.List name="sections">
        {(fields, { add, remove, move }) => {
          return (
            <div className="list-sort">
              {fields.map((field, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => (dragItem.current = index)}
                  onDragEnter={() => (dragOverItem.current = index)}
                  onDragEnd={() => handleSort(move)}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <Card key={field.key}>
                    <Row gutter={16}>
                      <Form.Item
                        name={[index, "title"]}
                        label="Section name"
                        rules={[{ required: true }]}
                      >
                        <Input
                          addonBefore={index + 1}
                          placeholder="Section name"
                          suffix={FormItemControl({
                            remove,
                            item: field
                          })}
                        />
                      </Form.Item>
                    </Row>
                    <Form.Item>
                      <CheckListItemForm fieldKey={field.name} section={index + 1} />
                    </Form.Item>
                  </Card>
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} style={{ width: "60%" }}>
                  Add Section
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>
      <Flex justify="space-between" align="space-around">
        <Link to={`/${props.project.code}`}>
          <Button>Cancel</Button>
        </Link>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Flex>
    </Form>
  );
}
