import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PROPage from './screens/PROPage'
import Home from './screens/Home'
import LogePage from './screens/LogePage';
import TechProfile from './screens/TechProfile'

import { useFonts } from 'expo-font';
export default function App() {
  const [fontLoaded] = useFonts({
    InterBold: require("./assets/fonts/Inter-Bold.ttf"),
    InterLight: require("./assets/fonts/Inter-Light.ttf"),
    InterMedium: require("./assets/fonts/Inter-Medium.ttf"),
    InterRegular: require("./assets/fonts/Inter-Regular.ttf"),
    InterSemiBold: require("./assets/fonts/Inter-SemiBold.ttf"),
  });
  if (!fontLoaded) return null;


  const Stack = createNativeStackNavigator();

  return (
    < >
      <StatusBar style='light' />
      <NavigationContainer>
        <Stack.Navigator initialRouteName='LogePage' screenOptions={
          { headerShown: false, }
        } > 
          <Stack.Screen name='LogePage' component={LogePage} />
          <Stack.Screen name='TechProfile' component={TechProfile} />
          <Stack.Screen name='PROPage' component={PROPage} />
          <Stack.Screen name='Home' component={Home} />

        </Stack.Navigator>
      </NavigationContainer>

    </>
  );
}

