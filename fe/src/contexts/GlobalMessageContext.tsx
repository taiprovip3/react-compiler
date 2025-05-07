import { message } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import React from "react";

interface GlobalMessageContextType {
    messageApi: MessageInstance
}

const GlobalMessageContext = React.createContext<GlobalMessageContextType | null>(null);

export const useGlobalMessage = () => {
    const context = React.useContext(GlobalMessageContext);
    if(!context)
        throw new Error("(!) useGlobalMessage must be used inside GlobalMessageProvider!");
    return context.messageApi;
}

export const GlobalMessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage();

    return (
        <GlobalMessageContext.Provider value={{ messageApi }}>
            { contextHolder }
            { children }
        </GlobalMessageContext.Provider>
    );
}