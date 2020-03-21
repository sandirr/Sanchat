import React, {Component, useEffect} from 'react';
import {View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

// import Map from './src/Map';
// import Message from './src/Message';
import AppNavigator from './components/navigations/MainNavigator';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  });
  console.disableYellowBox = true;
  return <AppNavigator />;
};

export default App;
