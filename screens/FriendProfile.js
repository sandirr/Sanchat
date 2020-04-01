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
import {db} from './Config';

class FriendProfile extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      imageSource: '',
      name: '',
      phone: '',
      email: '',
    };
  }

  componentDidMount() {
    const phone = this.props.navigation.getParam('phone');
    firebase
      .database()
      .ref('users')
      .orderByChild('phone')
      .equalTo(`${phone}`)
      .on('child_added', data => {
        if (!data.val().image) {
          this.setState({
            imageSource: {
              uri:
                'https://cdn.iconscout.com/icon/free/png-256/account-profile-avatar-man-circle-round-user-30452.png',
            },
          });
        } else if (data.val().image) {
          this.setState({
            imageSource: {
              uri: data.val().image,
            },
          });
        }
        this.setState({
          phone: data.val().phone,
          name: data.val().name,
          email: data.val().email,
        });
      });
  }

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
            <Title style={{color: '#fff', fontWeight: 'bold'}}>
              Friend Profile
            </Title>
          </Body>
          <Right></Right>
        </Header>
        <StatusBar barStyle="light-content" backgroundColor="#145970" />

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

        <ListItem icon style={{marginTop: 30}}>
          <Left>
            <Button style={{backgroundColor: '#FF9501'}}>
              <Icon active name="person" />
            </Button>
          </Left>
          <Body>
            <Text>{this.state.name}</Text>
          </Body>
        </ListItem>

        <ListItem icon style={{marginTop: 20}}>
          <Left>
            <Button style={{backgroundColor: '#007AFF'}}>
              <Icon active name="call" />
            </Button>
          </Left>
          <Body>
            <Text>{this.state.phone}</Text>
          </Body>
        </ListItem>
        <ListItem icon style={{marginTop: 20}}>
          <Left>
            <Button style={{backgroundColor: '#007AFF'}}>
              <Icon active name="mail" />
            </Button>
          </Left>
          <Body>
            <Text>{this.state.email}</Text>
          </Body>
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
export default FriendProfile;
