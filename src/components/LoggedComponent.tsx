import React from 'react';
import { Badge, Button, Dropdown, MenuProps } from 'antd';
import { BellOutlined, DownOutlined, LogoutOutlined, ProductOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

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
            navigate('/info');
            break;
          case 'my-wall':
            break;
          default:
            break;
        }
      };

      const handleLogout = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/auth/logout', {
              method: 'POST',
              credentials: 'include', // Include cookies (if any)
              headers: {
                  'Content-Type': 'application/json',
              },
          });
          if (!response.ok) {
            Swal.fire({
                title: 'Error!',
                text: 'No credentials to logout!',
                icon: 'error',
                confirmButtonText: 'Oops!'
            });
            throw new Error('Logout failed');
          }
          const result = await response.json();
          if(!result) {
            Swal.fire({
                title: 'Error!',
                text: 'Internal Server Error!',
                icon: 'error',
                confirmButtonText: 'Oops!'
            });
            throw new Error('Logout failed');
          }
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('refreshToken');
          setUserData(null);
          navigate('/');
        } catch (error) {
          console.error('Error during logout:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Có lỗi xảy ra, vui lòng thử lại sau!',
            icon: 'error',
            confirmButtonText: 'Oops!'
          });
        }
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
            <Button onClick={(e) => e.preventDefault()} type="text" style={{ color: 'white' }} icon={<UserOutlined />}>{userData.user.username}<DownOutlined /></Button>
        </Dropdown>
        <Badge size='small' count={itemCount} offset={[-1, -2]}>
            <BellOutlined style={{ color: 'white', fontSize: '18px', cursor: 'pointer' }} />
        </Badge>
      </div>
    );
  }

export default LoggedComponent;