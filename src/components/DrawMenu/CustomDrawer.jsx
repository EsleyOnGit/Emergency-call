import { StyleSheet, TouchableNativeFeedback, View } from "react-native"
import { Fonts } from "../../context/personalizacoes";
import { useNavigation } from "@react-navigation/native";


const CustomDrawer = (props) =>{
    const navigation = useNavigation();
    return(
        <Container>
            <TouchableNativeFeedback onPress={()=> navigation.navigate('Profile')}>
                <Row>
                    <Image />
                    <View>
                        <Text>{nome}</Text>
                        <Text>tel: 71 9 9945-3920</Text>
                    </View>
                </Row>
            </TouchableNativeFeedback>
        </Container>
    )
}

export default CustomDrawer;

const Styles = StyleSheet.create({
    textContainer:{
        paddingHorizontal: Fonts.Spacing
    },
    avatar:{
        width: 50,
        height: 50
    },
    header:{
        padding: Fonts.Spacing
    },
    name:{
        fontSize: Fonts.titleSm
    }
})