import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import { userApi } from "../api";

interface ProtectedRouteProps {
    children: React.ReactNode;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { userData, setUserData } = useContext(AuthContext);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            if(userData) {
                // Đảm bảo đã có userData -> Code chạy tiếp đến return <>{children}</> -> render ProfilePage
                return;
            }

            const userId = sessionStorage.getItem('userId');
            if (!userId) {
                sessionStorage.removeItem('username');
                console.info("No saved credentials found. It's a fresh page!");
                setRedirect(true);
                return;
            }

            console.log('ProtectedRoute useEffect call api getUserData()!');
            try {
                const userDataResponse = await userApi.getUserData(Number(userId)); // Không có TH mà userDataResponse trả về giá trị null hoặc undefine hoặc rỗng. 1 là có, 2 là exception.
                setUserData(userDataResponse);
            } catch (error: any) {// TH: bị 401 khi call api. Catch lại. TH này là do token {hết hạn, thiếu} khi gởi lên server -> 401
                console.error('error', error);
                if (error.response?.status === 401) {
                    sessionStorage.removeItem('username');
                    console.log('Api userApi.getUserData() catch 401 error!');
                }
                setRedirect(true);
            }
        };

        checkUser();
    }, [userData, setUserData]);

    // if (isLoading) {
    //     return <div>Loading...</div>; // hoặc spinner nào đó
    // }
    
    if (redirect) {
        return <Navigate to="/" replace />;
    }
    
    return <>{children}</>;
}

export default ProtectedRoute;