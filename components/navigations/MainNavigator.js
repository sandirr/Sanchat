import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Loading from './Loading';
// import Map from '../Map';
import LoginScreen from '../page/Login';
import RegisterScreen from '../page/Register';
import HomeScreen from '../page/Home';
import Settings from '../page/partials/Settings';
import Chat from '../page/partials/Chat';

const AppStack = createStackNavigator({
  Apps: HomeScreen,
  //   Map,
  Settings: Settings,
  Chat: Chat,
});

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen,
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: Loading,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'Loading',
    },
  ),
);
