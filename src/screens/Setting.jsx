import { useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, Linking, Image } from "react-native";
import mais from "../../assets/mais.png"
import menos from "../../assets/menos.png"
import Container from "../components/Container/container";
import { Colors } from "../context/personalizacoes";
import { SettingsContext } from "../context/settingsContext";
import * as Speech from 'expo-speech';


const Setting = () => {
  const {darkMode, setDarkMode,
  sms, setSms,
  ttsOn, setTtsOn,
  permission, tamFont, setTamFont} = useContext(SettingsContext)


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

  const diminuirFonte = () => {
  setTamFont(prev => (prev - 4 <= 50 ? prev - 4 : prev));
};
  const aumentarFonte = () => {
  setTamFont(prev => (prev + 4 <= 70 ? prev + 4 : prev));
};


  const abrirConfiguracoes = () => {
  Linking.openSettings().catch(() => {
    Alert.alert('Erro', 'Não foi possível abrir as configurações');
  });
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

const lerConteudoDaTela = () => {
  const textoParaLer = `
    Tela de configurações.
    Modo escuro está ${darkMode ? 'ativado' : 'desativado'}.
    Modo mensagem está ${sms ? 'ativado' : 'desativado'}.
    Tamanho da fonte é ${tamFont}.
    Narrador está ${ttsOn ? 'ligado' : 'desligado'}.
    Permissões estão ${permission ? 'concedidas' : 'não concedidas'}.
  `;

  Speech.speak(textoParaLer, {
    language: 'pt-BR',
    pitch: 1,
    rate: 1,
  });
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

  useEffect(() => {
    solicitarPermissaoContatos();
    if (ttsOn) {
      lerConteudoDaTela();
    } else {
      Speech.stop();
    }
}, [ttsOn, darkMode, sms, tamFont, permission]);


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
          <Text accessibilityLabelledBy={"Toque para aumentar o tamanhho da Fonte"} style={darkMode? styles.textBtn: styles.textBtnDark}>Tamanho de Fonte:</Text>
          <View style={styles.containerbtnimage}>
          <TouchableOpacity onPress={diminuirFonte} style={styles.btnFonts}>
            <Image source={menos} style={styles.imgFonts}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={aumentarFonte} style={styles.btnFonts}>
            <Image source={mais} style={styles.imgFonts}/>
          </TouchableOpacity>
        </View>

        </View>

        <View style={styles.containerbtn}>
          <Text style={darkMode? styles.textBtn: styles.textBtnDark}>Habilitar narrador</Text>
          <Switch
              trackColor={{false: '#777', true: '#8bf'}}
              thumbColor={!ttsOn? '#fff' : '#444'}
              value={!ttsOn}
              onValueChange={() =>{
                ativarNarrador()
              }} /> 
        </View>

        <View style={styles.containerbtn}>
        <Text style={darkMode? styles.textBtn: styles.textBtnDark}>Habilitar Permissão</Text>
        <TouchableOpacity onPress={abrirConfiguracoes} style={styles.ligthBtn}>
          <Text style={styles.textBtnDark}>Abrir Configurações</Text>
        </TouchableOpacity>
        </View>
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
  containerbtnimage: {
    flex: 1, 
    flexDirection: "row",
    gap: 10,
    padding: 10,
    margin: 0,
    maxHeight: 75,
    maxWidth: 155,
    alignItems: 'center',
    backgroundColor: Colors.menu3,
    borderRadius: 15,
    justifyContent: "space-between"
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
  },
  imgFonts:{
    maxHeight: 40,
    maxWidth: 40
  }
});