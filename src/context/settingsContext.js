import { useState, createContext } from "react";

const SettingsContext = createContext({});

const SettingProvider = (props) =>{
  const [darkMode, setDarkMode] = useState(false);
  const [sms, setSms] = useState(false);
  const [ttsOn, setTtsOn] = useState(false);
  const [permission, setPermission] = useState(false)
  const [tamFont, setTamFont] = useState(14)

    return(
        <SettingsContext.Provider value={{
            darkMode, setDarkMode,
            sms, setSms,
            ttsOn, setTtsOn,
            permission, setPermission,
            tamFont, setTamFont,
        }}>
            {props.children}
    </SettingsContext.Provider>
    )
}

export {SettingsContext };
export default SettingProvider;