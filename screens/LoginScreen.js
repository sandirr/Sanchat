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
import {Item, Button, Input, Label, Container, Icon} from 'native-base';

class LoginScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    phone: '',
    password: '',
  };

  handleChange = key => val => {
    this.setState({[key]: val});
  };

  componentDidMount() {
    AsyncStorage.getItem('userPhone').then(val => {
      if (val) {
        this.setState({phone: val});
      }
    });
  }

  SavePhone = async () => {
    await AsyncStorage.setItem('userPhone', this.state.phone);
  };
  submitForm = () => {
    if (this.state.phone.length < 10) {
      Alert.alert('error', 'wrong phone number');
    } else if (this.state.password.length < 1) {
      Alert.alert('Password', 'Please type your password!');
    } else {
      User.phone = this.state.phone;
      firebase
        .database()
        .ref('users/')
        .on('child_added', value => {
          if (value.val().phone === this.state.phone) {
            firebase
              .database()
              .ref('users/' + User.phone)
              .on('value', val => {
                if (val) {
                  if (val.val().password === this.state.password) {
                    this.SavePhone();
                    this.props.navigation.navigate('App');
                  } else {
                    Alert.alert('Sanchat...', 'Your Password False');
                  }
                }
              });
          }
        });
    }
  };
  render() {
    return (
      <Container
        style={{
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}>
        <View style={{paddingHorizontal: 40}}>
          <Item floatingLabel style={{marginBottom: 10}}>
            <Label>Phone</Label>
            <Input
              keyboardType="number-pad"
              value={this.state.phone}
              onChangeText={this.handleChange('phone')}
              style={{paddingLeft: 0}}
            />
          </Item>
          <Item floatingLabel style={{marginBottom: 10}}>
            <Label>Password</Label>
            <Input
              secureTextEntry
              value={this.state.password}
              onChangeText={this.handleChange('password')}
              style={{paddingLeft: 0}}
            />
          </Item>
        </View>
        <Button
          onPress={this.submitForm}
          rounded
          style={{
            justifyContent: 'center',
            marginHorizontal: 40,
            marginTop: 15,
            backgroundColor: '#176781',
            flex: 1,
          }}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>Sign In</Text>
        </Button>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Register')}>
            <Text>
              Don't have an account ?
              <Text style={{fontWeight: 'bold'}}> Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }
}

export default LoginScreen;