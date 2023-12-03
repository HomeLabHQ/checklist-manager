import { Card, Col, Row } from "antd";
import { Link, useParams } from "react-router-dom";
import Header from "../components/shared/Header";
import CheckListTemplateList from "../components/checklist/CheckListTemplateList";
import CheckListRunList from "../components/checklist/linear/CheckListRunList";
import CheckListStats from "../components/checklist/linear/CheckListStats";
export default function ProjectPage() {
  const { project } = useParams();
  return (
    <div>
      <Header
        links={[
          {
            key: "project",
            icon: <Link to={`/${project}`}>{project}</Link>
          }
        ]}
      />
      <Row justify={"center"}>
        <Col
          span={21}
          offset={1}
          style={{
            display: "flex",
            alignItems: "center"
          }}
        >
          <Card title={`Checklists for  ${project}`}>
            {project && <CheckListTemplateList project={project} />}
            <Card title={`Analytics for ${project}`}>
              {project && (
                <Row>
                  <Col>
                    <CheckListRunList project={project} />
                  </Col>
                  <Col>
                    <CheckListStats project={project} />
                  </Col>
                </Row>
              )}
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
