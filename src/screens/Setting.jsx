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

  // Exemplo de como criar uma tela de configurações
const alterarContato = async (novoContato) => {
    try {
        await AsyncStorage.setItem('contatoEmergencia', novoContato);
        setContato(novoContato);
        Alert.alert('Contato alterado com sucesso!');
    } catch (error) {
        Alert.alert('Erro ao alterar contato');
    }
};

// Em qualquer lugar do seu app
const verHistorico = async () => {
    try {
        const historico = await AsyncStorage.getItem('historicoEmergencias');
        const emergencias = historico ? JSON.parse(historico) : [];
        console.log('Histórico:', emergencias);
    } catch (error) {
        console.error('Erro:', error);
    }
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
    getPermission();
  },[]);

  return (
      <Container darkMode={darkMode} style={darkMode? styles.darkContainer : ''}>
        <View style={styles.containerbtn}>
          <Text style={darkMode? styles.textBtn: styles.textBtnDark}>Modo escuro</Text>
          <TouchableOpacity style={styles.ligthBtn} onPress={toggle}>
            <View style={darkMode? styles.toogleDark : styles.toogle}>
              <Text style={darkMode? styles.textBtn: styles.textBtnDark}>{darkMode ? "ON" : "OFF"}</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.containerbtn}>
          <Text style={darkMode? styles.textBtn: styles.textBtnDark}>Modo mensagem</Text>
          <TouchableOpacity style={styles.ligthBtn} onPress={smsdarkMode} >
            <View style={sms? styles.toogle :styles.toogleDark }>
              <Text style={!sms?styles.textBtn :styles.textBtnDark }>{!sms ? "ON" : "OFF"}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.containerbtn}>
          <Text accessibilityLabelledBy={"Toque para aumentar o tamanhho da Fonte"} style={darkMode? styles.textBtn: styles.textBtnDark}>Tamanho de Fonte</Text>
        </View>

        <View style={styles.containerbtn}>
          <Text style={darkMode? styles.textBtn: styles.textBtnDark}>Habilitar narrador</Text>
          <Switch
              trackColor={{false: '#777', true: '#8bf'}}
              thumbColor={ttsOn? '#fff' : '#444'}
              value={ttsOn}
              onValueChange={() =>{
                ativarNarrador()
              }} /> 
        </View>

        <View style={styles.containerbtn}>
        <Text style={darkMode? styles.textBtn: styles.textBtnDark}>Habilitar Permissão</Text>
        <Switch
            trackColor={{false: '#777', true: '#8bf'}}
            thumbColor={permission? '#fff' : '#444'}
            value={permission}
            onValueChange={() =>{
              getPermission()
            }} /> 
        </View>
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
  containerbtn: {
    flex: 1, 
    flexDirection: "row",
    gap: 10,
    padding: 10,
    margin: 0,
    maxHeight: 75,
    alignItems: 'center',
    backgroundColor: Colors.menu3,
    borderRadius: 15
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
    backgroundColor: Colors.green,
    alignItems: 'flex-start',
    justifyContent: "center",
    
  },
  textBtn:{
    color: Colors.dark,
    fontSize: 10,
    fontWeight: '500',
    fontSize: 18,
    textAlign: "right"
  },
  textBtnDark:{
    color: Colors.dark,
    fontSize: 10,
    fontWeight: '500',
    fontSize: 18,
  }
});