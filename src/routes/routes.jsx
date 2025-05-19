import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native';

import Home from "../screens/Home";
import Setting from "../screens/Setting";
import Profile from "../screens/Profile";

const Drawer = createDrawerNavigator();

const Routes = () =>{
    return(
        <SafeAreaView style={{ flex: 1 }}>
            <NavigationContainer>
                <Drawer.Navigator>
                    <Drawer.Screen name='Home' component={Home} />
                    <Drawer.Screen name='Setting' component={Setting} />
                    <Drawer.Screen name='Profile' component={Profile} />
                </Drawer.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    )
}

export default Routes;