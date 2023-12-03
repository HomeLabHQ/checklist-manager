import { Card, Col, Row } from "antd";
import ProjectList from "../components/projects/ProjectList";
import Header from "../components/shared/Header";
import { Content } from "antd/es/layout/layout";

export default function HomePage() {
  return (
    <>
      <Header />
      <Content>
        <Row justify={"center"}>
          <Col
            span={12}
            offset={6}
            style={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <Card title="Projects" style={{ width: 800 }}>
              <ProjectList />
            </Card>
          </Col>
        </Row>
      </Content>
    </>
  );
}
