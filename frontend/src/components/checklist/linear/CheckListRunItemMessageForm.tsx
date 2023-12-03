import { Button, Form, Input } from "antd";
import {
  CheckListRunSectionItemCommentRequest,
  useChecklistChecklistRunItemCommentsCreateMutation
} from "../../../redux/api";

type CheckListRunItemMessageFormProps = {
  id: number;
  handleClose?: () => void;
};
export default function CheckListRunItemMessageForm(
  props: Readonly<CheckListRunItemMessageFormProps>
) {
  const [addComment] = useChecklistChecklistRunItemCommentsCreateMutation();
  const submit = (values: CheckListRunSectionItemCommentRequest) => {
    addComment({ checkListRunSectionItemCommentRequest: values });
    props.handleClose?.();
  };
  return (
    <Form initialValues={{ item: props.id }} layout="vertical" onFinish={submit}>
      <Form.Item name="item" hidden={true}>
        <Input type="text" />
      </Form.Item>
      <Form.Item
        label="Reason"
        name="message"
        rules={[{ required: true, message: "Please Enter reason" }]}
      >
        <Input type="textarea" />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
}
