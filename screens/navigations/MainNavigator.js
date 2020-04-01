import {
  createAppContainer,
  createSwitchNavigator,
  TabNavigator,
} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import AuthLoadingScreen from './Loading';
import LoginScreen from '../LoginScreen';
import HomeScreen from '../HomeScreen';
import ProfileScreen from '../ProfileScreen';
import RegisterScreen from '../RegisterScreen';
import ChatScreen from '../ChatScreen';
import ContactScreen from '../ContactScreen';
import MapScreen from '../MapScreen';
import Timeline from '../TimelineScreen';
import Around from '../AroundScreen';
import CreateStatus from '../CreateStatus';
import FriendProfile from '../FriendProfile';

const AppStack = createStackNavigator({
  Apps: HomeScreen,
  Chat: ChatScreen,
  Profile: ProfileScreen,
  Contact: ContactScreen,
  Map: MapScreen,
  Timeline: Timeline,
  Around: Around,
  Status: CreateStatus,
  Friend: FriendProfile,
});

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen,
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
