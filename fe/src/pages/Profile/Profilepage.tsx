import React, { useState } from "react";
import { Layout, Menu } from "antd";
import AppHeader from "../../components/Header";
import AppFooter from "../../components/Footer";
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
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <AppHeader />
        <Layout>


          <Sider width={200} className="site-layout-background">
            <Menu
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
        <AppFooter />
      </Layout>
    </>
  );
};

export default ProfilePage;