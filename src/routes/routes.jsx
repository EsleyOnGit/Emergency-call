import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaView, StyleSheet } from 'react-native';

import Home from "../screens/Home";
import Setting from "../screens/Setting";
import Profile from "../screens/Profile";
import Cadastrar from '../screens/Cadastrar';
import { useContext } from 'react';
import { InformationsContext } from '../context/formInfo';
import { Colors } from "../context/personalizacoes";
import { Fonts } from "../context/personalizacoes";

const Drawer = createDrawerNavigator();

const Routes = () =>{
    const { numContato } = useContext(InformationsContext);
    
    return(
        <SafeAreaView style={{ flex: 1 }}>
            <NavigationContainer>
                <Drawer.Navigator screenOptions={{
                    drawerType: 'slide',
                    overlayColor: 'transparent',
                    drawerActiveBackgroundColor: Colors.primary,
                    drawerItemStyle: Styles.drawerItemStyles,
                    drawerActiveTintColor: Colors.black,
                    drawerLabelStyle: Styles.drawerItemStyles.drawerLabelStyles,
                }}>
                    {numContato == 11 ? <Drawer.Screen name='cadastrar' component={Cadastrar} /> : <Drawer.Screen name='Home' component={Home} />}
                    <Drawer.Screen name='Setting' component={Setting} />
                    <Drawer.Screen name='Profile' component={Profile} />
                </Drawer.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    )
}

export default Routes;

const Styles = StyleSheet.create({
    drawerStyle: {
        width: 240
    },
    drawerItemStyles:{
        borderRadius: 12,

    },
    drawerLabelStyles:{
        fontSize: Fonts.titleSm,
    }
})