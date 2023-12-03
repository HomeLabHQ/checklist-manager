import { Layout, Space } from "antd";
import { ReactNode } from "react";
interface FooterProps {
  style?: StylePropertyMap;
  elements?: ReactNode[];
}
export default function Footer(props: Readonly<FooterProps>) {
  return (
    <Layout.Footer
      style={{
        bottom: 0,
        width: "100%",
        textAlign: "center"
      }}
    >
      <Space>{props.elements}</Space>
    </Layout.Footer>
  );
}
