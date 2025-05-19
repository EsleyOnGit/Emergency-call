import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, Platform, ActivityIndicator, Switch } from 'react-native';
import siren from "../../assets/siren.png";
import * as Speech from 'expo-speech';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import { useState, useEffect } from 'react';
import react from 'react';
import { useNavigation } from "@react-navigation/native";
import { State } from 'react-native-gesture-handler';
//import MapView from 'react-native-maps';

export default function Home() {
  const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [contato, setContato] = useState('75998323259');
    const nav = useNavigation()

  //   async function getContact(){
  //     const { status } = await Contacts.requestPermissionsAsync();
  //     if (status === 'granted') {
  //       const { data } = await Contacts.getContactsAsync({
  //         fields: [Contacts.Fields.Emails],
  //       });

  //       if (data.length > 0) {
  //         const contact = data[0];
  //         console.log(contact);
  //       }
  //     }
  // }
  //   console.log("contato cadastrado.")
  //   }

  useEffect( () => {

    (async () => {
    // Request permission
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      // Fetch contacts
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        const contact = data[0];
        console.log(contact);

        // Optionally add a contact (example)
        const newContact = {
          [Contacts.Fields.FirstName]: 'John',
          [Contacts.Fields.LastName]: 'Doe',
          [Contacts.Fields.PhoneNumbers]: [{ label: 'mobile', number: '123-456-7890' }],
        };

        const contactId = await Contacts.addContactAsync(newContact);
        console.log('New contact added with ID:', contactId);
      }
    }
  })();
  }, []);

    useEffect(() => {
      //getContact();

      //função para pedir a permição do usuário

      {/* atalho do whatsapp para mensagem 
        https://wa.me/5511999999999?text=Eu%20quero%20fazer%20um%20pedido
      */}

      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permissão de localização negada. \nPara usar a aplicação você precisa habilitar a permissão\n');
          return
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        console.log(`https://wa.me/${contato}?text=stou%20precisando%20de%20ajuda%20estou%20${location.coords.latitude + '%20&&' + location.coords.longitude}`)
      })();
    }, []);
  
    if (errorMsg) {
      let status = false;
      return (
      <View>
        <Text>{errorMsg}</Text>
        <TouchableOpacity onPress={()=> nav.navigate("Setting")}><Text>Configurações</Text></TouchableOpacity>
        <Switch
            trackColor={{false: '777', true: '8bf'}}
            thumbColor={errorMsg ? '00f' : '#444'}
            value={status}
            onValueChange={() =>{
              async (status) => await Location.requestForegroundPermissionsAsync()
            }} />
      </View>
    )}
  
    if (!location) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    console.log(location)

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
      <TouchableOpacity onPress={sendLocation}>
        <Image source={siren} style={styles.image}/>
        <Text style={styles.text}>Emergency</Text>
        {/* <MapView /> */}
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