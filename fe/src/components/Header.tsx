import React from 'react';
import { Layout, Menu, MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { AuthContext } from '../contexts/AuthContext';
import LoggedComponent from './LoggedComponent';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const LoginDiv = styled.div`
  border: 1px solid purple;
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

const AppHeader: React.FC = () => {
  
  const [isLoginModalVisible, setLoginModalVisible] = React.useState<boolean>(false);
  const [isRegisterModalVisible, setRegisterModalVisible] = React.useState<boolean>(false);
  const { userData } = React.useContext(AuthContext);
  console.log('userData=', userData);
  const navigate = useNavigate();
  
  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'Homepage':
        navigate('/');
        break;
      default:
        break;
    }
  }

  const items = [
    {key: 'Homepage', label: 'Home'}, {key: 'Walls', label: 'Walls'}, {key: 'Contact', label: 'Contact'}
  ]

  const openLoginModal = () => {
    setLoginModalVisible(true);
    setRegisterModalVisible(false);
  }
  const closeLoginModal = () => {
    setLoginModalVisible(false);
  };

  const openRegisterModal = () => {
    setLoginModalVisible(false); // Close login modal when opening register modal
    setRegisterModalVisible(true);
  };
  const closeRegisterModal = () => {
    setRegisterModalVisible(false);
  };

  return (
    <>
    <Header
        style={{position: 'sticky', top: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0, border: '1px solid red'}}
    >
      <Menu defaultSelectedKeys={['1']} items={items} onClick={onClick} theme="dark" mode="horizontal" style={{ width: '100%', maxWidth: '50%', border: '1px solid blue' }} />

      <div style={{ maxWidth: '100%', textAlign: 'center', lineHeight: '1em', textWrap: 'wrap', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', border: '1px solid yellow' }}>
        <div className="logo" style={{  }}>
            <img src="https://images.cooltext.com/5705384.png" alt="TAICOMPUTER" width={'64'} style={{ maxWidth: '100%' }} />
        </div>
        <span style={{ color: 'white' }}>Find the best electronics components for your needs!</span>
      </div>
      {
        userData ? (
          <LoggedComponent />
        ) : (
          <LoginDiv onClick={openLoginModal}>
            <UserOutlined style={{ fontSize: '32px' }} />
            &nbsp;
            <span>Login</span>
          </LoginDiv>
        )
      }
    </Header>
    <LoginModal visible={isLoginModalVisible} onClose={closeLoginModal} onRegister={openRegisterModal} />
    <RegisterModal visible={isRegisterModalVisible} onClose={closeRegisterModal} onLogin={openLoginModal} />
    </>
  );
};

export default AppHeader;