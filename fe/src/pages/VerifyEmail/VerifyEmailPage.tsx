import { useEffect, useRef, useState } from 'react'
import AppHeader from '../../components/Header';
import AppFooter from '../../components/Footer'
import { Layout, message } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { authApi } from '../../api';
import styles from './VerifyEmailPage.module.css';

const VerifyEmailPage = () => {
    const calledRef = useRef(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("loading");
    
    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;
        const verify = async () => {
            if(!token) {
                messageApi.error('No token found to verify!');
                setStatus("error");
                return;
            }
            try {
                await authApi.verifyEmailToken(token);
                messageApi.success('Xác mình thành công. Bạn có thể đóng trang này.')
                setStatus("success");
            } catch (error) {
                messageApi.error('Catch error when send an email verification api! Please review the logs!');
                console.error('error=', error);
                setStatus("error");
            }
        }
        verify();
    }, [messageApi, token]);
  return (
    <>
    {contextHolder}
    <Layout style={{ minHeight: "100vh" }}>
        <AppHeader />
        <Layout>
            <div className={styles.centerBoard}>
                {status === "loading" && <p className={styles.textWarning}>Đang xác minh...</p>}
                {status === "success" && <p className={styles.textSuccess}>Xác minh email thành công 🎉</p>}
                {status === "error" && <p className={styles.textDanger}>Liên kết không hợp lệ hoặc đã hết hạn ❌</p>}
            </div>
        </Layout>
        <AppFooter />
    </Layout>
    </>
  )
}

export default VerifyEmailPage;