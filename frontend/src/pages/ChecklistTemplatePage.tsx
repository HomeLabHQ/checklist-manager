import { Link, useParams } from "react-router-dom";
import { useChecklistChecklistRetrieveQuery, useChecklistProjectRetrieveQuery } from "../redux/api";
import Header from "../components/shared/Header";
import { Col, Row } from "antd";
import CheckListForm from "../components/checklist/CheckListForm";
import { Content } from "antd/es/layout/layout";

export default function CheckListTemplatePage() {
  const { project, template } = useParams();
  const { data: project_data } = useChecklistProjectRetrieveQuery(
    { code: project ?? "" },
    { skip: !project }
  );
  const { data: checklist_data } = useChecklistChecklistRetrieveQuery(
    { id: Number(template) },
    { skip: !template }
  );

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
            {checklist_data && project_data && (
              <CheckListForm project={project_data} checklist={checklist_data} />
            )}
            {!template && project_data && <CheckListForm project={project_data} />}
          </Col>
        </Row>
      </Content>
    </>
  );
}
