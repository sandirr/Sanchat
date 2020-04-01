import React, {Component} from 'react';
import {
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  AsyncStorage,
  View,
  Button,
} from 'react-native';
import {db} from './Config';
import {
  Container,
  Header,
  Icon,
  Text,
  Body,
  Title,
  Right,
  Left,
  Content,
  List,
  ListItem,
  Thumbnail,
  Fab,
  Tab,
  Tabs,
  TabHeading,
} from 'native-base';
import User from './navigations/User';
import Timeline from './TimelineScreen';
import Around from './AroundScreen';
import Geolocation from '@react-native-community/geolocation';

class HomeScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      users: [],
      imageSource: User.image,
    };
  }

  componentDidMount() {
    this.setState({users: []});
    this.getFromFirebase();
    if (this.props.navigation.getParam('loadAgain')) {
      this.setState({users: []});
      this.getFromFirebase();
    }
  }
  getFromFirebase = () => {
    let dbRef = db.ref('users');
    dbRef.on('child_added', val => {
      let person = val.val();
      person.phone = val.key;
      if (person.phone === User.phone) {
        User.name = person.name;
        User.image = person.image ? person.image : null;
        User.password = person.password;
        User.email = person.email;
        Geolocation.getCurrentPosition(info => {
          const {latitude, longitude} = info.coords;
          User.latitude = latitude;
          User.longitude = longitude;
          db.ref('users')
            .child(User.phone)
            .set(User)
            .then(res => {
              console.log('position updated');
            });
        });
      } else if (person.phone !== User.phone) {
        db.ref('messages')
          .child(User.phone)
          .child(person.phone)
          .on('child_added', value => {
            person.last_time = value.val().time;
            person.last_message = value.val().message;
          });

        db.ref('messages')
          .child(User.phone)
          .child(person.phone)
          .on('value', value => {
            if (value.val()) {
              if (!this.state.users.includes(person)) {
                this.setState(prevState => {
                  return {
                    users: [...prevState.users, person],
                  };
                });
              }
            }
          });
      }
    });
  };
  goToProfile = () => {
    this.props.navigation.navigate('Profile');
  };
  goToChat = () => {
    this.props.navigation.navigate('Chat');
  };

  getDay = time => {
    var weekday = new Array(7);
    weekday[0] = 'Sunday';
    weekday[1] = 'Monday';
    weekday[2] = 'Tuesday';
    weekday[3] = 'Wednesday';
    weekday[4] = 'Thursday';
    weekday[5] = 'Friday';
    weekday[6] = 'Saturday';
    return <Text note>{weekday[time]}, </Text>;
  };

  renderRow = ({item}) => {
    return (
      <ListItem
        avatar
        onPress={() => this.props.navigation.navigate('Chat', item)}
        style={{marginHorizontal: 10}}>
        <Left>
          <Thumbnail
            source={{
              uri: item.image
                ? item.image
                : 'https://cdn.iconscout.com/icon/free/png-256/account-profile-avatar-man-circle-round-user-30452.png',
            }}
            style={styles.friendPhoto}
          />
        </Left>
        <Body style={styles.bodyList}>
          <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
          {item.last_message.latitude ? (
            <Text note>Position on map</Text>
          ) : (
            <Text note>
              {item.last_message.slice(0, 28)}
              {item.last_message.length > 28 ? '...' : ''}
            </Text>
          )}
        </Body>
        <Right style={styles.bodyList}>
          {new Date(item.last_time).getMonth() !== new Date().getMonth() ? (
            <Text note>
              {new Date(item.last_time).getDate()}/
              {new Date(item.last_time).getMonth()}/
              {new Date(item.last_time).getFullYear()}
            </Text>
          ) : (
            <Text note>
              {new Date(item.last_time).getDay() !== new Date().getDay() ? (
                this.getDay(new Date(item.last_time).getDay())
              ) : (
                <></>
              )}
              {new Date(item.last_time).getHours() < 10 ? '0' : ''}
              {new Date(item.last_time).getHours()}
              {'.'}
              {new Date(item.last_time).getMinutes() < 10 ? '0' : ''}
              {new Date(item.last_time).getMinutes()}
            </Text>
          )}
        </Right>
      </ListItem>
    );
  };

  render() {
    return (
      <Container style={styles.container}>
        <Header hasTabs noShadow style={styles.header}>
          <Body>
            <Title style={styles.title}>Sanchat</Title>
          </Body>
          <Right>
            <TouchableOpacity onPress={this.goToProfile}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 30,
                  marginBottom: 20,
                  color: '#fff',
                }}>
                ...
              </Text>
            </TouchableOpacity>
          </Right>
        </Header>
        <StatusBar barStyle="light-content" backgroundColor="#145970" />
        <Tabs tabContainerStyle={{elevation: 0}}>
          <Tab
            heading={
              <TabHeading style={{backgroundColor: '#176781'}}>
                <Icon name="chatbubbles" style={{fontSize: 18}} />
                <Text style={{fontWeight: 'bold', fontSize: 14}}>CHAT</Text>
              </TabHeading>
            }>
            <Content>
              <List>
                <FlatList
                  data={this.state.users
                    .sort((a, b) => (a.last_time > b.last_time ? 1 : -1))
                    .reverse()}
                  renderItem={this.renderRow}
                  keyExtractor={item => item.phone}
                />
                <View style={{height: 100}}></View>
              </List>
            </Content>
            <Fab
              style={[styles.footer]}
              onPress={() => this.props.navigation.navigate('Contact')}>
              <Icon style={styles.footerIcon} name="people" />
            </Fab>
          </Tab>
          <Tab
            heading={
              <TabHeading style={{backgroundColor: '#176781'}}>
                <Icon name="time" style={{fontSize: 18}} />
                <Text style={{fontWeight: 'bold', fontSize: 14}}>TIMELINE</Text>
              </TabHeading>
            }>
            <Timeline />
            <Fab
              style={{backgroundColor: '#176781'}}
              position="bottomRight"
              onPress={() => this.props.navigation.navigate('Status')}>
              <Icon name="create" />
            </Fab>
          </Tab>
          <Tab
            heading={
              <TabHeading style={{backgroundColor: '#176781'}}>
                <Icon name="map" style={{fontSize: 18}} />
                <Text style={{fontWeight: 'bold', fontSize: 14}}>AROUND</Text>
              </TabHeading>
            }>
            <View style={{flex: 1}}>
              <Around users={this.state.users} />
            </View>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  footer: {
    backgroundColor: '#176781',
  },
  title: {
    fontWeight: 'bold',
    marginLeft: 5,
    color: '#fff',
    fontSize: 24,
  },
  photo: {
    height: 40,
    width: 40,
    borderRadius: 50,
    marginRight: 5,
  },
  header: {
    backgroundColor: '#176781',
    borderBottomColor: 'white',
  },
  bodyList: {
    borderBottomWidth: 0.5,
    paddingBottom: 7,
  },
  friendPhoto: {
    height: 50,
    width: 50,
    marginTop: -7,
    marginLeft: -5,
  },
  footerIcon: {
    color: '#f3f3f3',
  },
});

export default HomeScreen;
