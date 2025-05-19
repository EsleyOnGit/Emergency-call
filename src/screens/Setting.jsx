import { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Switch } from "react-native"

const Setting = () => {
  const [isOn, setIsOn] = useState(false);
  const [sms, setSms] = useState(false);
  const [ttsOn, setTtsOn] = useState(false);

  const toggle = () => {
    setIsOn(previous => !previous);
  };

  function smsIsOn(){
    console.log(sms?"sms ativado" : "sms desativado!")
    setSms(previous => !previous);
  }

  function ativarNarrador (){
    console.log(ttsOn?"narrador ativado" : "narrador desativado")
    setTtsOn(previous => !previous);
  }

  async function getPermission(){
    let { status } = await Location.requestForegroundPermissionsAsync();
  }

  return (
      <View style={isOn? styles.darkContainer : styles.container}>
        <Text style={isOn? styles.textBtn: styles.textBtnDark}>Modo escuro</Text>
        <TouchableOpacity style={styles.ligthBtn} onPress={toggle} >
          <View style={isOn? styles.toogleDark : styles.toogle}>
            <Text style={isOn? styles.textBtn: styles.textBtnDark}>{isOn ? "ON" : "OFF"}</Text>
          </View>
        </TouchableOpacity>
        <Text style={isOn? styles.textBtn: styles.textBtnDark}>Ativar modo mensagem</Text>
        <TouchableOpacity style={styles.ligthBtn} onPress={smsIsOn} >
          <View style={isOn? styles.toogleDark : styles.toogle}>
            <Text style={isOn? styles.textBtn: styles.textBtnDark}>{isOn ? "ON" : "OFF"}</Text>
          </View>
        </TouchableOpacity>
        <Text style={isOn? styles.textBtn: styles.textBtnDark}>Tamanho de Fonte</Text>
        <TouchableOpacity style={styles.ligthBtn} >
          <View style={isOn? styles.toogleDark : styles.toogle}>
            <Text style={isOn? styles.textBtn: styles.textBtnDark}>{isOn ? "ON" : "OFF"}</Text>
          </View>
        </TouchableOpacity>
        <Text style={isOn? styles.textBtn: styles.textBtnDark}>Habilitar narrador</Text>
        <TouchableOpacity style={styles.ligthBtn} onPress={ativarNarrador} >
          <View style={isOn? styles.toogleDark : styles.toogle}>
            <Text style={isOn? styles.textBtn: styles.textBtnDark}>{isOn ? "ON" : "OFF"}</Text>
          </View>
        </TouchableOpacity>
            <Switch
            trackColor={{false: '777', true: '8bf'}}
            thumbColor={sms? '00f' : '#444'}
            value={sms}
            onValueChange={() =>{
              setSms(previous => !previous)
            }} />
            
    </View>
  )
}

export default Setting;
const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  darkContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: "#222"
  },
  ligthBtn:{
    height: 40,
    width: 60,
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
    width: '50%',
    border: 0,
    backgroundColor: '#fff',
    alignSelf: "flex-end",
    alignItems: 'center',
    justifyContent: "center",
  },
  toogleDark:{
    height: '100%',
    width: '50%',
    backgroundColor: '#222',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: "center",
  },
  textBtn:{
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
    fontSize: 18, 
    marginBottom: 20,
  },
  textBtnDark:{
    color: '#222',
    fontSize: 10,
    fontWeight: '500',
    fontSize: 18, 
    marginBottom: 20,
  }
});