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
} from 'native-base';
import firebase from 'firebase';
import ImagePicker from 'react-native-image-picker';
import {db} from './Config';
import MapView from 'react-native-maps';
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
    showSave: false,
  };
  onChange = key => val => {
    this.setState({[key]: val});
    this.setState({showSave: true});
  };
  changeName = async () => {
    if (User.name !== this.state.name) {
      User.name = this.state.name;
      this.updateUser();
      this.setState({showSave: false});
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
  _logOut = async () => {
    await AsyncStorage.clear();
    this.setState({users: []});
    this.props.navigation.navigate('Auth');
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
            width: 130,
            height: 130,
            alignSelf: 'center',
          }}>
          {this.state.upload ? (
            <ActivityIndicator size="large" style={{marginTop: 40}} />
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
        <Item
          style={{
            marginLeft: 40,
            marginRight: 40,
            borderBottomWidth: 0,
          }}>
          <Label>
            <Icon name="create" style={{fontSize: 14}} />
          </Label>
          <Input value={this.state.name} onChangeText={this.onChange('name')} />
        </Item>
        <MapView
          style={{marginHorizontal: 40, height: 150, marginBottom: 25}}
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <MapView.Marker
            coordinate={{
              latitude: 37.78825,
              longitude: -122.4324,
            }}
            title="Lokasi"
            description="Hello"
          />
        </MapView>
        {this.state.showSave ? (
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
        ) : (
          <Text></Text>
        )}

        <Button
          onPress={this._logOut}
          transparent
          style={{
            justifyContent: 'center',
            marginHorizontal: 40,
            borderRadius: 20,
          }}>
          <Icon name="log-out" style={{color: '#000'}} />
          <Text style={{fontWeight: 'bold', color: '#000'}}> Logout</Text>
        </Button>
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
