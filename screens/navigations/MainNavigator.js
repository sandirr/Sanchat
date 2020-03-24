import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import AuthLoadingScreen from './Loading';
import LoginScreen from '../LoginScreen';
import HomeScreen from '../HomeScreen';
// import Map from '../Map';
// import RegisterScreen from '../page/Register';
// import Settings from '../page/partials/Settings';
import ChatScreen from '../ChatScreen';

const AppStack = createStackNavigator({
  Apps: HomeScreen,
  Chat: ChatScreen,
  //   Map,
  // Settings: Settings,
  // Chat: Chat,
});

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  // Register: RegisterScreen,
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'Loading',
    },
  ),
);
