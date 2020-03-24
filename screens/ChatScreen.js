import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  ImageBackground,
  ScrollView,
  StyleSheet,
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
  Content,
} from 'native-base';
import firebase from '@react-native-firebase/app';
import User from './navigations/User';

class ChatScreen extends Component {
  static navigationOptions = {
    header: null,
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
    };
  }
  componentWillMount() {
    firebase
      .database()
      .ref('messages')
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
  sendMessage = async () => {
    if (this.state.textMessage.length > 0) {
      let msgId = firebase
        .database()
        .ref('messages')
        .child(`${User.phone}`)
        .child(this.state.person.phone)
        .push().key;
      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: User.phone,
      };
      updates[
        'messages/' +
          `${User.phone}` +
          '/' +
          this.state.person.phone +
          '/' +
          msgId
      ] = message;
      updates[
        'messages/' +
          this.state.person.phone +
          '/' +
          `${User.phone}` +
          '/' +
          msgId
      ] = message;
      firebase
        .database()
        .ref()
        .update(updates);
      this.setState({textMessage: ''});
    }
  };
  renderRow = ({item}) => {
    if (item.from === User.phone) {
      return (
        <View style={style.sendingChat}>
          <View style={style.sendingText}>
            <Text>{item.message}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={style.incomingChat}>
          <View style={style.incomingText}>
            <Text>{item.message}</Text>
          </View>
        </View>
      );
    }
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor:'#fff'}}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{this.props.navigation.getParam('name', null)}</Title>
          </Body>
          <Right></Right>
        </Header>
        <Content>
          <TextInput
            onChangeText={this.handleChangeText('textMessage')}
            value={this.state.textMessage}
          />
          <TouchableOpacity onPress={this.sendMessage}>
            <Text>Send</Text>
          </TouchableOpacity>
          {/* <ImageBackground
            resizeMode="cover"
            source={require('../images/bgchat.png')}
            style={style.bgChat}> */}
          <ScrollView style={style.chatContain}>
            <FlatList
              data={this.state.messageList}
              renderItem={this.renderRow}
              keyExtractor={(item, index) => index.toString()}
            />
          </ScrollView>
          {/* </ImageBackground> */}
        </Content>
      </View>
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
  bgChat: {flex: 1, flexDirection: 'column', minHeight: 512, maxHeight: 512},
  chatContain: {
    paddingHorizontal: '3.5%',
    paddingVertical: 12,
  },
  incomingChat: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sendingChat: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  incomingText: {
    backgroundColor: '#f3f3f3',
    maxWidth: '80%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  sendingText: {
    backgroundColor: '#8bcbe4',
    maxWidth: '80%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
});

export default ChatScreen;
