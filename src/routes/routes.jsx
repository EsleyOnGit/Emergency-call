import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaView, StyleSheet } from 'react-native';

import Home from "../screens/Home";
import Setting from "../screens/Setting";
import Profile from "../screens/Profile";
import Cadastrar from '../screens/Cadastrar';
import { Fonts } from "../context/personalizacoes";
import { Colors } from "../context/personalizacoes";
import { InformationsContext } from '../context/formInfo';
import { SettingsContext } from '../context/settingsContext';

const Drawer = createDrawerNavigator();

const Routes = () =>{
    const { nome } = useContext(InformationsContext);
    const {darkMode} = useContext(SettingsContext);
    return(
        <SafeAreaView style={{ flex: 1 }}>
            <NavigationContainer>
                <Drawer.Navigator screenOptions={{
                    drawerType: 'slide',
                    overlayColor: 'transparent',
                    drawerActiveBackgroundColor: darkMode? 'rgba(255, 255, 255, 0.21)': Colors.menu2,
                    drawerItemStyle: darkMode? Styles.drawerItemStylesDark : Styles.drawerItemStyles,
                    drawerActiveTintColor: Colors.black,
                    drawerLabelStyle: {
                        borderRadius: 12,
                        color: darkMode? Colors.light : Colors.black},
                    drawerStyle:{
                        backgroundColor: darkMode? Colors.darkMode:'rgba(255, 255, 255, 0.68)',
                        color: darkMode? Colors.light : Colors.black,
                    },
                    
                }}
                >
                    {nome === '' ? <Drawer.Screen name='cadastrar' component={Cadastrar} /> : <Drawer.Screen name='Home' component={Home} />}
                    <Drawer.Screen name='Profile' component={Profile} />
                    <Drawer.Screen name='Setting' component={Setting} />
                </Drawer.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    )
}

export default Routes;

const Styles = StyleSheet.create({   
    drawerStyle: {
        width: 200,
    },
    drawerItemStyles:{
        borderRadius: 12,
        color: Colors.black
    },
    drawerItemStylesDark:{
        borderRadius: 12,
        color: Colors.light
    },
    drawerLabelStyles:{
        fontSize: Fonts.titleSm,
    }
})