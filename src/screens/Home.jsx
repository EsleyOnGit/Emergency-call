import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, Platform, ActivityIndicator, Switch, Linking } from 'react-native';
import siren from "../../assets/siren.png";
import * as Speech from 'expo-speech';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as SMS from "expo-sms";
import { useState, useEffect, useContext } from 'react';
import { useNavigation } from "@react-navigation/native";
import {InformationsContext} from '../context/formInfo';
import Container from '../components/Container/container';
import { SettingsContext } from '../context/settingsContext';
import { Colors } from '../context/personalizacoes';

export default function Home(){
    const { nome, data_nasc, tipoSang, alergia,
            medicacao, nomeCont, numContato
          } = useContext(InformationsContext);
    const {darkMode, sms} = useContext(SettingsContext);

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [contato, setContato] = useState('75998323259');
    const nav = useNavigation();

    const enviarLocalizacaoPorSMS = async () => {

        const mensagem = `estou precisando de sua ajuda minha localização é: https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;

        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
            await SMS.sendSMSAsync(
            [`+55${contato}`], // coloque o número do contato de emergência aqui
            mensagem
            );
        } else {
            Alert.alert('SMS não disponível neste dispositivo');
        }

        if(sms){
            const { result } = await SMS.sendSMSAsync(
                ['0123456789', '9876543210'],
                `Preciso da sua ajuda estou em: ${location.coords.latitude},${location.coords.longitude}`
            );
            return result;
        }
    };

async function fetchData() {
            try {
                // Primeiro tenta obter contatos (não é crítico)
                await getContact();

                // Depois tenta obter localização (crítico)
                //console.log("Solicitando permissão de localização...");
                const { status } = await Location.requestForegroundPermissionsAsync();
                
                if (status !== 'granted') {
                    setErrorMsg('Permissão para acessar localização foi negada. Por favor, habilite nas configurações do seu dispositivo.');
                    return;
                }

                console.log("Permissão concedida, obtendo localização...");
                const locationResult = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                    timeout: 15000, // 15 segundos de timeout
                });
                
                console.log("Localização obtida:", locationResult.coords);
                setLocation(locationResult);

            } catch (error) {
                console.log("Erro detalhado:", error);
                
                // Diferentes tratamentos baseados no tipo de erro
                if (error.code === 'E_LOCATION_TIMEOUT') {
                    setErrorMsg("Timeout ao obter localização. Tente novamente.");
                } else if (error.code === 'E_LOCATION_UNAVAILABLE') {
                    setErrorMsg("Localização indisponível. Verifique se o GPS está ativado.");
                } else if (error.code === 'E_LOCATION_SETTINGS_UNSATISFIED') {
                    setErrorMsg("Configurações de localização inadequadas. Verifique as configurações do GPS.");
                } else {
                    setErrorMsg("Erro ao obter localização: " + (error.message || "Erro desconhecido"));
                }
            }
        }

    async function getContact(){
        try {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log("Permissão de contatos negada, usando contato padrão");
                // Não definir como erro, apenas usar o contato padrão
                return;
            }

            const contacts = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.PhoneNumbers],
                pageSize: 10,
                pageOffset: 0
            });
          
            if (contacts.total > 0) {
                const firstPhone = contacts.data[0]?.phoneNumbers?.[0]?.number;
                if (firstPhone) {
                    setContato(firstPhone.replace(/\D/g, '')); // remove caracteres não numéricos
                    console.log("Contato obtido:", firstPhone);
                }
            }

        } catch (error) {
            console.log("Erro ao obter contatos:", error.message);
            // Não definir como erro fatal, continuar com contato padrão
        }
    }

    useEffect(() => {
        fetchData();
    }, []);
  
    // Renderizar erro com estilos corretos
    if (errorMsg) {
        return (
            <Container>
                <Text style={[styles.errorText, darkMode && styles.darkText]}>
                    {errorMsg}
                </Text>
                <TouchableOpacity 
                    style={[styles.btn, darkMode && styles.darkBtn]} 
                    onPress={() => {
                        // Tentar novamente
                        setErrorMsg(null);
                        setLocation(null);
                    }}
                >
                    <Text style={[styles.textbtn, darkMode && styles.darkTextBtn]}>
                        Tentar Novamente
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.btn, darkMode && styles.darkBtn, {marginTop: 10}]} 
                    onPress={() => nav.navigate("Setting")}
                >
                    <Text style={[styles.textbtn, darkMode && styles.darkTextBtn]}>
                        Configurações
                    </Text>
                </TouchableOpacity>
            </Container>
        );
    }
  
    // Loading
    if (!location) {
        return (
            <Container>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={[styles.loadingText, darkMode && styles.darkText]}>
                    Obtendo localização...
                </Text>
            </Container>
        );
    }

    function sendLocation(location){
        const thingToSay = 'Sua Localização foi enviada para seu contato!';
        
        if(Platform.OS === "ios"){
            try {
                Alert.alert("Localização enviada!");
                Speech.speak(thingToSay);
            } catch (error) {
                Alert.alert("Erro ao enviar a localização: " + error.message);
            }
        } else {
            try {
                if (!location) {
                    Alert.alert("Erro", "Localização não disponível.");
                    return;
                }
                
                if(sms)
                    enviarLocalizacaoPorSMS()
                
                const message = `Estou%20precisando%20de%20ajuda!%20Minha%20localização%20é:%20${location.coords.latitude},${location.coords.longitude}`;
                Linking.openURL(`https://wa.me/${contato}?text=${message}`);
                Alert.alert("Localização enviada!");
                Speech.speak(thingToSay);
                
            } catch (error) {
                Alert.alert("Erro ao enviar a localização: " + error.message);
                Speech.speak("Erro ao enviar a localização!");
            }
        }
    }

    return (
        <Container>
            <TouchableOpacity 
                onPress={() => sendLocation(location)}
                style={styles.emergencyButton}
            >
                <Image source={siren} style={styles.image}/>
                <Text style={[styles.text, darkMode && styles.darkText]}>
                    Emergency
                </Text>
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
    text: {
        color: '#000',
        fontSize: 20,
        marginTop: 20,
        textAlign: "center",
    },
    darkText: {
        color: Colors.light,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#ff0000',
    },
    loadingText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
    textbtn: {
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        padding: 10,
    },
    darkTextBtn: {
        color: Colors.light,
    },
    btn: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 5,
        marginHorizontal: 20,
    },
    darkBtn: {
        backgroundColor: 'rgba(252, 252, 252, 0.23)',
    },
    emergencyButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    }
});