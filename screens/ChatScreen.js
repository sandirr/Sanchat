import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
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
} from 'native-base';
import Firebase from 'firebase';
import User from './navigations/User';
import {TextInput} from 'react-native-gesture-handler';
import {db} from './Config';

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
      dbRef: Firebase.database().ref('messages'),
    };
  }

  componentDidMount() {
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
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    var weekday = new Array(7);
    weekday[0] = 'Sunday';
    weekday[1] = 'Monday';
    weekday[2] = 'Tuesday';
    weekday[3] = 'Wednesday';
    weekday[4] = 'Thursday';
    weekday[5] = 'Friday';
    weekday[6] = 'Saturday';
    var month = [
      'January',
      'February',
      'March',
      'April',
      'Mei',
      'Juny',
      'July',
      'August',
      'September',
      'October',
      'November',
      'Desember',
    ];
    if (c.getDay() !== d.getDay()) {
      result = weekday[d.getDay()] + ', ' + result;
    } else if (c.getMonth() !== d.getMonth()) {
      result = month[d.getMonth()] + ', ' + weekday[d.getDay()] + ', ' + result;
    }
    return result;
  };
  sendMessage = async () => {
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
  renderRow = ({item}) => {
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
  };
  render() {
    return (
      <Container>
        <Header noShadow style={style.header}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon style={{color: '#000'}} name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title style={{color: '#000', fontWeight: 'bold'}}>
              {this.props.navigation.getParam('name', null)}
            </Title>
            <Subtitle style={{color: '#000', fontWeight: '700'}}>
              {this.props.navigation.getParam('phone')}
            </Subtitle>
          </Body>
          <Right></Right>
        </Header>
        <StatusBar barStyle="dark-content" backgroundColor="#e5e5e5" />
        <FlatList
          ref={ref => (this.flatList = ref)}
          onContentSizeChange={() =>
            this.flatList.scrollToEnd({animated: true})
          }
          onLayout={() => this.flatList.scrollToEnd({animated: true})}
          style={{padding: 10}}
          data={this.state.messageList}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 8,
          }}>
          <TextInput
            style={{
              padding: 10,
              width: '85%',
              borderRadius: 25,
              backgroundColor: '#f3f3f3',
              marginLeft: 10,
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
            <Icon name="send" style={{color: '#176781', marginLeft: 4}} />
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
    backgroundColor: '#f3f3f3',
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
