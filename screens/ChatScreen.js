import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Alert,
  Dimensions,
  ScrollView,
  Linking,
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Subtitle,
  Image,
  Thumbnail,
  Input,
  Item,
} from 'native-base';
import Firebase from 'firebase';
import User from './navigations/User';
import Geolocation from '@react-native-community/geolocation';
import MapView from 'react-native-maps';

class ChatScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      textMessage: '',
      person: {
        name: props.navigation.getParam('name'),
        phone: props.navigation.getParam('phone'),
      },
      messageList: [],
      dbRef: Firebase.database().ref('messages'),
      image: '',
      imageSource: User.image
        ? {uri: User.image}
        : {
            uri:
              'https://cdn.iconscout.com/icon/free/png-256/account-profile-avatar-man-circle-round-user-30452.png',
          },
    };
  }

  componentDidMount() {
    this.setState({
      image: this.props.navigation.getParam('image'),
    });
    this.state.dbRef
      .child(User.phone)
      .child(this.state.person.phone)
      .on('child_added', value => {
        this.setState(prevState => {
          return {
            messageList: [...prevState.messageList, value.val()],
          };
        });
      });
  }
  handleChangeText = key => val => {
    this.setState({[key]: val});
  };
  convertTime = time => {
    let d = new Date(time);
    let c = new Date();
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + '.';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    var weekday = new Array(7);
    weekday[0] = 'Sunday';
    weekday[1] = 'Monday';
    weekday[2] = 'Tuesday';
    weekday[3] = 'Wednesday';
    weekday[4] = 'Thursday';
    weekday[5] = 'Friday';
    weekday[6] = 'Saturday';
    if (c.getDay() !== d.getDay()) {
      result = weekday[d.getDay()] + ', ' + result;
    } else if (c.getMonth() !== d.getMonth()) {
      result = d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear();
    }
    return result;
  };
  sendLocation = async location => {
    console.log(location);
    let msgId = this.state.dbRef
      .child(`${User.phone}`)
      .child(this.state.person.phone)
      .push().key;
    let updates = {};
    let message = {
      message: location,
      time: Firebase.database.ServerValue.TIMESTAMP,
      from: User.phone,
    };
    updates[
      `${User.phone}` + '/' + this.state.person.phone + '/' + msgId
    ] = message;
    updates[
      this.state.person.phone + '/' + `${User.phone}` + '/' + msgId
    ] = message;
    this.state.dbRef.update(updates);
    this.setState({textMessage: ''});
  };
  sendMessage = async => {
    if (this.state.textMessage.length > 0) {
      let msgId = this.state.dbRef
        .child(`${User.phone}`)
        .child(this.state.person.phone)
        .push().key;
      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: Firebase.database.ServerValue.TIMESTAMP,
        from: User.phone,
      };
      updates[
        `${User.phone}` + '/' + this.state.person.phone + '/' + msgId
      ] = message;
      updates[
        this.state.person.phone + '/' + `${User.phone}` + '/' + msgId
      ] = message;
      this.state.dbRef.update(updates);
      this.setState({textMessage: ''});
    }
  };
  shareLocation = () => {
    Geolocation.getCurrentPosition(info => {
      var {latitude, longitude, accuracy} = info.coords;
      Alert.alert(
        'CONFIRM !',
        `Share your location ?\nAccuracy: ${
          Math.floor(accuracy) > 100 ? 99 : Math.floor(accuracy)
        }%`,
        [
          {
            text: 'NO',
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: () => {
              const location = {
                latitude: latitude,
                longitude: longitude,
              };
              this.sendLocation(location);
            },
          },
        ],
      );
    });
  };
  renderRow = ({item}) => {
    if (!item.message.latitude || !item.message.longitude) {
      if (item.from === User.phone) {
        return (
          <View style={style.sendingChat}>
            <View style={style.sendingText}>
              <Text style={style.textSending}>{item.message}</Text>
              <Text
                note
                style={{alignSelf: 'flex-end', fontSize: 12, color: '#fff'}}>
                {this.convertTime(item.time)}
              </Text>
            </View>
          </View>
        );
      } else {
        return (
          <View style={style.incomingChat}>
            <View style={style.incomingText}>
              <Text style={{fontSize: 16}}>{item.message}</Text>
              <Text note style={{alignSelf: 'flex-end', fontSize: 12}}>
                {this.convertTime(item.time)}
              </Text>
            </View>
          </View>
        );
      }
    } else {
      if (item.from === User.phone) {
        return (
          <View
            style={{
              flex: 1,
              paddingHorizontal: 10,
              paddingVertical: 8,
              backgroundColor: '#3cb4dc',
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              borderBottomLeftRadius: 15,
              alignSelf: 'flex-end',
              width: '70%',
              marginBottom: 5,
            }}>
            <MapView
              liteMode
              style={{height: 150}}
              region={{
                latitude: item.message.latitude,
                longitude: item.message.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0922,
              }}>
              <MapView.Marker
                coordinate={{
                  latitude: item.message.latitude,
                  longitude: item.message.longitude,
                }}
                title={User.name}>
                <View style={{alignItems: 'center'}}>
                  <Thumbnail
                    style={{
                      width: 30,
                      height: 30,
                      borderWidth: 1,
                      borderColor: '#fff',
                    }}
                    source={this.state.imageSource}
                  />
                  <Icon
                    name="pin"
                    style={{
                      zIndex: -1,
                      color: '#3cb4dc',
                      fontSize: 50,
                      marginTop: -33,
                    }}
                  />
                </View>
              </MapView.Marker>
            </MapView>
            <Text
              note
              style={{
                alignSelf: 'flex-end',
                fontSize: 12,
                color: '#fff',
              }}>
              {this.convertTime(item.time)}
            </Text>
          </View>
        );
      } else if (item.from !== User.phone) {
        return (
          <View
            style={{
              flex: 1,
              paddingHorizontal: 10,
              paddingVertical: 8,
              backgroundColor: '#f3f3f3',
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              borderBottomRightRadius: 15,
              alignSelf: 'flex-start',
              width: '70%',
              marginBottom: 5,
            }}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('Map', {
                  location: item.message,
                  image: this.state.image,
                  name: this.props.navigation.getParam('name'),
                })
              }>
              <MapView
                liteMode
                style={{height: 150}}
                region={{
                  latitude: item.message.latitude,
                  longitude: item.message.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0922,
                }}>
                <MapView.Marker
                  coordinate={{
                    latitude: item.message.latitude,
                    longitude: item.message.longitude,
                  }}
                  title={this.props.navigation.getParam('name')}>
                  {this.state.image ? (
                    <View style={{alignItems: 'center'}}>
                      <Thumbnail
                        style={{
                          width: 30,
                          height: 30,
                          borderWidth: 1,
                          borderColor: '#fff',
                        }}
                        source={{
                          uri: this.state.image,
                        }}
                      />
                      <Icon
                        name="pin"
                        style={{
                          zIndex: -1,
                          color: '#3cb4dc',
                          fontSize: 50,
                          marginTop: -33,
                        }}
                      />
                    </View>
                  ) : (
                    <View style={{alignItems: 'center'}}>
                      <Thumbnail
                        style={{
                          width: 30,
                          height: 30,
                          borderWidth: 1,
                          borderColor: '#fff',
                        }}
                        source={{
                          uri:
                            'https://cdn.iconscout.com/icon/free/png-256/account-profile-avatar-man-circle-round-user-30452.png',
                        }}
                      />
                      <Icon
                        name="pin"
                        style={{
                          zIndex: -1,
                          color: '#3cb4dc',
                          fontSize: 50,
                          marginTop: -33,
                        }}
                      />
                    </View>
                  )}
                </MapView.Marker>
              </MapView>
              <Text
                note
                style={{alignSelf: 'flex-end', fontSize: 12, marginTop: 5}}>
                {this.convertTime(item.time)}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
    }
  };
  goToFriend = () => {
    this.props.navigation.navigate('Friend', {
      phone: this.props.navigation.getParam('phone'),
    });
  };
  makeCall = () => {
    Linking.openURL(`tel:${this.props.navigation.getParam('phone')}`);
  };
  render() {
    return (
      <Container>
        <Header noShadow style={style.header}>
          <Left>
            <Button
              transparent
              onPress={() =>
                this.props.navigation.navigate('Apps', {loadAgain: true})
              }>
              <Icon style={{color: '#fff'}} name="arrow-back" />
            </Button>
          </Left>
          {this.state.image ? (
            <TouchableOpacity onPress={this.goToFriend}>
              <Thumbnail
                source={{
                  uri: this.state.image,
                }}
                style={{
                  height: 45,
                  width: 45,
                  marginTop: 7,
                  marginRight: 12,
                }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={this.goToFriend}>
              <Thumbnail
                style={{
                  height: 45,
                  width: 45,
                  marginTop: 7,
                  marginRight: 12,
                }}
                source={{
                  uri:
                    'https://cdn.iconscout.com/icon/free/png-256/account-profile-avatar-man-circle-round-user-30452.png',
                }}
              />
            </TouchableOpacity>
          )}
          <Body>
            <TouchableOpacity onPress={this.goToFriend}>
              <Title style={{color: '#fff', fontWeight: 'bold'}}>
                {this.props.navigation.getParam('name')}
              </Title>
            </TouchableOpacity>
          </Body>
          <Right>
            <TouchableOpacity onPress={this.makeCall}>
              <Icon style={{color: '#fff', marginRight: 10}} name="call" />
            </TouchableOpacity>
          </Right>
        </Header>
        <StatusBar barStyle="light-content" backgroundColor="#145970" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={ref => (this.ScrollView = ref)}
          onContentSizeChange={() =>
            this.ScrollView.scrollToEnd({animated: true})
          }
          onLayout={() => this.ScrollView.scrollToEnd({animated: true})}>
          <FlatList
            style={{padding: 10}}
            data={this.state.messageList}
            renderItem={this.renderRow}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 8,
          }}>
          <TouchableOpacity
            onPress={this.shareLocation}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 30,
              width: 30,
              marginRight: 10,
            }}>
            <Icon name="compass" style={{color: '#176781', marginLeft: 4}} />
          </TouchableOpacity>
          <Input
            multiline
            style={{
              padding: 10,
              paddingLeft: 20,
              paddingRight: 20,
              width: '85%',
              borderRadius: 25,
              backgroundColor: '#f3f3f3',
            }}
            value={this.state.textMessage}
            placeholder="Message"
            onChangeText={this.handleChangeText('textMessage')}
          />
          <TouchableOpacity
            onPress={this.sendMessage}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 30,
              width: 30,
              marginLeft: 10,
            }}>
            <Icon name="send" style={{color: '#176781'}} />
          </TouchableOpacity>
        </View>
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
  incomingChat: {
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  sendingChat: {
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  incomingText: {
    backgroundColor: '#f3f3f3',
    maxWidth: '80%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  sendingText: {
    backgroundColor: '#3cb4dc',
    maxWidth: '80%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  textSending: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ChatScreen;
