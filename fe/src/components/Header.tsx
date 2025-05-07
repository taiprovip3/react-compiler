import React from 'react';
import { Flex, Layout, Menu, MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import LoginModal from './Authetication/LoginModal';
import RegisterModal from './Authetication/RegisterModal';
import { AuthContext } from '../contexts/AuthContext';
import LoggedComponent from './Authetication/LoggedComponent';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const { Header } = Layout;

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

const AppHeader: React.FC = () => {
  
  const [isLoginModalVisible, setLoginModalVisible] = React.useState<boolean>(false);
  const [isRegisterModalVisible, setRegisterModalVisible] = React.useState<boolean>(false);
  const { userData } = React.useContext(AuthContext);
  
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
      <Header style={{padding: 0, position: 'sticky', top: 0, zIndex: 1, display: 'flex'}}>
        <Flex vertical={false} style={{ width: '100%' }}>
        {/* 1 */}
        <div style={{ width: '40%' }}>
          <Menu defaultSelectedKeys={['1']} items={items} onClick={onClick} theme="dark" mode="horizontal" style={{ width: '100%', maxWidth: '50%' }} />
        </div>

        {/* 2 */}
        <div style={{ width: '35%' }}>
          <div style={{ maxWidth: '100%', textAlign: 'center', lineHeight: '1em', textWrap: 'wrap', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <div className="logo" style={{  }}>
                <img src={logo} alt="TAICOMPUTER" width={'64'} style={{ maxWidth: '100%' }} />
            </div>
            <span style={{ color: 'white' }}>Find the best electronics components for your needs!</span>
          </div>
        </div>

        {/* 3 */}
        <div style={{ width: '25%', textAlign: 'right' }}>
          {/* {
            userData ? (
              <LoggedComponent />
            ) : (
              <LoginDiv onClick={openLoginModal}>
                <UserOutlined style={{ fontSize: '32px' }} />
                &nbsp;
                <span>Login</span>
              </LoginDiv>
            )
          } */}
          {
            <LoggedComponent openLoginModal={openLoginModal} />
          }
        </div>
        </Flex>
      </Header>
      <LoginModal visible={isLoginModalVisible} onClose={closeLoginModal} onRegister={openRegisterModal} />
      <RegisterModal visible={isRegisterModalVisible} onClose={closeRegisterModal} onLogin={openLoginModal} />
    </>
  );
};

export default AppHeader;