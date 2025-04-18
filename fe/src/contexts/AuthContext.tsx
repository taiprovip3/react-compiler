import React, { ReactNode } from 'react'
import { createContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api';
import { User } from '../types/User';

// Định nghĩa interface cho giá trị của AuthContext
interface AuthContextType {
  userData: User | null;
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
  const [userData, setUserData] = React.useState<User | null>(null);
  const navigate = useNavigate();

  const validateUserAuthentication = async () => {
    if(!userData) {
      try {
        const userId = sessionStorage.getItem('userId');
        if(!userId) {
          console.info('No saved credentials found. It"s a fresh page!');
          return;
        }
        console.log('validateUserAuthentication call api getUserData()!');
        
        const userDataResponse = await userApi.getUserData(Number(userId));
        if(!userDataResponse) {
          console.error('Init can"t get user profile. Something went wrong!');
        }
        setUserData(userDataResponse);
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
  });

  return (
    <AuthContext.Provider value={{ userData, setUserData, validateUserAuthentication }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;