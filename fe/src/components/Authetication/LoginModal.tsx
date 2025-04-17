import React from 'react';
import { Modal, Button, Form, Input, Checkbox, message } from 'antd';
import { AuthContext } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';
import { authApi, userApi } from '../../api';
import { jwtDecode } from 'jwt-decode';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onRegister: () => void;
}

interface JwtPayload {
  sub: number;        // userId
  username: string;
  role?: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose, onRegister }) => {
  const { setUserData } = React.useContext(AuthContext)!;
  const [form] = Form.useForm();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState<boolean>(false);
  const usernameInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleLogin = () => {
    form.validateFields().then(async (values: { username: string; password: string; }) => {
      console.log('Login values:', values);
      setLoading(true);
      try {
        const loginResponse = await authApi.login(values.username, values.password);
  
        if (loginResponse.accessToken) {
          const accessToken = loginResponse.accessToken;
          const decoded = jwtDecode<JwtPayload>(accessToken);
          const userId = decoded.sub;
          sessionStorage.setItem('accessToken', accessToken);
          sessionStorage.setItem('userId', userId.toString());
          
          const userDataResponse = await userApi.getUserData(userId); // Gọi API lấy thông tin người dùng
          setUserData(userDataResponse);
          onClose();
          if(userDataResponse) {
            console.log('Thông tin người dùng:', userDataResponse);
          } else {
            console.info(`User ${values.username} chỉ vừa mới tạo acc. Chưa có profile!`)
          }
          messageApi.success(`Welcome back, ${userDataResponse.username}`);
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong. No access token return from server!',
            icon: 'error',
            confirmButtonText: 'Oops!'
          });
        }
      } catch (error: any) {
        console.error('error=', error);
        Swal.fire({
          title: error?.response.data.error,
          text: error?.response?.data?.message,
          icon: 'error',
          confirmButtonText: 'Oops!'
        });
      } finally {
        setLoading(false);
      }
    });
  };

  React.useEffect(() => {
    if (visible && usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, [visible]);

  return (
    <>
      {messageContextHolder}
      <Modal
        getContainer={false}
        title="Đăng nhập"
        open={visible}
        onCancel={onClose}
        footer={null}
      >
        <Form
          form={form}
          name="loginForm"
          onFinish={handleLogin}
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            initialValue={'user02'}
          >
            <Input placeholder="Tên đăng nhập" ref={(input) => (usernameInputRef.current = input?.input || null)} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            initialValue={'123123az'}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Ghi nhớ mật khẩu</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              Đăng nhập
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="link" onClick={onRegister}>
              Chưa có tài khoản? Đăng ký ngay!
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default LoginModal;