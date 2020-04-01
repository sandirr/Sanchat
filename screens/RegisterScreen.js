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
import firebase from 'firebase';
import {Item, Button, Input, Label, Container, Icon, H1} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
class RegisterScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  state = {
    phone: '',
    name: '',
    password: '',
    email: '',
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

  submitForm = async () => {
    if (this.state.phone.length < 10) {
      Alert.alert('Not valid !', 'Wrong phone number');
    } else if (this.state.email.length < 5) {
      Alert.alert('Not valid !', 'Wrong email');
    } else if (this.state.password.length < 8) {
      Alert.alert('Not valid !', 'Password contains at least 8 characters');
    } else if (this.state.name.length < 1) {
      Alert.alert('Not valid !', 'Please input your name/nickname');
    } else {
      var b = this.state.email.replace(/[a-zA-Z0-9.]/g, '');
      if (b !== '@') {
        Alert.alert('Email validation !', 'Wrong Email');
      } else {
        await AsyncStorage.setItem('userPhone', this.state.phone);
        User.phone = this.state.phone;
        User.password = this.state.password;
        firebase
          .database()
          .ref('users/' + User.phone)
          .set({
            name: this.state.name,
            phone: this.state.phone,
            password: this.state.password,
            email: this.state.email,
          });
        this.props.navigation.navigate('App');
      }
    }
  };
  render() {
    return (
      <Container
        style={{
          justifyContent: 'center',
        }}>
        <LinearGradient
          start={{x: 1.2, y: 0.0}}
          end={{x: 0.0, y: 1.0}}
          locations={[0.6, 3]}
          colors={['#fff', '#176781']}
          style={{
            flex: 1,
          }}>
          <View style={{marginTop: '20%', marginBottom: 30}}>
            <H1 style={{alignSelf: 'center', fontWeight: 'bold'}}>
              Sanchat <Icon style={{color: '#176781'}} name="chatbubbles" />
            </H1>
            <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>
              Connect with your friend now !
            </Text>
          </View>
          <View style={{paddingHorizontal: 40}}>
            <Item floatingLabel style={{marginBottom: 10}}>
              <Label>Name</Label>
              <Input
                value={this.state.name}
                onChangeText={this.handleChange('name')}
                style={{paddingLeft: 0}}
              />
            </Item>
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
              <Label>Email</Label>
              <Input
                keyboardType="email-address"
                value={this.state.email}
                onChangeText={this.handleChange('email')}
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
            <Text style={{color: '#fff', fontWeight: 'bold'}}>Sign Up</Text>
          </Button>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Login')}>
              <Text>
                Already have an account ?
                <Text style={{fontWeight: 'bold'}}> Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Container>
    );
  }
}

export default RegisterScreen;
