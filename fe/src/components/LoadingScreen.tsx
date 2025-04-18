import { Spin } from 'antd';

const LoadingScreen = () => {
  return (
    
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '50vh',
      flexDirection: 'column'
    }}>
      <Spin size="large" spinning={true}>
        <div style={{ minHeight: 500 }} />
      </Spin>
    </div>
  );
};

export default LoadingScreen;