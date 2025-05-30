import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, Platform, ActivityIndicator, Switch, Linking } from 'react-native';
import siren from "../../assets/siren.png";
import * as Speech from 'expo-speech';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import { useState, useEffect, useContext } from 'react';
import { useNavigation } from "@react-navigation/native";
import {InformationsContext} from '../context/formInfo';
//import MapView from 'react-native-maps';

export default function Home(){
    const { nome, data_nasc, tipoSang, alergia,
            medicacao, nomeCont, numContato
          } = useContext(InformationsContext);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [contato, setContato] = useState('75998323259');
    const nav = useNavigation();

    async function getContact(){
      
      //Ask for permission
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        if ( status === 'granted' ) {
          return setErrorMsg("Permissão negada!")
          }
          const contacts =  await Contacts.getContactsAsync({
              fields: [Contacts.Fields.PhoneNumbers],
              pageSize: 10,
              pageOffset: 0
            })
          
          if(contacts.total > 0){
            setContato(contacts)
            console.log(contacts)
          }
        
      } catch (error) {
        setErrorMsg(error)
      }
  }

  useEffect( () => {
    //getContact();
    solicitarPermissaoContatos()
  }, []);

    // useEffect(() => {
    //   //getContact();

    //   //função para pedir a permição do usuário

    //   {/* atalho do whatsapp para mensagem 
    //     https://wa.me/5511999999999?text=Eu%20quero%20fazer%20um%20pedido
    //   */}

    //   (async () => {
    //     let { status } = await Location.requestForegroundPermissionsAsync();
    //     if (status !== 'granted') {
    //       setErrorMsg('Permissão de localização negada. \nPara usar a aplicação você precisa habilitar a permissão\n');
    //       return
    //     }
  
    //     let location = await Location.getCurrentPositionAsync({});
    //     setLocation(location);
    //     // console.log(`https://wa.me/${contato}?text=stou%20precisando%20de%20ajuda%20estou%20${location.coords.latitude + '%20&&' + location.coords.longitude}`)
    //   })();
    // }, []);

    async function solicitarPermissaoContatos(){

  const { status, canAskAgain } = await Contacts.getPermissionsAsync();

  if (status === 'granted') {
    console.log("Permissão já concedida.");
    return true;
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
  
    if (errorMsg) {
      return (
      <View>
        <Text>{errorMsg}</Text>
        <TouchableOpacity onPress={()=> nav.navigate("Setting")}><Text>Configurações</Text></TouchableOpacity>
        <Switch
            trackColor={{false: '777', true: '8bf'}}
            thumbColor={errorMsg ? '00f' : '#444'}
            value={contato}
            onValueChange={async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  setPermissionGranted(status === 'granted');
}}
 />
      </View>
    )}
  
    if (!location) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

  function sendLocation(location){
    const thingToSay = 'Sua Localização foi enviada para seu contato!';
    if(Platform.OS == "ios"){
      try {
        Alert.alert("Localização enviada!");
        Speech.speak(thingToSay);
      } catch (error) {
        Alert.alert("erro ao enviar a localização" + error)
      }
    }else{
      try {
        console.log(`https://wa.me/${contato}?text=stou%20precisando%20de%20ajuda%20estou%20${location.coords.latitude + '%20&&' + location.coords.longitude}`)
        Alert.alert("Localização enviada!");
        Speech.speak(thingToSay);
      } catch (error) {
        Alert.alert("erro ao enviar a localização" + error);
        Speech.speak("Erro ao enviar a localização!" + error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => sendLocation(location)}>
        <Image source={siren} style={styles.image}/>
        <Text style={styles.text}>Emergency</Text>
        <MapView />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2f2f2f',
    alignItems: 'center',
    justifyContent: 'center'
    
  },
  image:{
    flex: 1,
    maxWidth: 100,
    maxHeight: 100,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
    border: 1,
    borderColor: "#fff"
  },
  text:{
    color: "#fff",
    position: 'relative',
    fontSize: 50,
    top: 90,
    left: -30,
    textAlign: "center",
    justifyContent: "center"
  }
});
// doc https://docs.expo.dev/versions/latest/sdk/location/
// Em tempo real await Location.watchPositionAsync(
//         {
//           accuracy: Location.Accuracy.High,
//           timeInterval: 5000,      // atualiza a cada 5 segundos
//           distanceInterval: 10,    // ou a cada 10 metros percorridos
//         },