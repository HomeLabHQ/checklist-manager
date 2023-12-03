import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row, Typography, message } from "antd";
import { SignUpRequestWrite, useAuthRegisterCreateMutation } from "../redux/api";
import { useNavigate } from "react-router-dom";
const { Title } = Typography;
export default function SignUpPage() {
  const [register] = useAuthRegisterCreateMutation();
  const [msg, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const onFinish = (values: SignUpRequestWrite) => {
    register({ signUpRequest: values })
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        msg.error(`Error while logging in ${error.status} ${JSON.stringify(error.data)}`);
      });
  };
  return (
    <Row
      justify={"center"}
      style={{
        height: "100vh"
      }}
    >
      <Col
        span={12}
        offset={6}
        xs={{ span: 12, offset: 0 }}
        style={{
          display: "flex",
          alignItems: "center"
        }}
      >
        {contextHolder}
        <Card style={{ width: 500 }}>
          <Title level={2}>COAX Qualitet</Title>
          <Form name="signup" onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your Email!" }]}
            >
              <Input type="email" prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="first_name"
              rules={[{ required: true, message: "Please input your First name!" }]}
            >
              <Input type="text" prefix={<UserOutlined />} placeholder="First name" />
            </Form.Item>
            <Form.Item
              name="last_name"
              rules={[{ required: true, message: "Please input your Last name!" }]}
            >
              <Input type="text" prefix={<UserOutlined />} placeholder="Last name" />
            </Form.Item>
            <Form.Item name="password">
              <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button" block>
                Register
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
