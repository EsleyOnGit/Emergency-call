import { Image, TouchableOpacity, Text, View, StyleSheet, SafeAreaView, Alert} from "react-native";
import editImage from "../../assets/edit.png";
import { Colors, Fonts } from "../context/personalizacoes";
import { useNavigation } from "@react-navigation/native";
import * as Contacts from 'expo-contacts';

export default function Button(props){
    const nav = useNavigation();

    //Função para alterar um contato
    const alterarContato = async () => {
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão negada para acessar os contatos.');
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
            const numeroLimpo = firstPhone.replace(/\D/g, '');
            setContato(numeroLimpo);
            await AsyncStorage.setItem('contatoEmergencia', numeroLimpo);
            Alert.alert('Contato alterado com sucesso!');
            console.log("Contato obtido:", numeroLimpo);
          } else {
            Alert.alert('Contato não possui número.');
          }
        } else {
          Alert.alert('Nenhum contato encontrado.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Erro ao alterar contato');
        nav.navigate('cadastrar');
      }
      
    };
    
    return(
        <SafeAreaView style={styles.viewBtn}>
            <View style={styles.containerText}>
                <Text disabled={true}>{props.title}:</Text>
                <Text>{props.descricao}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={alterarContato}>
                <Image style={styles.img} source={editImage} alt="icone de editar"/>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    viewBtn: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: Colors.menu3,
        borderRadius: 15,
        margin: 5
    },
    containerText: {
        flex: 1, 
        flexDirection: "column",
        alignItems: "flex-start", 
        gap: 5,
        marginLeft: 25,
        marginBottom: 5
    },
    textTitle: {
        fontSize: Fonts.titleMd,
        fontWeight: "bold",
        color: "#000"
    },
    textSubtitle: {
        fontSize: Fonts.textMd,
        color: "#333"
    },
    button: {
        width: 45,
        height: 45,
        justifyContent: "center",
        alignItems: "center"
    },
    img: {
        backgroundColor: Colors.green,
        width: 30,
        height: 30,
        resizeMode: "contain"
    }
});
