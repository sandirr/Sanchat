import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
  Text,
} from 'react-native';
import User from './User';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userPhone = await AsyncStorage.getItem('userPhone');
    User.phone = userPhone;

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userPhone ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
        <Text>Wait</Text>
      </View>
    );
  }
}
