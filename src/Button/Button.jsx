import { Image, TouchableOpacity, Text, View, StyleSheet, SafeAreaView } from "react-native";
import editImage from "../../assets/edit.png";
import { Colors, Fonts } from "../context/personalizacoes";
import { useNavigation } from "@react-navigation/native";

export default function Button(props){
    const nav = useNavigation();
    return(
        <SafeAreaView style={styles.viewBtn}>
            <View style={styles.containerText}>
                <Text disabled={true}>{props.title}:</Text>
                <Text>{props.descricao}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={()=> nav.navigate("cadastrar")}>
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
