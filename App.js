import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreens from "./src/Screens/LoginScreens"
import SignupScreens from "./src/Screens/SignupScreens"
import HomeScreen from "./src/Screens/HomeScreen"
import SearchScreen from "./src/Screens/SearchScreen"
import ProfileScreen from "./src/Screens/ProfileScreen"
import ChatScreen from "./src/Screens/ChatScreen"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthenticatedUserProvider, {AuthenticatedUserContext} from "./context/AuthenticationContext"
import { useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from "./firebase/config"
const Stack = createNativeStackNavigator();  
const RootNavigator = () =>{
  const {user,setUser} = useContext(AuthenticatedUserContext);
  const [isLoading,setIsLoading] = useState(false)
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsLoading(true)
      if(user){
        setUser(user)
      }
    })
    setIsLoading(false)

  },[])
  return (
    <NavigationContainer >
      {!user ? <Auth /> : <Main/>}
    </NavigationContainer>
  )
}
const Main = () => {
  return(

    <Stack.Navigator initialRouteName="AppChat" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="AppChat" component={HomeScreen} />
        <Stack.Screen name="profile" component={ProfileScreen} />
        <Stack.Screen name="search" component={SearchScreen} />
        <Stack.Screen name="chat" component={ChatScreen} options={{ title: "" }}/>
    </Stack.Navigator>
    
  )
}
const Auth = () => {
  return(
    
    <Stack.Navigator initialRouteName="login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" component={LoginScreens} />
        <Stack.Screen name="register" component={SignupScreens} />
      </Stack.Navigator>

  )
}
export default function App() {
  return ( 
    <AuthenticatedUserProvider>
      <RootNavigator /> 
    </AuthenticatedUserProvider>
  );
}


