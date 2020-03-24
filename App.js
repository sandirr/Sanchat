import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';

// import Map from './src/Map';
// import Message from './src/Message';
import AppNavigator from './screens/navigations/MainNavigator';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  });
  console.disableYellowBox = true;
  return <AppNavigator />;
};

export default App;
