import React, { useState, useContext } from "react";
import { Layout, Menu, Form, Input, Button, Modal, List, Avatar, message, DatePicker, Select, Space, Checkbox, Image, Row, Col, Upload } from "antd";
import { AuthContext } from "../../contexts/AuthContext"; // Context chứa userData
import AppHeader from "../../components/Header";
import AppFooter from "../../components/Footer";
import moment from "moment";
import styles from './ProfilePage.module.css';
import { userApi } from "../../api";
import Swal from "sweetalert2";
import { UploadOutlined } from "@ant-design/icons";
import { UploadChangeParam, UploadFile } from "antd/es/upload";

const { Option } = Select;
const { Content, Sider } = Layout;

const ProfilePage: React.FC = () => {
  const { userData } = useContext(AuthContext); // Lấy userData từ AuthContext
  const [selectedMenu, setSelectedMenu] = useState("profile");
  const [form] = Form.useForm();
  const [addresses, setAddresses] = useState(userData?.profile?.addresses || []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const [fullnameInputStatus, setFullnameInputStatus] = useState<"" | "error" | "warning" | undefined>("");
  const [phoneNumberInputStatus, setPhoneNumberInputStatus] = useState<"" | "error" | "warning" | undefined>("");
  const [emailInputStatus, setEmailInputStatus] = useState<"" | "error" | "warning" | undefined>("");
  const [genderInputStatus, setGenderInputStatus] = useState<"" | "error" | "warning" | undefined>("");
  const [dateOfBirthInputStatus, setDateOfBirthInputStatus] = useState<"" | "error" | "warning" | undefined>("");
  const [defaultAddressInputStatus, setDefaultAddressInputStatus] = useState<"" | "error" | "warning" | undefined>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const sideBarItems = [{key: 'profile', label: 'Thông tin'}, {key: 'addresses', label: 'Địa chỉ'}, {key: 'password', label: 'Mật khẩu'}];
  const countryCodeOptions = [{value: '84', label: '+84'}];

  const handleUpload = async (options: any) => {
    const { file, onError } = options;
    const formData = new FormData();
    // formData.append('image', file);
    formData.append('file', file as any);

    try {
      const res = await userApi.uploadAvatar(formData);
      const result = res.data;
      messageApi.success('Upload avatar thành công!');
      setImageUrl(result.avatar_url);
    } catch (err: any) {
      console.error('handleUpload catches error=', err);
      messageApi.error(err.message || 'Lỗi khi upload ảnh');
      onError(err)
    }
  }

  const handleChange = ({ file, fileList }: UploadChangeParam) => {// Vô dụng code, hàm tấu hề
    if (file.status === 'done') {
      messageApi.success(`${file.name} uploaded successfully`);

      const uploadedUrl = file.response?.data.url || file.response?.url;
      if(uploadedUrl) {
        setImageUrl(uploadedUrl);
      }
    } else if (file.status === 'error') {
      messageApi.error(`${file.name} upload failed.`);
    }
    setFileList(fileList);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type === "image/jpeg" || file.type === "image/png";
    if(!isImage) {
      messageApi.error('Chỉ được upload ảnh định dạng JPG hoặc PNG!');
      return Upload.LIST_IGNORE;
    }

    const isLt2m = file.size / 1024 / 1024 < 2;
    if(!isLt2m) {
      messageApi.error('Ảnh phải nhỏ hơn 2MB');
      return Upload.LIST_IGNORE;
    }

    return new Promise((resolve, reject) => {
      modal.confirm({
        title: 'Xác nhận',
        content: `Bạn có chắc chắn muốn upload hình ảnh "${file.name}"`,
        onOk: () => resolve(true),
        onCancel: () => reject('Cancaled by user!'),
      });
    });
  }
  
  const renderSendEmailVerificationCheckboxFormItem = () => {
    if(userData?.isEmailVerified) {
      return <>
      <Space.Compact style={{ width: '100%', alignItems: 'center' }}>
        <Form.Item name="email" label="Email (verified ✅✨)" style={{ width: '90%' }}>
          <Input disabled />
        </Form.Item>
        {/* <Button color="danger" variant="text">Change</Button> */}
      </Space.Compact>
      </>
    } else {
      return <>
        <Form.Item label="Email">
          <Space.Compact style={{ width: '100%' }}>
            <Form.Item name="emailUsername" noStyle rules={[{ required: true, message: 'Please input your email!'}]}>
              <Input placeholder="Email username" status={emailInputStatus} onBlur={() => setEmailInputStatus("")} />
            </Form.Item>
            <Form.Item name="emailDomain" noStyle rules={[{ required: true, message: 'Please select email domain!' }]}>
              <Select style={{ minWidth: '120' }} defaultActiveFirstOption>
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
            </Form.Item>
          </Space.Compact>
        </Form.Item>
        <Form.Item name="sendVerification" valuePropName="checked">
          <Checkbox>Send email verification</Checkbox>
        </Form.Item>
      </>
    }
  }
  
  const handleMenuClick = (e: any) => {
    setSelectedMenu(e.key);
  };

  const updateProfile = async (values: any) => {
    console.log("Raw values:", values);
    const { fullname, phoneNumber, gender, dateOfBirth, defaultAddress, sendVerification } = values;
    let errors: string[] = [];

    if(!fullname || fullname.trim() === "") {
      setFullnameInputStatus("error");
      errors.push("Họ và tên không được để trống");
    } else {
      setFullnameInputStatus("");
    }

    const phoneRegex = /^(0[2-9]\d{8,9})$/;
    if(!phoneNumber || !phoneRegex.test(phoneNumber) ) {
      setPhoneNumberInputStatus("error");
      errors.push("Số điện thoại không hợp lệ");
    } else {
      setPhoneNumberInputStatus("");
    }

    let email = values.email;
    if(!userData?.isEmailVerified) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const emailUsername = values.emailUsername;
      const emailDomain = values.emailDomain;
      if (emailUsername.includes("@")) {
        email = emailUsername;
      } else {
        email = `${emailUsername}${emailDomain}`;
      }
      if (!email || !emailRegex.test(email)) {
        setEmailInputStatus("error");
        errors.push("Email không hợp lệ.");
      } else {
        setEmailInputStatus("");
      }
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
      const birthDate = moment(dateOfBirth.toDate ? dateOfBirth.toDate() : dateOfBirth); // chuẩn hóa lại object
      const today = moment();
      const age = today.diff(birthDate, "years");
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

    const resultObject = {
      fullname,
      phoneNumber,
      email,
      sendVerification: sendVerification ? true : false,
      gender,
      dateOfBirth,
      defaultAddress,
    }
    
    const responseUpdateProfile = await userApi.updateUserProfile(userData!.id, resultObject);
    Swal.fire({
      title: "Update Profile",
      text: responseUpdateProfile.message,
      icon: "success",
    });
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
      messageApi.success("Address updated successfully!");
    } else {
      // Add new address
      setAddresses((prev: any) => [
        ...prev,
        { id: Date.now(), ...values },
      ]);
      messageApi.success("Address added successfully!");
    }
    setIsModalVisible(false);
    setEditingAddress(null);
  };

  const deleteAddress = (id: number) => {
    setAddresses((prev: any) => prev.filter((addr: any) => addr.id !== id));
    messageApi.success("Address deleted successfully!");
  };

  return (
    <>
    {messageContextHolder}
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
          {selectedMenu === "profile" && (
            <Row>
              <Col span={12} style={{ border: '3px solid orange' }} className={styles.profileLeftPanel}>
                <div>
                  <h2>Thông tin cá nhân</h2>
                  <Form
                    form={form}
                    initialValues={{
                      ...userData, // Giữ nguyên các giá trị khác
                      dateOfBirth: userData?.profile?.dateOfBirth ? moment(userData.profile.dateOfBirth) : null, // Chuyển đổi dateOfBirth
                      gender: userData?.profile?.gender ?? 'empty',
                      fullname: userData?.profile?.fullname,
                      phoneNumber: userData?.profile.phoneNumber,
                      emailUsername: userData?.email?.split('@')[0],
                      emailDomain: userData?.email ? userData.email.substring(userData.email.indexOf('@')) : '@gmail.com',
                    }}
                    onFinish={updateProfile}
                    layout="vertical"
                  >
                    <Form.Item name="fullname" label="Họ và Tên">
                      <Input status={fullnameInputStatus} />
                    </Form.Item>
                    <Form.Item name="phoneNumber" label="Số điện thoại">
                      <Space.Compact>
                        <Select defaultValue="84" options={countryCodeOptions} />
                        <Input defaultValue={userData?.profile?.phoneNumber} status={phoneNumberInputStatus} onBlur={() => setPhoneNumberInputStatus("")}  />
                      </Space.Compact>
                    </Form.Item>
                    {
                      renderSendEmailVerificationCheckboxFormItem()
                    }
                    <Form.Item name="gender" label="Giới tính">
                      <Select
                        options={[
                          { value: 'Male', label: 'Male' },
                          { value: 'Female', label: 'Female' },
                          { value: 'Others', label: 'Others' },
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
              </Col>
              <Col span={12} style={{ border: '3px solid blue' }} className={styles.profileRightPanel}>
                <div>
                  <Image
                    width={200}
                    src={imageUrl ? imageUrl : userData?.profile.avatar}
                    preview={false}
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: '50%', // 👈 làm tròn
                      objectFit: 'cover',  // 👈 giúp ảnh phủ đều không bị méo
                      border: '1px solid #ccc', // tuỳ chọn, thêm viền cho đẹp
                    }}
                  />
                  <br />
                  <Upload
                    name="file"
                    showUploadList={false}
                    customRequest={handleUpload}
                    listType="picture"
                    fileList={fileList}
                    onChange={handleChange}
                    beforeUpload={beforeUpload}
                    accept=".png, .jpg, .jpeg"
                  >
                    <Button icon={<UploadOutlined />}>Upload avatar</Button>
                  </Upload>
                </div>
              </Col>
            </Row>
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
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
              >
                <Form
                  initialValues={editingAddress || {}}
                  onFinish={handleSaveAddress}
                  layout="vertical"
                >
                  <Form.Item name="fullname" label="Họ và Tên">
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
        </Content>


      </Layout>

      <AppFooter />
    </Layout>
    {modalContextHolder}
    </>
  );
};

export default ProfilePage;