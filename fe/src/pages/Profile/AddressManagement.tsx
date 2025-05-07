import { Avatar, Button, Card, Divider, Empty, Form, Input, List, message, Modal, Select } from 'antd';
import { useContext, useEffect, useState } from 'react'
import AuthContext from '../../contexts/AuthContext';
import { Address } from '../../types/Address';
import { addressApi } from '../../api';
import { useLoading } from '../../contexts/LoadingContext';

const AddressManagement = () => {
    const { userData } = useContext(AuthContext);
    const { setIsLoading } = useLoading();
    const [messageApi, messageContextHolder] = message.useMessage();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const [form] = Form.useForm();
    const countryCodeOptions = [{value: '+84', label: '+84'}];

    useEffect(() => {
        getUserAddresses();
    }, []);

    const getUserAddresses = async () => {
        try {
            setIsLoading(true);
            const addresses = await addressApi.getUserAddesses();
            setAddresses(addresses);
        } catch (error) {
            console.error(error);
            messageApi.error('(!) getUserAddresses catch an error. Please watch logs!');
        } finally {
            setIsLoading(false);
        }
    }
    
    const renderDefaultAddressComponent = () => {
        if(!userData?.profile?.defaultAddress) {
            return <>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No default address" />
            </>;
        }

        return <>
            <div>
                <Card title="Địa chỉ mặc định" size="small">
                    <p>{userData.profile.fullname}</p>
                    <p style={{ color: 'gray' }}>{userData.profile.defaultAddress}</p>
                    <p>({userData.profile.phoneCode}) {userData.profile.phoneNumber}</p>
                </Card>
            </div>
        </>;
    }

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address);
        setIsModalVisible(true);
    };

    const handleSaveAddress = async (addressObj: Address) => {
        try {
            setIsLoading(true);
            if (editingAddress) { // Update existing address
                const updateAddressObj = await addressApi.updateAddress(editingAddress.id, addressObj);
                console.log('updateAddressObj=', updateAddressObj);
                setAddresses((prev: any) =>
                    prev.map((addr: any) =>
                        addr.id === editingAddress.id ? { ...editingAddress, ...addressObj } : addr
                    )
                );
                messageApi.success("Address updated successfully!");
            } else { // Add new address
                const createAddressObj = await addressApi.createAddress(addressObj);
                setAddresses((prev: any) => [
                    ...prev,
                    createAddressObj,
                ]);
                messageApi.success("Address added successfully!");
            }
        } catch (error) {
            console.error(error);
            messageApi.error('(!) handleSaveAddress catches an error. Please watch logs!');
        } finally {
            setIsModalVisible(false);
            setEditingAddress(null);
            setIsLoading(false);
        }
    };

    const deleteAddress = async (addressId: number) => {
        try {
            setIsLoading(true);
            const deleteAddressResult = await addressApi.deleteAddress(addressId);
            console.log('deleteAddressResult=', deleteAddressResult);
            setAddresses((prev: any) => prev.filter((addr: any) => addr.id !== addressId));
            messageApi.success("Address deleted successfully!");
        } catch (error) {
            console.error(error);
            messageApi.error('(!) deleteAddress catches an error. Please watch logs!');
        } finally {
            setIsLoading(false);
        }
    };
    
  return (
    <>
        {messageContextHolder}
        <div style={{ padding: '0 25px' }}>
            <Divider orientation="left" style={{ borderColor: 'lightgrey' }}>Quản Lý Địa Chỉ</Divider>
            { renderDefaultAddressComponent() }
            <div style={{ maxWidth: '500px' }}>
                <Divider orientation="left" variant='dashed' plain style={{ borderColor: '#f797ba' }}>Additional addresses:</Divider>
                <Button type="primary" onClick={() => setIsModalVisible(true)}>Thêm địa chỉ</Button>
            </div>
            
            <List
                itemLayout="horizontal"
                dataSource={addresses}
                renderItem={(item: Address) => (
                <List.Item
                    actions={[
                    <Button onClick={() => handleEditAddress(item)}>Sửa</Button>,
                    <Button danger onClick={() => deleteAddress(item.id)}>Xóa</Button>,
                    ]}
                >
                    <List.Item.Meta
                        avatar={<Avatar style={{ backgroundColor: "#87d068" }}>{item.fullname[0]}</Avatar>}
                        title={`${item.fullname} (${item.countryCode}) ${item.phoneNumber}`}
                        description={`${item.address}`}
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
                    form={form}
                    initialValues={editingAddress || {}}
                    onFinish={handleSaveAddress}
                    layout="vertical"
                >
                    <Form.Item name="fullname" label="Họ và Tên" rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="countryCode" label="Mã quốc gia" rules={[{ required: true, message: "Vui lòng chọn mã quốc gia!" }]}>
                        <Select options={countryCodeOptions} />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}>
                        <Input />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Lưu</Button>
                </Form>
            </Modal>
        </div>
    </>
  )
}

export default AddressManagement;