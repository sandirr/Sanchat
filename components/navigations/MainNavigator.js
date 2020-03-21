import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Loading from './Loading';
// import Map from '../Map';
import LoginScreen from '../page/Login';
import RegisterScreen from '../page/Register';
import HomeScreen from '../page/Home';

const AppStack = createStackNavigator({
  Apps: {
    screen: HomeScreen,
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f4f4f4',
        elevation: 0,
        height: 35,
      },
    },
  },
  //   Map,
});

const AuthStack = createStackNavigator({
  Register: RegisterScreen,
  Login: LoginScreen,
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
