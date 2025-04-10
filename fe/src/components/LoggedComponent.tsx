import React from 'react';
import { Badge, Button, Dropdown, MenuProps } from 'antd';
import { BellOutlined, DownOutlined, LogoutOutlined, ProductOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { authApi } from '../api';

const LoggedComponent: React.FC = () => {
  const { userData, setUserData } = React.useContext(AuthContext);
  const itemCount = 1;
  const navigate = useNavigate();

  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'logout':
        handleLogout();
        break;
      case 'account-setting':
        navigate('/profile');
        break;
      case 'my-wall':
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    await authApi.logout();
    setUserData(null);
  };

  const items: MenuProps['items'] = [
      { key: 'account-setting', label: 'Tài khoản', icon: <UserOutlined /> },
      { key: 'my-wall', label: 'Wall của bạn', icon: <ProductOutlined /> },
      { type: 'divider' },
      { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true },
  ];

  return (
    <div style={{ border: '1px solid lime', paddingRight: '15px', textWrap: 'wrap', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      <Dropdown menu={{ items, onClick }} trigger={['hover']} placement="bottomLeft">
          <Button onClick={(e) => e.preventDefault()} type="text" style={{ color: 'white' }} icon={<UserOutlined />}>{userData?.username}<DownOutlined /></Button>
      </Dropdown>
      <Badge size='small' count={itemCount} offset={[-1, -2]}>
          <BellOutlined style={{ color: 'white', fontSize: '18px', cursor: 'pointer' }} />
      </Badge>
    </div>
  );
}

export default LoggedComponent;