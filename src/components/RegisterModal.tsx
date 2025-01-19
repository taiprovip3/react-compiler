import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Form, Input, Modal } from 'antd';
import React from 'react';
import Swal from 'sweetalert2';
import { authApi } from '../api';

interface RegisterModalProps {
    visible: boolean;
    onClose: () => void;
    onLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ visible, onClose, onLogin }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleRegister = async (): Promise<void> => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            const registerResponse = await authApi.register(values.username, values.password);
            console.log('registerResponse=', registerResponse);
            form.resetFields();
            Swal.fire({
                title: 'Thành công!',
                text: registerResponse.message,
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                onClose();
                onLogin();
            });
        } catch (error: any) {
            console.error(error);
            Swal.fire({
                title: 'Lỗi!',
                text: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau!',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            getContainer={false}
            title="Đăng ký tài khoản"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                name="registerForm"
                onFinish={handleRegister}
                layout="vertical"
            >
                <Form.Item
                    name="username"
                    label="Tên đăng nhập"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                >
                    <Input placeholder="Tên đăng nhập" autoFocus />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                        { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
                    ]}
                >
                    <Input.Password
                        placeholder="Mật khẩu"
                        iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                    />
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                        },
                        }),
                    ]}
                >
                    <Input.Password
                        placeholder="Xác nhận mật khẩu"
                        iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{ width: '100%' }}
                    >
                        Đăng ký
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="link" onClick={onLogin}>Đã có tài khoản? Đăng nhập ngay!</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default RegisterModal;