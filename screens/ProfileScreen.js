import React, {Component} from 'react';
import {
  Text,
  Alert,
  TouchableOpacity,
  AsyncStorage,
  Image,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import User from './navigations/User';
import {
  Container,
  Input,
  Button,
  Item,
  Label,
  Icon,
  Header,
  Thumbnail,
  Title,
  Subtitle,
  Left,
  Body,
  Right,
  ListItem,
  Switch,
} from 'native-base';
import firebase from 'firebase';
import ImagePicker from 'react-native-image-picker';
import {db} from './Config';

class ProfileScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  state = {
    name: User.name,
    phone: User.phone,
    imageSource: User.image
      ? {uri: User.image}
      : {
          uri:
            'https://cdn.iconscout.com/icon/free/png-256/account-profile-avatar-man-circle-round-user-30452.png',
        },
    upload: false,
    showSaveName: false,
    error: '',
    password: '',
    showSavePass: false,
  };

  onChange = key => val => {
    this.setState({[key]: val});
    if (key === 'name') {
      this.setState({showSaveName: true});
    }
    if (key === 'password') {
      this.setState({showSavePass: true});
    }
  };
  changeName = async () => {
    if (User.name !== this.state.name) {
      User.name = this.state.name;
      this.updateUser();
      this.setState({showSaveName: false});
    }
  };
  changePassword = async () => {
    if (User.password !== this.state.password) {
      User.password = this.state.password;
      this.updateUser();
      this.setState({showSavePass: false});
    }
  };
  changeImage = () => {
    const options = {
      quality: 0.7,
      allowsEditing: true,
      mediaType: 'photo',
      noData: true,
      storageOptions: {
        skipBackup: true,
        waitUntilSaved: true,
        path: 'images',
        cameraRoll: true,
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.error) {
        console.log(error);
      } else if (!response.didCancel) {
        this.setState(
          {
            upload: true,
            imageSource: {uri: response.uri},
          },
          this.uploadFile,
        );
      }
    });
  };
  updateUser = () => {
    db.ref('users')
      .child(User.phone)
      .set(User)
      .then(res => {
        Alert.alert('Success', 'Saved changes');
      });
  };
  updateUserImage = imageUrl => {
    User.image = imageUrl;
    this.updateUser();
    this.setState({upload: false, imageSource: {uri: imageUrl}});
  };
  uploadFile = async () => {
    const file = await this.uriToBlob(this.state.imageSource.uri);
    await firebase
      .storage()
      .ref(`profile_pictures/${User.phone}.png`)
      .put(file)
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(url => this.updateUserImage(url))
      .catch(error => {
        this.setState({
          upload: false,
          imageSource: require('../images/bgchat.png'),
        });
        Alert.alert('Error:', error.message);
      });
  };

  uriToBlob = uri => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function() {
        reject(new Error('Upload Image Failed'));
      };

      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  };
  _logOut = () => {
    Alert.alert('LOGOUT', 'Are you sure ?', [
      {
        text: 'NO',
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: async () => {
          await AsyncStorage.clear();
          this.setState({users: []});
          this.props.navigation.navigate('Auth');
        },
      },
    ]);
  };
  render() {
    return (
      <Container>
        <Header noShadow style={style.header}>
          <Left>
            <Button
              style={{flex: 1}}
              transparent
              onPress={() => this.props.navigation.goBack()}>
              <Icon style={{color: '#fff'}} name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title style={{color: '#fff', fontWeight: 'bold'}}>Profile</Title>
          </Body>
          <Right></Right>
        </Header>
        <StatusBar barStyle="light-content" backgroundColor="#145970" />
        <TouchableOpacity
          onPress={this.changeImage}
          style={{
            width: 180,
            height: 180,
            alignSelf: 'center',
          }}>
          {this.state.upload ? (
            <ActivityIndicator size="large" style={{marginTop: 50}} />
          ) : (
            <Image
              source={this.state.imageSource}
              style={{
                borderColor: '#c3c3c3',
                borderWidth: 5,
                width: 150,
                height: 150,
                resizeMode: 'cover',
                alignSelf: 'center',
                marginTop: 30,
                borderRadius: 50,
                resizeMode: 'cover',
              }}
            />
          )}
        </TouchableOpacity>
        <ListItem icon style={{marginTop: 30}}>
          <Left>
            <Button style={{backgroundColor: '#FF9501'}}>
              <Icon active name="person" />
            </Button>
          </Left>
          <Body>
            <Input
              value={this.state.name}
              onChangeText={this.onChange('name')}
            />
          </Body>
          <Right>
            {this.state.showSaveName ? (
              <TouchableOpacity onPress={this.changeName}>
                <Icon name="save" />
              </TouchableOpacity>
            ) : (
              <Icon active name="create" />
            )}
          </Right>
        </ListItem>
        <ListItem icon style={{marginTop: 20}}>
          <Left>
            <Button style={{backgroundColor: '#007AFF'}}>
              <Icon active name="finger-print" />
            </Button>
          </Left>
          <Body>
            <Input
              secureTextEntry
              placeholder="Change password !"
              onChangeText={this.onChange('password')}
            />
          </Body>
          <Right>
            {this.state.showSavePass ? (
              <TouchableOpacity onPress={this.changePassword}>
                <Icon name="save" />
              </TouchableOpacity>
            ) : (
              <Icon active name="create" />
            )}
          </Right>
        </ListItem>
        <ListItem icon style={{marginTop: 20}}>
          <Left>
            <Button style={{backgroundColor: '#007AFF'}}>
              <Icon active name="call" />
            </Button>
          </Left>
          <Body>
            <Text>{User.phone}</Text>
          </Body>
        </ListItem>
        <ListItem icon style={{marginTop: 20}}>
          <Left>
            <Button style={{backgroundColor: '#007AFF'}}>
              <Icon active name="mail" />
            </Button>
          </Left>
          <Body>
            <Text>{User.email}</Text>
          </Body>
        </ListItem>
        <ListItem icon style={{marginTop: 20}}>
          <Left>
            <Button style={{backgroundColor: '#007AFF'}} onPress={this._logOut}>
              <Icon active name="log-out" />
            </Button>
          </Left>
          <Body>
            <TouchableOpacity onPress={this._logOut}>
              <Text>Logout</Text>
            </TouchableOpacity>
          </Body>
          <Right>
            <TouchableOpacity onPress={this._logOut}>
              <Icon active name="arrow-forward" />
            </TouchableOpacity>
          </Right>
        </ListItem>
      </Container>
    );
  }
}
const style = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
  photo: {
    height: 40,
    width: 40,
    borderRadius: 50,
    marginRight: 5,
  },
  header: {
    backgroundColor: '#176781',
  },
});
export default ProfileScreen;
