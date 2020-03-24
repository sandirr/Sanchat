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
} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/database';
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

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
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

  render() {
    return (
      <Container style={style.container}>
        <Header noShadow style={style.header}>
          <Body>
            <Title style={style.title}>Sanchat</Title>
          </Body>
          <Right>
            <TouchableOpacity onPress={this.goToSettings}>
              <Image
                source={{
                  uri:
                    'https://pbs.twimg.com/profile_images/749193618947121153/xg7SqpRO.jpg',
                }}
                style={style.photo}
              />
            </TouchableOpacity>
          </Right>
        </Header>
        <StatusBar barStyle="dark-content" backgroundColor="#f3f3f3" />
        <Content>
          <List>
            <ListItem avatar onPress={this.goToChat}>
              <Left>
                <Thumbnail
                  source={{
                    uri:
                      'https://pbs.twimg.com/profile_images/749193618947121153/xg7SqpRO.jpg',
                  }}
                  style={style.friendPhoto}
                />
              </Left>
              <Body style={style.bodyList}>
                <Text>Kumar Pratik</Text>
                <Text note>Doing what you like</Text>
              </Body>
            </ListItem>
            <ListItem avatar onPress={this.goToChat}>
              <Left>
                <Thumbnail
                  source={{
                    uri:
                      'https://pbs.twimg.com/profile_images/749193618947121153/xg7SqpRO.jpg',
                  }}
                  style={style.friendPhoto}
                />
              </Left>
              <Body style={style.bodyList}>
                <Text>Kumar Pratik</Text>
                <Text note>Doing what you like</Text>
              </Body>
            </ListItem>
          </List>
        </Content>
        <Footer>
          <FooterTab style={style.footer}>
            <Button badge vertical style={{backgroundColor:'#c5dce4'}}>
              <Badge>
                <Text>5</Text>
              </Badge>
              <Icon name="chatbubbles" style={style.footerIcon} />
              <Text style={style.footerIcon}>Chat</Text>
            </Button>
            <Button vertical>
              <Icon name="people" style={style.footerIcon} />
              <Text style={style.footerIcon}>Contact</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const style = StyleSheet.create({
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
