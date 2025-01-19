import React from 'react';
import { Modal, Button, Form, Input, Checkbox } from 'antd';
import { AuthContext } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import { authApi, userApi } from '../api';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose, onRegister }) => {
  const { setUserData } = React.useContext(AuthContext)!;
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState<boolean>(false);
  const usernameInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleLogin = () => {
    form.validateFields().then(async (values) => {
      console.log('Login values:', values);
      setLoading(true);
      try {
        const loginResponse = await authApi.login(values.username, values.password);
  
        if (loginResponse.isLogged) {
          sessionStorage.setItem('accessToken', loginResponse.accessToken);
          sessionStorage.setItem('refreshToken', loginResponse.refreshToken);
          const profileResponse = await userApi.getUserProfile(); // Gọi API lấy thông tin người dùng
          if(profileResponse) {
            setUserData(profileResponse);
            console.log('Thông tin người dùng:', profileResponse);
            onClose();
          }
        }
      } catch (error: any) {
        console.error('error=', error);
        if (error.response && error.response.data.message === 'Bad credentials') {
          Swal.fire({
            title: 'Error!',
            text: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'Oops!'
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Có lỗi xảy ra, vui lòng thử lại sau!',
            icon: 'error',
            confirmButtonText: 'Oops!'
          });
        }
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
          >
            <Input placeholder="Tên đăng nhập" ref={(input) => (usernameInputRef.current = input?.input || null)} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
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