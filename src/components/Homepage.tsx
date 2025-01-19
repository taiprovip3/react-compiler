import React from 'react';
import { Layout } from 'antd';
import AppHeader from './Header';
import AppFooter from './Footer';
import '../styles/Homepage.css';

const { Content } = Layout;

const Homepage: React.FC = () => {
  return (
    <Layout className="layout" style={{ width: '100%', border: '1px solid green', minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ padding: '0 50px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="site-layout-content" style={{ margin: '16px 0', textAlign: 'center' }}>
          <h1>Chào mừng đến với cửa hàng TAIPC</h1>
          <p>Find the best electronics components for your needs!</p>
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default Homepage;