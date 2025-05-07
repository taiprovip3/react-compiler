import React from 'react';
import { Badge, Button, Dropdown, MenuProps, message } from 'antd';
import { BellOutlined, DownOutlined, LogoutOutlined, ProductOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { authApi } from '../../api';
import styled from 'styled-components';

const LoginDiv = styled.div`
  max-width: 100%;
  color: white;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: white;
    color: black;
  }
`;
interface LoggedComponentProps {
  openLoginModal: () => void;
}

const LoggedComponent: React.FC<LoggedComponentProps> = ({ openLoginModal}) => {
  const [messageApi, messageContextHolder] = message.useMessage();
  const itemCount = 1;
  const navigate = useNavigate();

  const items: MenuProps['items'] = [
    { key: 'account-setting', label: 'Tài khoản', icon: <UserOutlined /> },
    { key: 'my-wall', label: 'Wall của bạn', icon: <ProductOutlined /> },
    { type: 'divider' },
    { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true },
  ];

  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'logout':
        handleLogout();
        break;
      case 'account-setting':
        navigate('/profile');
        break;
      case 'my-wall':
        navigate('/wall');
        break;
      default:
        break;
    }
  };

  const { userData, setUserData } = React.useContext(AuthContext);
  if(!userData) {
    const username = sessionStorage.getItem('username');
    if(!username) {
      return (
        <LoginDiv onClick={openLoginModal}>
          <UserOutlined style={{ fontSize: '32px' }} />
          &nbsp;
          <span>Login</span>
        </LoginDiv>
      );
    }
    return (
      <div style={{ paddingRight: '15px', textWrap: 'wrap', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        <Dropdown menu={{ items, onClick }} trigger={['hover']} placement="bottomLeft">
            <Button onClick={(e) => e.preventDefault()} type="text" style={{ color: 'white' }} icon={<UserOutlined />}>{username}<DownOutlined /></Button>
        </Dropdown>
        <Badge size='small' count={itemCount} offset={[-1, -2]}>
            <BellOutlined style={{ color: 'white', fontSize: '18px', cursor: 'pointer' }} />
        </Badge>
      </div>
    );
  }
  
  const handleLogout = async () => {
    messageApi.info(`Bye bye ${userData.username}`);
    await authApi.logout();
    setUserData(null);
    sessionStorage.clear();
  };

  return (
    <>
      {messageContextHolder}
      <div style={{ paddingRight: '15px', textWrap: 'wrap', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        <Dropdown menu={{ items, onClick }} trigger={['hover']} placement="bottomLeft">
            <Button onClick={(e) => e.preventDefault()} type="text" style={{ color: 'white' }} icon={<UserOutlined />}>{userData?.username}<DownOutlined /></Button>
        </Dropdown>
        <Badge size='small' count={itemCount} offset={[-1, -2]}>
            <BellOutlined style={{ color: 'white', fontSize: '18px', cursor: 'pointer' }} />
        </Badge>
      </div>
    </>
  );
}

export default LoggedComponent;