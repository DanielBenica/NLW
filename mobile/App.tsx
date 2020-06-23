import React from 'react';
import { View,StatusBar } from 'react-native';
import {AppLoading} from 'expo'
import Routes from './src/routes'
import {Ubuntu_700Bold,useFonts} from '@expo-google-fonts/ubuntu'
import {Roboto_400Regular,Roboto_500Medium} from '@expo-google-fonts/roboto'

export default function App() {
  
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  });

  if(!fontsLoaded){
    return <AppLoading/>
  }

  return (
    <>
    <StatusBar barStyle ='dark-content' backgroundColor='transparent' translucent/>
    <Routes />
    </>
  );
}


//1:24:21