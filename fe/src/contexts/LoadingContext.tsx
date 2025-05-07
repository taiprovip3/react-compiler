import React from 'react'

interface LoadingContextType {
    isLoading: boolean,
    setIsLoading: (loading: boolean) => void;
}
const LoadingContext = React.createContext<LoadingContextType>({
    isLoading: false,
    setIsLoading: () => {},
});

export const useLoading = () => React.useContext(LoadingContext);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = React.useState(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};