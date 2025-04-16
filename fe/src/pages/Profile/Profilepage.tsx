import React, { useState } from "react";
import { Layout, Menu, Form, Input, Button } from "antd";
import AppHeader from "../../components/Header";
import AppFooter from "../../components/Footer";
import UserInfomation from "../../components/Profile/UserInfomation";
import AddressManagement from "../../components/Profile/AddressManagement";

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

            {selectedMenu === "password" && (
              <div>
                <h2>Đổi mật khẩu</h2>
                <Form layout="vertical" onFinish={(values) => console.log("Changing password with:", values)}>
                  <Form.Item name="currentPassword" label="Mật khẩu hiện tại">
                    <Input.Password />
                  </Form.Item>
                  <Form.Item name="newPassword" label="Mật khẩu mới">
                    <Input.Password />
                  </Form.Item>
                  <Form.Item name="confirmPassword" label="Xác nhận mật khẩu mới">
                    <Input.Password />
                  </Form.Item>
                  <Button type="primary" htmlType="submit">
                    Đổi mật khẩu
                  </Button>
                </Form>
              </div>
            )}
          </Content>


        </Layout>

        <AppFooter />
      </Layout>
    </>
  );
};

export default ProfilePage;