import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

const HomePage: React.FC = () => {
  return (
    <Content style={{ padding: '0 50px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className="site-layout-content" style={{ margin: '16px 0', textAlign: 'center' }}>
        <h1>Chào mừng đến với cửa hàng TAIPC</h1>
        <p>Find the best electronics components for your needs!</p>
      </div>
    </Content>
  );
};

export default HomePage;