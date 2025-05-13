import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import siren from "../../assets/siren.png";
import * as Speech from 'expo-speech';
import * as Location from 'expo-location';

export default function Home() {
  const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
  
    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permissão de localização negada');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }, []);
  
    if (errorMsg) {
      return <Text>{errorMsg}</Text>;
    }
  
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
        Alert.alert("Localização enviada!");
        Speech.speak(thingToSay);
      } catch (error) {
        Alert.alert("erro ao enviar a localização" + error);
      }
      Speech.speak("Erro ao enviar a localização!" + error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={sendLocation}>
        <Image source={siren} style={styles.image}/>
        <Text style={styles.text}>Emergency</Text>
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