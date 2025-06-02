import { SafeAreaView } from "react-native";
import { Colors } from "../../context/personalizacoes";
import { useContext, useEffect } from "react";
import { SettingsContext } from "../../context/settingsContext";

export default function Container(props){
    const {darkMode, setDarkMode} = useContext(SettingsContext);

    useEffect(()=>{
        console.log(darkMode);
        setDarkMode(props.darkMode);
    },[darkMode])

    return(
        <SafeAreaView style={{flex: 1,
            justifyContent:"space-around", 
            alignItems: "center", 
            backgroundColor: darkMode ? Colors.darkMode : Colors.light,
            padding: 0,
            margin: 0,
        }}>
            {props.children}
        </SafeAreaView>
    )
}