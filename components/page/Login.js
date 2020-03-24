import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  LayoutAnimation,
  ScrollView,
  KeyboardAvoidingView,
  ToastAndroid,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/database';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      email: '',
      password: '',
      latitude: null,
      longitude: null,
      errorMessage: null,
      visible: false,
      Onprosess: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  hideToast = () => {
    this.setState({
      visible: false,
    });
  };

  handleLogin = () => {
    const {email, password} = this.state;
    if (email.length < 6) {
      ToastAndroid.show(
        'Please input a valid email address',
        ToastAndroid.LONG,
      );
    } else if (password.length < 6) {
      ToastAndroid.show(
        'Password must be at least 6 characters',
        ToastAndroid.LONG,
      );
    } else {
      // Action
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(async data => {
          console.log(data.user.displayName, 'dataniih');
        })
        .catch(error => console.log(error.message));
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />
        <ScrollView>
          <Text style={styles.greeting}>{`Hello again.\nWelcome back.`}</Text>
          <View style={styles.errorMessage}>
            {this.state.errorMessage && (
              <Text style={styles.error}>{this.state.errorMessage}</Text>
            )}
          </View>
          <View style={styles.form}>
            <View>
              <KeyboardAvoidingView behavior="padding" enabled>
                <Text style={styles.inputTitle}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  onChangeText={email => this.setState({email})}
                  value={this.state.email}
                />
              </KeyboardAvoidingView>
            </View>

            <View style={{marginTop: 32}}>
              <KeyboardAvoidingView behavior="padding" enabled>
                <Text style={styles.inputTitle}>Password</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  autoCapitalize="none"
                  onChangeText={password => this.setState({password})}
                  value={this.state.password}></TextInput>
              </KeyboardAvoidingView>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
            <Text style={{color: '#ffffff', fontWeight: 'bold'}}>SIGN IN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{alignSelf: 'center', marginTop: 32}}
            onPress={() => this.props.navigation.navigate('Register')}>
            <Text style={{color: '#414959', fontSize: 13}}>
              New to Firebase App?{' '}
              <Text style={{fontWeight: 'bold', color: '#000000'}}>
                Sign up
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const Toast = props => {
  if (props.visible) {
    ToastAndroid.showWithGravityAndOffset(
      props.message,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      1,
      800,
    );
    return null;
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greeting: {
    marginTop: 50,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    color: '#000000',
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30,
  },
  inputTitle: {
    color: '#8A8F9E',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  input: {
    borderBottomColor: '#8A8F9E',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: '#161F3D',
  },
  button: {
    marginHorizontal: 30,
    marginBottom: 10,
    backgroundColor: '#2295d4',
    borderRadius: 10,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorMessage: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  error: {
    color: 'red',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  back: {
    position: 'absolute',
    top: 48,
    left: 32,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(21, 22, 48, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
