import React, { useState, useContext } from "react";
import { Layout, Menu, Form, Input, Button, Modal, List, Avatar, message } from "antd";
import styled from "styled-components";
import { AuthContext } from "../contexts/AuthContext"; // Context chứa userData

const { Content, Sider } = Layout;

const StyledContent = styled(Content)`
  padding: 24px;
  background-color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ProfileComponent: React.FC = () => {
  const { userData } = useContext(AuthContext); // Lấy userData từ AuthContext
  const [selectedMenu, setSelectedMenu] = useState("profile");
  const [form] = Form.useForm();
  const [addresses, setAddresses] = useState(userData.addresses || []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const handleMenuClick = (e: any) => {
    setSelectedMenu(e.key);
  };

  const updateProfile = (values: any) => {
    console.log("Updating profile with values:", values);
    message.success("Profile updated successfully!");
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setIsModalVisible(true);
  };

  const handleSaveAddress = (values: any) => {
    if (editingAddress) {
      // Update existing address
      setAddresses((prev: any) =>
        prev.map((addr: any) =>
          addr.id === editingAddress.id ? { ...editingAddress, ...values } : addr
        )
      );
      message.success("Address updated successfully!");
    } else {
      // Add new address
      setAddresses((prev: any) => [
        ...prev,
        { id: Date.now(), ...values },
      ]);
      message.success("Address added successfully!");
    }
    setIsModalVisible(false);
    setEditingAddress(null);
  };

  const deleteAddress = (id: number) => {
    setAddresses((prev: any) => prev.filter((addr: any) => addr.id !== id));
    message.success("Address deleted successfully!");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={["profile"]}
          onClick={handleMenuClick}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item key="profile">Thông tin Profile</Menu.Item>
          <Menu.Item key="addresses">Địa chỉ</Menu.Item>
          <Menu.Item key="password">Đổi mật khẩu</Menu.Item>
        </Menu>
      </Sider>

      <StyledContent>
        {selectedMenu === "profile" && (
          <div>
            <h2>Thông tin cá nhân</h2>
            <Form
              form={form}
              initialValues={userData}
              onFinish={updateProfile}
              layout="vertical"
            >
              <Form.Item name="fullName" label="Họ và Tên">
                <Input />
              </Form.Item>
              <Form.Item name="phoneNumber" label="Số điện thoại">
                <Input />
              </Form.Item>
              <Form.Item name="gender" label="Giới tính">
                <Input />
              </Form.Item>
              <Form.Item name="dateOfBirth" label="Ngày sinh">
                <Input />
              </Form.Item>
              <Form.Item name="defaultAddress" label="Địa chỉ mặc định">
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form>
          </div>
        )}

        {selectedMenu === "addresses" && (
          <div>
            <h2>Quản lý địa chỉ</h2>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
              Thêm địa chỉ
            </Button>
            <List
              itemLayout="horizontal"
              dataSource={addresses}
              renderItem={(item: any) => (
                <List.Item
                  actions={[
                    <Button onClick={() => handleEditAddress(item)}>Sửa</Button>,
                    <Button danger onClick={() => deleteAddress(item.id)}>
                      Xóa
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: "#87d068" }}>{item.fullName[0]}</Avatar>}
                    title={item.fullName}
                    description={`${item.address} - ${item.phoneNumber}`}
                  />
                </List.Item>
              )}
            />
            <Modal
              title={editingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ"}
              visible={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              footer={null}
            >
              <Form
                initialValues={editingAddress || {}}
                onFinish={handleSaveAddress}
                layout="vertical"
              >
                <Form.Item name="fullName" label="Họ và Tên">
                  <Input />
                </Form.Item>
                <Form.Item name="phoneNumber" label="Số điện thoại">
                  <Input />
                </Form.Item>
                <Form.Item name="countryCode" label="Mã quốc gia">
                  <Input />
                </Form.Item>
                <Form.Item name="address" label="Địa chỉ">
                  <Input />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                  Lưu
                </Button>
              </Form>
            </Modal>
          </div>
        )}

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
      </StyledContent>
    </Layout>
  );
};

export default ProfileComponent;