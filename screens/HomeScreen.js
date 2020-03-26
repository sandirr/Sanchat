import React, {Component} from 'react';
import {
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  AsyncStorage,
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
} from 'native-base';
import User from './navigations/User';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      users: [],
      imageSource: User.image,
    };
  }

  componentDidMount() {
    let dbRef = db.ref('users');
    dbRef.on('child_added', val => {
      let person = val.val();
      person.phone = val.key;
      if (person.phone === User.phone) {
        User.name = person.name;
        User.image = person.image ? person.image : null;
      } else if (person.phone !== User.phone) {
        db.ref('messages')
          .child(User.phone)
          .child(person.phone)
          .on('child_added', value => {
            person.last_message = value.val().message;
          });
        db.ref('messages')
          .child(User.phone)
          .child(person.phone)
          .on('child_added', value => {
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
  }

  static navigationOptions = {
    header: null,
  };
  goToProfile = () => {
    this.props.navigation.navigate('Profile');
  };
  goToChat = () => {
    this.props.navigation.navigate('Chat');
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
          <Text note>{item.last_message}</Text>
        </Body>
      </ListItem>
    );
  };

  render() {
    return (
      <Container style={styles.container}>
        <Header noShadow style={styles.header}>
          <Body>
            <Title style={styles.title}>Sanchat</Title>
          </Body>
          <Right>
            <TouchableOpacity onPress={this.goToProfile}>
              <Text style={{fontWeight:'bold', fontSize:30, marginBottom:20}}>...</Text>
            </TouchableOpacity>
          </Right>
        </Header>
        <StatusBar barStyle="dark-content" backgroundColor="#e5e5e5" />
        <Content>
          <List>
            <FlatList
              data={this.state.users}
              renderItem={this.renderRow}
              keyExtractor={item => item.time}
            />
          </List>
        </Content>
        <Fab
          style={[styles.footer]}
          onPress={() => this.props.navigation.navigate('Contact')}>
          <Icon style={styles.footerIcon} name="people" />
        </Fab>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  footer: {
    backgroundColor: '#f3f3f3',
  },
  title: {
    fontWeight: 'bold',
    marginLeft: 5,
    color: '#000',
  },
  photo: {
    height: 40,
    width: 40,
    borderRadius: 50,
    marginRight: 5,
  },
  header: {
    backgroundColor: '#f3f3f3',
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
    color: '#176781',
  },
});

export default HomeScreen;