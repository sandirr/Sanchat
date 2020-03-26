import React, {Component} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Keyboard,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  AsyncStorage,
} from 'react-native';
import {
  Container,
  Header,
  Icon,
  Text,
  Body,
  Title,
  Right,
  Button,
  Left,
  Content,
  List,
  ListItem,
  Thumbnail,
  Footer,
  FooterTab,
  Badge,
  Input,
  Item,
} from 'native-base';
import User from './navigations/User';
import {db} from './Config';

class ContactScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      users: [],
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
        this.setState(prevState => {
          return {
            users: [...prevState.users, person],
          };
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
        </Body>
      </ListItem>
    );
  };

  render() {
    return (
      <Container style={styles.container}>
        <Header searchBar rounded style={styles.header}>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </TouchableOpacity>
          </Left>
          <Item rounded style={{marginLeft: -75, marginRight: 5}}>
            <Icon name="ios-search" />
            <Input placeholder="Search" />
            <Icon name="ios-people" />
          </Item>
        </Header>
        <StatusBar barStyle="dark-content" backgroundColor="#e5e5e5" />
        <Content>
          <List>
            <FlatList
              data={this.state.users}
              renderItem={this.renderRow}
              keyExtractor={item => item.phone}
            />
          </List>
        </Content>
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
    borderBottomWidth: 0,
    paddingBottom: 7,
  },
  friendPhoto: {
    height: 35,
    width: 35,
    marginTop: -7,
    marginLeft: -5,
  },
  footerIcon: {
    color: '#176781',
  },
});

export default ContactScreen;
