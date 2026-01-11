import { createContext, useState } from "react";

export const GeneralContext = createContext();

export const GeneralContextProvider = ({children}) => {
  //Navbar related context
  const [menu, setMenu] = useState(true);

  const handleMenu = () => {
    setMenu(!menu);
  };

  return <GeneralContext.Provider value={{menu, handleMenu}}>
    {children}
  </GeneralContext.Provider>;
};
