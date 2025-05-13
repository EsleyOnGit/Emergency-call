import { NavigartionContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native';

import Home from "../screens/Home";
import Setting from "../screens/Setting";
import Profile from "../screens/Profile";

const Drawer = createDrawerNavigator();

const Routes = () =>{
    return(
        <SafeAreaView>
            <NavigartionContainer>
                <Drawer.Navigator>
                    <Drawer.screen name='Home' component={Home} />
                    <Drawer.screen name='Setting' component={Setting} />
                    <Drawer.screen name='Profile' component={Profile} />
                </Drawer.Navigator>
            </NavigartionContainer>
        </SafeAreaView>
    )
}

export default Routes;