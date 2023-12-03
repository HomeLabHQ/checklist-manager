import { DeleteOutlined } from "@ant-design/icons";
import { FormListFieldData } from "antd";

interface FormItemControlProps {
  remove: (index: number) => void;
  item: FormListFieldData;
}
export default function FormItemControl(props: Readonly<FormItemControlProps>) {
  const { remove, item } = props;
  return (
    <>
      <DeleteOutlined
        onClick={() => {
          remove(item.name);
        }}
      />
    </>
  );
}
