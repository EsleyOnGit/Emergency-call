import { Image, TouchableNativeFeedback, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export function DrawMenu (){
    const navigation = useNavigation();
    return(
        <View>
            <TouchableNativeFeedback onPress={() => navigation.navigate('profile')}>  
                <Image source={avatar} />
                <View>
                <Text>{props.name}</Text>
                <Text>{props.idade}</Text>
                </View>
            </TouchableNativeFeedback>
        </View>
    )
}