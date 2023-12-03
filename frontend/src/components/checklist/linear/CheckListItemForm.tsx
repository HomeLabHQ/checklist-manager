import { Form, Button, Input, Row, Col } from "antd";

import { PlusOutlined } from "@ant-design/icons";
import FormItemControl from "../../shared/FormItemControl";
import TextArea from "antd/es/input/TextArea";
import { useRef } from "react";

const CheckListItemForm = (props: { fieldKey: number; section?: number }) => {
  const dragItem = useRef(0);
  const dragOverItem = useRef(0);
  const handleSort = (move: (to: number, from: number) => void) => {
    move(dragItem.current, dragOverItem.current);
  };
  return (
    <Form.List name={[props.fieldKey, "items"]}>
      {(items, { add, remove, move }) => {
        return (
          <>
            {items.map((item, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => (dragItem.current = index)}
                onDragEnter={() => (dragOverItem.current = index)}
                onDragEnd={() => handleSort(move)}
                onDragOver={(e) => e.preventDefault()}
              >
                <Row key={item.key} gutter={16}>
                  <Col offset={2} span={8}>
                    <Form.Item
                      name={[item.name, "title"]}
                      label="Step"
                      rules={[
                        {
                          required: true,
                          message: "Title missing"
                        }
                      ]}
                    >
                      <Input addonBefore={`${props.section}.${index + 1}`} type="text" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={[item.name, "description"]} label="Expected result">
                      <TextArea />
                    </Form.Item>
                  </Col>
                  <FormItemControl remove={remove} item={item} />
                </Row>
              </div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => {
                  add();
                }}
              >
                <PlusOutlined /> Add Item
              </Button>
            </Form.Item>
          </>
        );
      }}
    </Form.List>
  );
};

export default CheckListItemForm;
