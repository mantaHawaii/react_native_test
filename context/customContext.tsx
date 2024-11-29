import { createContext, PropsWithChildren } from 'react';

export type CustomValue = {
    scrollOffset:number;
};

export const CustomContext = createContext({
    scrollOffset: 0
});

type CustomContextProps = PropsWithChildren & {
    value:CustomValue;
};

export function CustomContextProvider({children, value}:CustomContextProps) {
    return (
        <CustomContext.Provider value={value}>
            {children}
        </CustomContext.Provider>
    );
}