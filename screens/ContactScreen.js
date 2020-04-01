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
  Tab,
  Tabs,
  TabHeading,
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
    dbRef.orderByChild('name').on('child_added', val => {
      let person = val.val();
      person.phone = val.key;
      if (person.phone === User.phone) {
        User.name = person.name;
        User.image = person.image ? person.image : null;
        User.password = person.password;
        User.email = person.email;
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
    headerShown: false,
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
          <Text note>{item.phone}</Text>
        </Body>
      </ListItem>
    );
  };

  render() {
    return (
      <Container style={styles.container}>
        <Header searchBar rounded style={styles.header}>
          <Left>
            <TouchableOpacity
              style={{marginLeft: 10}}
              onPress={() => this.props.navigation.goBack()}>
              <Icon style={{color: '#fff'}} name="arrow-back" />
            </TouchableOpacity>
          </Left>
          <Item rounded style={{marginLeft: -85, marginRight: 5}}>
            <Icon name="ios-search" />
            <Input placeholder="Search" />
            <Icon name="ios-people" />
          </Item>
        </Header>
        <StatusBar barStyle="light-content" backgroundColor="#145970" />
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
    backgroundColor: '#176781',
  },
  bodyList: {
    borderBottomWidth: 0,
    paddingBottom: 7,
  },
  friendPhoto: {
    height: 35,
    width: 35,
    marginLeft: -5,
  },
  footerIcon: {
    color: '#176781',
  },
});

export default ContactScreen;
