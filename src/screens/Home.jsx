import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, Platform, ActivityIndicator, Switch, Linking } from 'react-native';
import siren from "../../assets/siren.png";
import * as Speech from 'expo-speech';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as SMS from "expo-sms";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useContext } from 'react';
import { useNavigation } from "@react-navigation/native";
import {InformationsContext} from '../context/formInfo';
import Container from '../components/Container/container';
import { SettingsContext } from '../context/settingsContext';
import { Colors } from '../context/personalizacoes';

export default function Home(){
    const { nome, data_nasc, tipoSang, alergia,
            medicacao, nomeCont, setNomeCont, numContato, setNumContato
          } = useContext(InformationsContext);
    const {darkMode, sms, tamFont} = useContext(SettingsContext);

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [contato, setContato] = useState(''); // contato padrão
    const [contatoNome, setContatoNome] = useState('Contato de Emergência');
    const [permissaoContatos, setPermissaoContatos] = useState(false);
    const nav = useNavigation();

    // FUNÇÃO CORRIGIDA PARA SOLICITAR PERMISSÃO DE CONTATOS
    const solicitarPermissaoContatos = async () => {
        try {
            console.log("Solicitando permissão de contatos...");
            
            // Primeiro verifica se já tem permissão
            const { status: statusAtual } = await Contacts.getPermissionsAsync();
            console.log("Status atual dos contatos:", statusAtual);
            
            if (statusAtual === 'granted') {
                setPermissaoContatos(true);
                return true;
            }
            
            // Se não tem permissão, solicita
            const { status: novoStatus, canAskAgain } = await Contacts.requestPermissionsAsync();
            console.log("Novo status dos contatos:", novoStatus, "Pode perguntar novamente:", canAskAgain);
            
            if (novoStatus === 'granted') {
                setPermissaoContatos(true);
                return true;
            }
            
            // Se não pode perguntar novamente, mostra alerta para ir nas configurações
            if (!canAskAgain) {
                Alert.alert(
                    "Permissão necessária",
                    "Para usar contatos de emergência, você precisa permitir o acesso aos contatos nas configurações do aplicativo.",
                    [
                        { text: "Cancelar", style: "cancel" },
                        { text: "Abrir Configurações", onPress: () => Linking.openSettings() }
                    ]
                );
            }
            
            setPermissaoContatos(false);
            return false;
            
        } catch (error) {
            console.log("Erro ao solicitar permissão de contatos:", error);
            setPermissaoContatos(false);
            return false;
        }
    };

    // FUNÇÃO CORRIGIDA PARA BUSCAR CONTATOS
    const buscarContatos = async () => {
        try {
            if (!permissaoContatos) {
                console.log("Sem permissão para acessar contatos, usando contato padrão");
                return;
            }

            console.log("Buscando contatos...");
            
            const { data } = await Contacts.getContactsAsync({
                fields: [
                    Contacts.Fields.Name,
                    Contacts.Fields.PhoneNumbers,
                ],
                sort: Contacts.SortTypes.FirstName,
            });

            console.log(`Encontrados ${data.length} contatos`);

            if (data.length > 0) {
                // Procura por contatos que tenham números de telefone
                const contatosComTelefone = data.filter(contato => 
                    contato.phoneNumbers && contato.phoneNumbers.length > 0
                );

                if (contatosComTelefone.length > 0) {
                    const primeiroContato = contatosComTelefone[0];
                    const numeroTelefone = primeiroContato.phoneNumbers[0].number;
                    const nomeContato = primeiroContato.name || 'Contato';

                    // Limpa o número (remove espaços, parênteses, traços)
                    const numeroLimpo = numeroTelefone.replace(/\D/g, '');
                    
                    setContato(numeroLimpo);
                    setContatoNome(nomeContato);
                    setNomeCont(nomeContato);
                    setNumContato(numeroLimpo
                        
                    )
                    // Salva o contato no AsyncStorage
                    await AsyncStorage.setItem('contatoEmergencia', numeroLimpo);
                    await AsyncStorage.setItem('nomeContatoEmergencia', nomeContato);
                    
                    console.log(`Contato definido: ${nomeContato} - ${numeroLimpo}`);
                } else {
                    console.log("Nenhum contato com telefone encontrado");
                }
            } else {
                console.log("Nenhum contato encontrado na agenda");
            }

        } catch (error) {
            console.log("Erro ao buscar contatos:", error);
            Alert.alert(
                "Erro",
                "Erro ao acessar seus contatos. Usando contato padrão.",
                [{ text: "OK" }]
            );
        }
    };

    // FUNÇÃO PARA CARREGAR CONTATO SALVO
    const carregarContatoSalvo = async () => {
        try {
            const contatoSalvo = await AsyncStorage.getItem('contatoEmergencia');
            const nomeSalvo = await AsyncStorage.getItem('nomeContatoEmergencia');
            
            if (contatoSalvo) {
                setContato(contatoSalvo);
                setContatoNome(nomeSalvo || 'Contato de Emergência');
                setNomeCont(nomeSalvo);
                setNumContato(contatoSalvo)

                console.log(`Contato carregado: ${nomeSalvo} - ${contatoSalvo}`);
            }
        } catch (error) {
            console.log("Erro ao carregar contato salvo:", error);
        }
    };

    const enviarLocalizacaoPorSMS = async (location, contatos) => {
  try {
    if (!location || !location.coords) {
      Alert.alert("Erro", "Localização não disponível.");
      return false;
    }

    if (!contatos || contatos.length === 0) {
      Alert.alert("Erro", "Nenhum contato fornecido.");
      return false;
    }

    const mensagem = `EMERGÊNCIA! Estou precisando de ajuda urgente! Minha localização é: https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
    
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Erro', 'SMS não disponível neste dispositivo');
      return false;
    }

    const resultado = await SMS.sendSMSAsync(contatos, mensagem);
    console.log("SMS enviado:", resultado);
    return resultado;

  } catch (error) {
    console.error("Erro ao enviar SMS:", error);
    Alert.alert('Erro', 'Erro ao enviar SMS: ' + (error.message || error.toString()));
    return false;
  }
};

/* testar função sms
const mockLocation = {
  coords: {
    latitude: -23.5505,
    longitude: -46.6333
  }
};
const mockContatos = ["+5511999999999"];

enviarLocalizacaoPorSMS(mockLocation, mockContatos);

*/

    // FUNÇÃO CORRIGIDA PARA OBTER DADOS
    async function fetchData() {
        try {
            console.log("=== INICIANDO FETCHDATA ===");
            
            // 1. Carrega contato salvo primeiro
            await carregarContatoSalvo();
            
            // 2. Solicita permissão de contatos
            const temPermissaoContatos = await solicitarPermissaoContatos();
            
            // 3. Se tem permissão, busca contatos
            if (temPermissaoContatos) {
                await buscarContatos();
            }
            
            // 4. Solicita permissão de localização
            console.log("Solicitando permissão de localização...");
            const { status } = await Location.requestForegroundPermissionsAsync();
            
            if (status !== 'granted') {
                setErrorMsg('Permissão para acessar localização foi negada. Por favor, habilite nas configurações do seu dispositivo.');
                return;
            }

            console.log("Permissão de localização concedida, obtendo localização...");
            const locationResult = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
                timeout: 15000,
            });
            
            console.log("Localização obtida:", locationResult.coords);
            setLocation(locationResult);
            console.log("=== FETCHDATA CONCLUÍDO ===");

        } catch (error) {
            console.log("Erro em fetchData:", error);
            
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
                        setErrorMsg(null);
                        setLocation(null);
                        fetchData();
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
                <Text style={[styles.infoText, darkMode && styles.darkText]}>
                    Contato: {contatoNome}
                </Text>
            </Container>
        );
    }

    function sendLocation(location){
        const thingToSay = `Alerta de emergência enviado para ${contatoNome}!`;
        
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
                
                // Envia SMS se habilitado
                if(sms) {
                    enviarLocalizacaoPorSMS(contato, message);
                }
                
                // Envia via WhatsApp
                const message = `🚨%20EMERGÊNCIA!%20Estou%20precisando%20de%20ajuda%20urgente!%20Minha%20localização%20é:%20https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
                Linking.openURL(`https://wa.me/55${contato}?text=${message}`);
                
                Alert.alert(
                    "Alerta Enviado!", 
                    `Mensagem de emergência enviada para ${contatoNome}`,
                    [{ text: "OK" }]
                );
                Speech.speak(thingToSay);
                
            } catch (error) {
                Alert.alert("Erro ao enviar a localização: " + error.message);
                Speech.speak("Erro ao enviar a localização!");
            }
        }
    }

    return (
        <Container>
            <View style={styles.infoContainer}>
                <Text style={[styles.infoText, darkMode && styles.darkText, {fontSize: tamFont}]}>
                    Contato de Emergência: {contatoNome}
                </Text>
            </View>
            
            <TouchableOpacity 
                onPress={() => sendLocation(location)}
                style={styles.emergencyButton}
                accessibilityLabel="Botão de emergência"
                accessibilityHint="Toque para enviar sua localização para o contato de emergência"
            >
                <Image source={siren} style={styles.image}/>
                <Text style={[styles.text, darkMode && styles.darkText]}>
                    EMERGÊNCIA
                </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[styles.configBtn, darkMode && styles.darkBtn]}
                onPress={() => nav.navigate("Setting")}
            >
                <Text style={[styles.configText, darkMode && styles.darkTextBtn]}>
                    Configurações
                </Text>
            </TouchableOpacity>
        </Container>
    );
}

const styles = StyleSheet.create({
    infoContainer: {
        padding: 20,
        alignItems: 'center',
    },
    infoText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 10,
    },
    image: {
        width: 120,
        height: 120,
        alignSelf: "center",
        marginTop: 30
    },
    text: {
        color: '#000',
        fontSize: 24,
        fontWeight: 'bold',
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
        paddingHorizontal: 20,
    },
    loadingText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
    textbtn: {
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
        padding: 15,
        fontWeight: '600',
    },
    darkTextBtn: {
        color: Colors.light,
    },
    btn: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 5,
    },
    darkBtn: {
        backgroundColor: 'rgba(252, 252, 252, 0.23)',
    },
    emergencyButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        backgroundColor: '#ff4444',
        marginHorizontal: 20,
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    configBtn: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 10,
        marginHorizontal: 20,
        marginTop: 20,
    },
    configText: {
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
        padding: 15,
    },
});