import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  return (
    <Footer style={{ textAlign: 'center', background: '#001529', color: 'lightgray' }}>
      TAIPC Store ©2024 Created by Your Name
    </Footer>
  );
};

export default AppFooter;