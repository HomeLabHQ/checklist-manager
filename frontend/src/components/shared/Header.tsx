import { Menu, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { logout } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router-dom";

interface Link {
  key: string;
  icon: React.ReactNode;
}
interface NavigationProps {
  links?: Link[];
}
export default function Header(props?: NavigationProps) {
  const dispatch = useDispatch();
  const items: MenuProps["items"] = [
    {
      label: "Checklist manager",
      key: "home",
      icon: (
        <Link to="/">
          <HomeOutlined />
        </Link>
      )
    }
  ];
  const utilities: MenuProps["items"] = [
    {
      icon: <Button onClick={() => dispatch(logout())}>Logout</Button>,
      key: "logout"
    },
    {
      icon: <ThemeToggle />,
      key: "theme"
    }
  ];
  if (props?.links && props?.links.length > 0) {
    items.push(...props.links);
    items.push(...utilities);
  } else {
    items.push(...utilities);
  }

  return <Menu items={items} selectable={true} mode="horizontal"></Menu>;
}
