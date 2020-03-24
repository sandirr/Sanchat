import React, {Component, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  AsyncStorage,
} from 'react-native';
import User from './navigations/User';
import {firebase} from '@react-native-firebase/database';
class LoginScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    phone: '',
    name: '',
  };

  handleChange = key => val => {
    this.setState({[key]: val});
  };

  componentWillMount() {
    AsyncStorage.getItem('userPhone').then(val => {
      if (val) {
        this.setState({phone: val});
      }
    });
  }

  submitForm = async () => {
    if (this.state.phone.length < 10) {
      Alert.alert('error', 'wrong phone number');
    } else {
      await AsyncStorage.setItem('userPhone', this.state.phone);
      User.phone = this.state.phone;
      firebase
        .database()
        .ref('users/' + User.phone)
        .set({name: this.state.name});
      this.props.navigation.navigate('App');
    }
  };
  render() {
    return (
      <View>
        <TextInput
          keyboardType="number-pad"
          placeholder="Phone Number"
          value={this.state.phone}
          onChangeText={this.handleChange('phone')}
        />
        <TextInput
          placeholder="Name"
          value={this.state.name}
          onChangeText={this.handleChange('name')}
        />
        <TouchableOpacity onPress={this.submitForm}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default LoginScreen;
