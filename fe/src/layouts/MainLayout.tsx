import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AppFooter from '../components/Footer';
import AppHeader from '../components/Header';

const { Content } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ }}>
        <Outlet /> {/* nơi render các page con */}
      </Content>
      <AppFooter />
    </Layout>
  )
}

export default MainLayout;