import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import Container from "../components/Container/container";
import { Colors } from "../context/personalizacoes";
import { SettingsContext } from "../context/settingsContext";

const Setting = () => {
  const {darkMode, setDarkMode,
  sms, setSms,
  ttsOn, setTtsOn,
  permission, setPermission} = useContext(SettingsContext)

  const toggle = () => {
    setDarkMode(previous => !previous);
  };

  function smsdarkMode(){
    console.log(sms?"sms ativado" : "sms desativado!");
    setSms(previous => !previous);
  };

  function ativarNarrador(){
    console.log(ttsOn?"narrador ativado" : "narrador desativado");
    setTtsOn(previous => !previous);
  };

  async function getPermission(){
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log(status)
    setPermission(status)
    return true
  };

  async function solicitarPermissaoContatos(){
  
      const { status, canAskAgain } = await Contacts.getPermissionsAsync();
  
    if (status !== 'granted') {
    return setErrorMsg("Permissão negada!")
  }
  
    if (status !== 'granted' && canAskAgain) {
      const { status: novoStatus } = await Contacts.requestPermissionsAsync();
      return novoStatus === 'granted';
    }
  
    if (!canAskAgain) {
      Alert.alert(
        "Permissão necessária",
        "Você negou permanentemente o acesso aos contatos. Vá até as configurações do aplicativo para permitir.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Abrir configurações", onPress: () => Linking.openSettings() }
        ]
      );
      return false;
    }
    return false;
  }

  useEffect(()=>{
    ativarNarrador();
    getPermission();
  },[]);

  return (
      <Container darkMode={darkMode} style={darkMode? styles.darkContainer : styles.container}>
        <View>
          <Text style={darkMode? styles.textBtn: styles.textBtnDark}>Modo escuro</Text>
        </View>
        
        <TouchableOpacity style={styles.ligthBtn} onPress={toggle}>
          <View style={darkMode? styles.toogleDark : styles.toogle}>
            <Text style={darkMode? styles.textBtn: styles.textBtnDark}>{darkMode ? "ON" : "OFF"}</Text>
          </View>
        </TouchableOpacity>

          <Text style={darkMode? styles.textBtn: styles.textBtnDark}>Modo mensagem</Text>

        <TouchableOpacity style={styles.ligthBtn} onPress={smsdarkMode} >
          <View style={sms? styles.toogle :styles.toogleDark }>
            <Text style={!sms?styles.textBtn :styles.textBtnDark }>{!sms ? "ON" : "OFF"}</Text>
          </View>
        </TouchableOpacity>

        <Text accessibilityLabelledBy={"Toque para aumentar o tamanhho da Fonte"} style={darkMode? styles.textBtn: styles.textBtnDark}>Tamanho de Fonte</Text>

        {/* <Switch
            trackColor={{false: '777', true: '8bf'}}
            thumbColor={sms? '00f' : '#444'}
            value={sms}
            onValueChange={() =>{
              setSms(previous => !previous)
            }} /> */}

        <Text style={darkMode? styles.textBtn: styles.textBtnDark}>Habilitar narrador</Text>
        <Switch
            trackColor={{false: '#777', true: '#8bf'}}
            thumbColor={ttsOn? '#fff' : '#444'}
            value={ttsOn}
            onValueChange={() =>{
              ativarNarrador()
            }} /> 
        <Text style={darkMode? styles.textBtn: styles.textBtnDark}>Habilitar Permissão</Text>
        <Switch
            trackColor={{false: '#777', true: '#8bf'}}
            thumbColor={permission? '#fff' : '#444'}
            value={permission}
            onValueChange={() =>{
              getPermission()
            }} /> 
        {/* <TouchableOpacity style={styles.ligthBtn} onPress={ativarNarrador}>
          <View style={ttsOn? styles.toogle : styles.toogleDark }>
            <Text style={!darkMode? styles.textBtn: styles.textBtnDark}>{!ttsOn ? "ON" : "OFF"}</Text>
          </View>
      </TouchableOpacity> */}
    </Container>
  )
}

export default Setting;
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'space-around', 
    alignItems: 'center',
  },
  darkContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  ligthBtn:{
    height: 25,
    width: 70,
    color: "#151515",
    backgroundColor: "#222",
    borderRadius: 20,
    borderColor: "#fff",
    overflow: 'hidden'
  },
  darkBtn:{
    height: 40,
    width: 60,
    color: "#222",
    backgroundColor: "#151515",
    borderRadius: 20,
    borderColor: "#222",
    overflow: 'hidden',
    justifyContent: "center"
  },
  toogle:{
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    justifyContent: "center",
    borderColor: Colors.dark
  },
  toogleDark:{
    height: '100%',
    width: '100%',
    backgroundColor: '#222',
    alignItems: 'flex-start',
    justifyContent: "center",
    
  },
  textBtn:{
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
    fontSize: 18,
    textAlign: "right"
  },
  textBtnDark:{
    color: '#222',
    fontSize: 10,
    fontWeight: '500',
    fontSize: 18,
  }
});