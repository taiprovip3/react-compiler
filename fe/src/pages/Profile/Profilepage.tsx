import React, { useState } from "react";
import { Layout, Menu } from "antd";
import UserInfomation from "../../components/Profile/UserInfomation";
import AddressManagement from "../../components/Profile/AddressManagement";
import PasswordManagement from "../../components/Profile/PasswordManagement";

const { Content, Sider } = Layout;

const ProfilePage: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState("profile");

  const sideBarItems = [{key: 'profile', label: 'Thông tin'}, {key: 'addresses', label: 'Địa chỉ'}, {key: 'password', label: 'Mật khẩu'}];
  
  const handleMenuClick = (e: any) => {
    setSelectedMenu(e.key);
  };

  return (
    <Layout>
      <Sider
        className="site-layout-background"
        style={{ height: '100vh' }}
        breakpoint="lg"
        collapsedWidth={0}
        onBreakpoint={(broken) => {
          console.log('broken=', broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["profile"]}
          onClick={handleMenuClick}
          style={{ height: "100%", borderRight: 0 }}
          items={sideBarItems}
        >
        </Menu>
      </Sider>
      <Content>
        {selectedMenu === "profile" && <UserInfomation /> }

        {selectedMenu === "addresses" && <AddressManagement /> }

        {selectedMenu === "password" && <PasswordManagement />}
      </Content>
    </Layout>
  );
};

export default ProfilePage;