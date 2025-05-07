import React from 'react';
import { Layout } from 'antd';
import { useLoading } from '../../contexts/LoadingContext';
import { useGlobalMessage } from '../../contexts/GlobalMessageContext';

const { Content } = Layout;

const HomePage: React.FC = () => {

  const { setIsLoading } = useLoading();
  const messageApi = useGlobalMessage();

  const testWait = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("hi");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const testGlobalMessage = () => {
    messageApi.success('Test gọi success glboal!');
    messageApi.info('Test gọi info global!');
    messageApi.error('Test gọi error global!');
  }

  return (
    <Content style={{ padding: '0 50px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className="site-layout-content" style={{ margin: '16px 0', textAlign: 'center' }}>
        <h1>Chào mừng đến với cửa hàng TAIPC</h1>
        <p>Find the best electronics components for your needs!</p>
        <button onClick={testWait}>Test wait</button>
        <button onClick={testGlobalMessage}>Test global message</button>
      </div>
    </Content>
  );
};

export default HomePage;