import React from 'react'
import { useLoading } from '../contexts/LoadingContext';
import { Spin } from 'antd';
import '../assets/styles/GlobalLoadingOverlay.css';

const GlobalLoadingOverlay: React.FC = () => {

    const { isLoading } = useLoading();

    if(!isLoading) return null;

    return (
        <div className="global-loading-overlay">
            <Spin size="large" spinning={true}>
                <div style={{ minHeight: 500 }} />
            </Spin>
        </div>
    )
}

export default GlobalLoadingOverlay;