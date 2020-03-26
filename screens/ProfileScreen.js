import React, {Component} from 'react';
import {
  Text,
  Alert,
  TouchableOpacity,
  AsyncStorage,
  Image,
  ActivityIndicator,
} from 'react-native';
import User from './navigations/User';
import {Container, Input, Button, Item, Label, Icon} from 'native-base';
import firebase from 'firebase';
import ImagePicker from 'react-native-image-picker';
import {db} from './Config';
class ProfileScreen extends Component {
  static navigationOptions = {
    // header: false,
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
  };
  onChange = key => val => {
    this.setState({[key]: val});
  };
  changeName = async () => {
    if (User.name !== this.state.name) {
      User.name = this.state.name;
      this.updateUser();
      Alert.alert('Success', 'Name changed');
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
      .set(User);
    Alert.alert('Success', 'Image has been changed');
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
  _logOut = async () => {
    await AsyncStorage.clear();
    this.setState({users: []});
    this.props.navigation.navigate('Auth');
  };
  render() {
    return (
      <Container>
        <TouchableOpacity onPress={this.changeImage}>
          {this.state.upload ? (
            <ActivityIndicator size="large" />
          ) : (
            <Image
              source={this.state.imageSource}
              style={{
                width: 100,
                height: 100,
                resizeMode: 'cover',
                alignSelf: 'center',
                marginTop: 22,
                borderRadius: 50,
              }}
            />
          )}
        </TouchableOpacity>
        <Text style={{alignSelf: 'center', fontWeight: 'bold', fontSize: 18}}>
          {User.phone}
        </Text>
        <Item style={{marginLeft: 40, marginRight: 40, borderBottomWidth: 0}}>
          <Label>Name: </Label>
          <Input value={this.state.name} onChangeText={this.onChange('name')} />
        </Item>
        <Button
          light
          onPress={this.changeName}
          style={{
            justifyContent: 'center',
            backgroundColor: '#f3f3f3',
            marginHorizontal: 40,
            borderRadius: 20,
            marginBottom: 25,
          }}>
          <Icon name="save" />
          <Text style={{fontWeight: 'bold'}}>Save</Text>
        </Button>

        <Button
          onPress={this._logOut}
          style={{
            justifyContent: 'center',
            backgroundColor: '#176781',
            marginHorizontal: 40,
            borderRadius: 20,
          }}>
          <Icon name="log-out" />
          <Text style={{fontWeight: 'bold', color: 'white'}}> Logout</Text>
        </Button>
      </Container>
    );
  }
}

export default ProfileScreen;
