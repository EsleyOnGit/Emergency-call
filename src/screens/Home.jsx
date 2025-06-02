import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, Platform, ActivityIndicator, Switch, Linking } from 'react-native';
import siren from "../../assets/siren.png";
import * as Speech from 'expo-speech';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import { useState, useEffect, useContext } from 'react';
import { useNavigation } from "@react-navigation/native";
import {InformationsContext} from '../context/formInfo';
import Container from '../components/Container/container';
import { SettingsContext } from '../context/settingsContext';
import { Colors } from '../context/personalizacoes';

//import MapView from 'react-native-maps';

export default function Home(){
    const { nome, data_nasc, tipoSang, alergia,
            medicacao, nomeCont, numContato
          } = useContext(InformationsContext);
          const {darkMode} = useContext(SettingsContext);

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [contato, setContato] = useState('75998323259');
    const nav = useNavigation();

    async function getContact(){
    
      //Ask for permission
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') {
          return setErrorMsg("Permissão negada!");
        }

          const contacts =  await Contacts.getContactsAsync({
              fields: [Contacts.Fields.PhoneNumbers],
              pageSize: 10,
              pageOffset: 0
            })
          
          if (contacts.total > 0) {
             const firstPhone = contacts.data[0]?.phoneNumbers?.[0]?.number;
            if (firstPhone) {
             setContato(firstPhone.replace(/\D/g, '')); // remove caracteres não numéricos
            }
          }

      } catch (error) {
        setErrorMsg(error)
      }
  }

  useEffect(() => {
  async function fetchData() {
    try {
      await getContact();

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar localização foi negada');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      setErrorMsg("Erro ao obter permissões ou localização: " + error.message);
    }
  }

  fetchData();
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

    
  
    if (errorMsg) {
      return (
      <Container>
        <Text style={darkMode ? styles.text: ''}>{errorMsg}</Text>
        <TouchableOpacity style={styles.btn} onPress={()=> nav.navigate("Setting")}>
          <Text style={darkMode ? styles.textbtn: ''}>Configurações</Text>
          </TouchableOpacity>
      </Container>
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
        if (!location) {
          Alert.alert("Erro", "Localização não disponível.");
          return;
        }else{
          Linking.openURL(`https://wa.me/${contato}?text=Estou%20precisando%20de%20ajuda!%20Minha%20localização%20é:%20${location.coords.latitude},${location.coords.longitude}`);
          Alert.alert("Localização enviada!");
          Speech.speak(thingToSay);
        }
      } catch (error) {
        Alert.alert("erro ao enviar a localização" + error);
        Speech.speak("Erro ao enviar a localização!" + error);
      }
    }
  };

  return (
    <Container>
      <TouchableOpacity onPress={() => sendLocation(location)}>
        <Image source={siren} style={styles.image}/>
        <Text style={styles.text}>Emergency</Text>
        {/* <MapView /> */}
      </TouchableOpacity>
    </Container>
  );
}

const styles = StyleSheet.create({
  image: {
  width: 100,
  height: 100,
  alignSelf: "center",
  marginTop: 50
},
  text:{
    flex: 1,
    color: Colors.light,
    position: 'relative',
    fontSize: 20,
    top: 90,
    textAlign: "center",
    justifyContent: "center"
  },
  textbtn:{
    fontSize: 20,
    color: Colors.light
  },
  btn:{
    backgroundColor: 'rgba(252, 252, 252, 0.23)',
    borderRadius: 5
  }
});

// doc https://docs.expo.dev/versions/latest/sdk/location/
// Em tempo real await Location.watchPositionAsync(
//         {
//           accuracy: Location.Accuracy.High,
//           timeInterval: 5000,      // atualiza a cada 5 segundos
//           distanceInterval: 10,    // ou a cada 10 metros percorridos
//         },