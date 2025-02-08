import React, { useState, useContext } from "react";
import { Layout, Menu, Form, Input, Button, Modal, List, Avatar, message, DatePicker, Select, Space } from "antd";
import styled from "styled-components";
import { AuthContext } from "../../contexts/AuthContext"; // Context chứa userData
import AppHeader from "../../components/Header";
import AppFooter from "../../components/Footer";
import moment from "moment";

const { Option } = Select;
const { Content, Sider } = Layout;

const StyledContent = styled(Content)`
  padding: 24px;
  background-color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Profilepage: React.FC = () => {
  const { userData } = useContext(AuthContext); // Lấy userData từ AuthContext
  const [selectedMenu, setSelectedMenu] = useState("profile");
  const [form] = Form.useForm();
  const [addresses, setAddresses] = useState(userData?.addresses || []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [fullNameInputStatus, setFullNameInputStatus] = useState<"" | "error" | "warning" | undefined>("");
  const [phoneNumberInputStatus, setPhoneNumberInputStatus] = useState<"" | "error" | "warning" | undefined>("");
  const [emailInputStatus, setEmailInputStatus] = useState<"" | "error" | "warning" | undefined>("");
  const [genderInputStatus, setGenderInputStatus] = useState<"" | "error" | "warning" | undefined>("");
  const [dateOfBirthInputStatus, setDateOfBirthInputStatus] = useState<"" | "error" | "warning" | undefined>("");
  const [defaultAddressInputStatus, setDefaultAddressInputStatus] = useState<"" | "error" | "warning" | undefined>("");

  const items = [
    {key: 'profile', label: 'Thông tin'}, {key: 'addresses', label: 'Địa chỉ'}, {key: 'password', label: 'Mật khẩu'}
  ]
  
  const selectAfter = (
    <Select defaultValue="@gmail.com">
      <Option value="@gmail.com">@gmail.com</Option>
      <Option value="@yahoo.com">@yahoo.com</Option>
      <Option value="@yahoo.com.vn">@yahoo.com.vn</Option>
      <Option value="@outlook.com">@outlook.com</Option>
      <Option value="@hotmail.com">@hotmail.com</Option>
      <Option value="@live.com">@live.com</Option>
      <Option value="@icloud.com">@icloud.com</Option>
      <Option value="@edu.vn">@edu.vn</Option>
      <Option value="@.edu">@.edu</Option>
      <Option value="@.ac.uk">@.ac.uk</Option>
      <Option value="@gov.vn">@gov.vn</Option>
      <Option value="@mail.ru">@mail.ru</Option>
      <Option value="@qq.com">@qq.com</Option>
      <Option value="@naver.com">@naver.com</Option>
      <Option value="@daum.net">@daum.net</Option>
      <Option value="@yandex.ru">@yandex.ru</Option>
    </Select>
  );

  const options = [
    {
      value: '84',
      label: '+84',
    },
  ];
  
  const handleMenuClick = (e: any) => {
    setSelectedMenu(e.key);
  };

  const updateProfile = (values: any) => {
    console.log("Updating profile with values:", values);
    // handle validate here...
    const { fullName, phoneNumber, email, gender, dateOfBirth, defaultAddress } = values;
    let errors: string[] = [];

    if(!fullName || fullName.trim() === "") {
      setFullNameInputStatus("error");
      errors.push("Họ và tên không được để trống");
    } else {
      setFullNameInputStatus("");
    }

    const phoneRegex = /^(0[2-9]\d{8,9})$/;
    if(!phoneNumber || !phoneRegex.test(phoneNumber) ) {
      setPhoneNumberInputStatus("error");
      errors.push("Số điện thoại không hợp lệ");
    } else {
      setPhoneNumberInputStatus("");
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      setEmailInputStatus("error");
      errors.push("Email không hợp lệ.");
    } else {
      setEmailInputStatus("");
    }

    if(!gender || gender === "empty") {
      setGenderInputStatus("error");
      errors.push("Giới tính chưa chọn hoặc không hợp lệ!");
    } else {
      setGenderInputStatus("");
    }

    console.log('dateOfBirth=', dateOfBirth);
    
    if(!dateOfBirth || !moment(dateOfBirth).isValid()) {
      setDateOfBirthInputStatus("error");
      errors.push("Ngày sinh không hợp lệ");
    } else {
      const age = moment().diff(moment(dateOfBirth.$d), "years");
      console.log("age =", age);
      if(age < 14) {
        setDateOfBirthInputStatus("error");
        errors.push("Bạn phải 14 tuổi trở lên để bán PC :v!");
      } else {
        setDateOfBirthInputStatus("");
      }
    }

    if(!defaultAddress || defaultAddress.trim() === "") {
      setDefaultAddressInputStatus("error");
      errors.push("Địa chỉ không được để trống");
    } else {
      setDefaultAddressInputStatus("");
    }

    if(errors.length > 0) {
      errors.forEach((err) => messageApi.error(err));
      return;
    }

    messageApi.success("Cập nhật hồ sơ thành công!");
    console.log("Valid data:", values);
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
    <>
    {contextHolder}
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
      <Layout>

      
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={["profile"]}
            onClick={handleMenuClick}
            style={{ height: "100%", borderRight: 0 }}
            items={items}
          >
          </Menu>
        </Sider>
        <Content>
          <StyledContent>
            {selectedMenu === "profile" && (
              <div>
                <h2>Thông tin cá nhân</h2>
                <Form
                  form={form}
                  initialValues={{
                    ...userData, // Giữ nguyên các giá trị khác
                    dateOfBirth: userData?.dateOfBirth ? moment(userData.dateOfBirth) : null, // Chuyển đổi dateOfBirth
                    gender: userData?.gender ?? 'empty',
                  }}
                  onFinish={updateProfile}
                  layout="vertical"
                >
                  <Form.Item name="fullName" label="Họ và Tên">
                    <Input status={fullNameInputStatus} />
                  </Form.Item>
                  <Form.Item name="phoneNumber" label="Số điện thoại">
                    <Space.Compact>
                      <Select defaultValue="84" options={options} />
                      <Input defaultValue={userData?.phoneNumber} status={phoneNumberInputStatus} onBlur={() => setPhoneNumberInputStatus("")}  />
                    </Space.Compact>
                  </Form.Item>
                  <Form.Item name="email" label="Email">
                    <Input addonAfter={selectAfter} status={emailInputStatus} onBlur={() => setEmailInputStatus("")} />
                  </Form.Item>
                  <Form.Item name="gender" label="Giới tính">
                    <Select
                      style={{ width: 200 }}
                      options={[
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                        { value: 'gay', label: 'Gay' },
                        { value: 'lgbt', label: 'LGBT' },
                        { value: 'unknow', label: 'Unknow' },
                        { value: 'empty', label: 'Select gender', disabled: true },
                      ]}
                      status={genderInputStatus}
                      onBlur={() => setGenderInputStatus("")} 
                    />
                  </Form.Item>
                  <Form.Item name="dateOfBirth" label="Ngày sinh">
                    <DatePicker
                      format="YYYY-MM-DD"
                      status={dateOfBirthInputStatus}
                      onBlur={() => setDateOfBirthInputStatus("")} 
                    />
                  </Form.Item>
                  <Form.Item name="defaultAddress" label="Địa chỉ mặc định">
                    <Input status={defaultAddressInputStatus} onBlur={() => setDefaultAddressInputStatus("")}  />
                  </Form.Item>
                  <Button type="primary" htmlType="submit">Cập nhật</Button>
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
        </Content>


      </Layout>

      <AppFooter />
    </Layout>
    </>
  );
};

export default Profilepage;