import { Input, Button, Form, Divider, message } from "antd";
import { userApi } from "../../api";
import { ChangePasswordDto } from "../../dto/change-password.dto";
import { useLoading } from "../../contexts/LoadingContext";

const PasswordManagement = () => {
    const { setIsLoading } = useLoading();
    const [form] = Form.useForm();
    const [messageApi, messageContextHolder] = message.useMessage();
    
    const handleChangePassword = async (values: ChangePasswordDto): Promise<void> => {
        try {
            setIsLoading(true);
            if(!values.currentPassword || !values.newPassword || !values.confirmNewPassword) {
                messageApi.error('Vui lòng điền đủ thông tin các field!');
                return;
            }
    
            if(values.newPassword !== values.confirmNewPassword) {
                messageApi.error('Mật khẩu mới và xác nhận lại không trùng khớp!');
                return;
            }

            if(values.newPassword === values.currentPassword) {
                messageApi.error('Mật khẩu mới và mật khẩu hiện tại phải khác nhau!');
                return;
            }
    
            const result = await userApi.changePassword(values);
            messageApi.success(result.message);
            form.resetFields();
        } catch (error: any) {
            console.error('error==', error);
            messageApi.error(error?.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {messageContextHolder}
            <div style={{ padding: '0 25px' }}>
                <Divider orientation="left" style={{ borderColor: 'lightgrey' }}>Đổi mật khẩu</Divider>
                <Form layout="vertical" onFinish={handleChangePassword} form={form}>
                    <Form.Item name="currentPassword" label="Mật khẩu hiện tại">
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="newPassword" label="Mật khẩu mới">
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="confirmNewPassword" label="Xác nhận mật khẩu mới">
                        <Input.Password />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Đổi mật khẩu</Button>
                </Form>
            </div>
        </>
    )
}

export default PasswordManagement;