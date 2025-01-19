import React, { ReactNode } from 'react'
import { createContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api';

interface UserData {
  // "id": number,
  // "fullName": string,
  // "phoneNumber": string,
  // "phoneCode": string,
  // "gender": string,
  // "dateOfBirth": string,
  // "balance": number,
  // "createdAt": string,
  // "updatedAt": string,
  // "defaultAddress": string,
  // "avatar": string,
  // "addresses": Array<any>,
  // [key: string]: any; // Cho phép các thuộc tính bổ sung nếu cần
}

// Định nghĩa interface cho giá trị của AuthContext
interface AuthContextType {
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  validateUserAuthentication: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  userData: null,
  setUserData: () => {},
  validateUserAuthentication: async () => {},
});

// Định nghĩa kiểu cho props của AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider:React.FC<AuthProviderProps> = ({ children }) => {
  const [userData, setUserData] = React.useState<any>(null);
  const navigate = useNavigate();

  const validateUserAuthentication = async () => {
    if(!userData) {
      try {
        const userProfile = await userApi.getUserProfile();
        if(!userProfile) {
          console.error('Init can"t get user profile. Something went wrong!');
        }
        setUserData(userProfile);
      } catch (error: any) {
        console.error(error);
        if(error.code === 'ERR_BAD_REQUEST') {
          navigate('/');
        }
      }
    }
  }

  React.useEffect(() => {
    validateUserAuthentication();
  }, []);

  return (
    <AuthContext.Provider value={{ userData, setUserData, validateUserAuthentication }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;