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
import firebase from '@react-native-firebase/app';
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
} from 'native-base';
import User from './navigations/User';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      users: [],
    };
  }

  componentWillMount() {
    let dbRef = firebase.database().ref('users');
    dbRef.on('child_added', val => {
      let person = val.val();
      person.phone = val.key;
      if (person.phone === User.phone) {
        User.name = person.name;
      } else {
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
  goToSettings = () => {
    this.props.navigation.navigate('Settings');
  };
  goToChat = () => {
    this.props.navigation.navigate('Chat');
  };

  _logOut = async () => {
    await AsyncStorage.clear();
    this.setState({users: []});
    this.props.navigation.navigate('Auth');
  };

  renderRow = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Chat', item)}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
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
            <TouchableOpacity onPress={this.goToSettings}>
              <Image
                source={{
                  uri:
                    'https://pbs.twimg.com/profile_images/749193618947121153/xg7SqpRO.jpg',
                }}
                style={styles.photo}
              />
            </TouchableOpacity>
          </Right>
        </Header>
        <StatusBar barStyle="dark-content" backgroundColor="#f3f3f3" />
        <Content>
          <TouchableOpacity onPress={this._logOut}>
            <Text>Logout</Text>
          </TouchableOpacity>
          <FlatList
            data={this.state.users}
            renderItem={this.renderRow}
            keyExtractor={item => item.phone}
          />
        </Content>
        <Footer>
          <FooterTab style={styles.footer}>
            <Button badge vertical style={{backgroundColor: '#c5dce4'}}>
              <Badge>
                <Text>5</Text>
              </Badge>
              <Icon name="chatbubbles" style={styles.footerIcon} />
              <Text style={styles.footerIcon}>Chat</Text>
            </Button>
            <Button vertical>
              <Icon name="people" style={styles.footerIcon} />
              <Text style={styles.footerIcon}>Contact</Text>
            </Button>
          </FooterTab>
        </Footer>
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
    marginTop: 6,
  },
  friendPhoto: {
    height: 50,
    width: 50,
  },
  footerIcon: {
    color: '#145970',
  },
});

export default HomeScreen;
