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
import '@react-native-firebase/auth';
import '@react-native-firebase/database';

class Chat extends Component {
  state = {
    name: '',
    items: [],
  };

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.handleGetData();
  }

  handleGetData() {
    // Action Get
    firebase
      .database()
      .ref('/items')
      .on('value', snapshot => {
        const data = snapshot.val();
        const items = Object.values(data);
        this.setState({items});
      });
  }

  handleSubmit() {
    // Action Submit
    firebase
      .database()
      .ref('items/')
      .push({
        name: this.state.name,
      });

    this.setState({
      name: '',
    });

    Keyboard.dismiss();
  }

  handleLogout = () => {
    // Action Logout
    firebase
      .auth()
      .signOut()
      .then(res => console.warn('oke'));
  };

  renderRow = ({item}) => {
    return (
      <View style={{margin: 10, flexDirection: 'row'}}>
        <Text style={{padding: 10}}>Name : {item.name}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Andi Irsandi</Title>
          </Body>
        </Header>
        <Content>
          <ImageBackground
            resizeMode="cover"
            source={require('../../../images/bgchat.png')}
            style={style.bgChat}>
            <ScrollView style={style.chatContain}>
              <View style={style.incomingChat}>
                <View style={style.incomingText}>
                  <Text>Deprecated Gradle features</Text>
                </View>
              </View>

              <View style={style.sendingChat}>
                <View style={style.sendingText}>
                  <Text>Deprecated Gradle features were</Text>
                </View>
              </View>

              <View style={style.incomingChat}>
                <View style={style.incomingText}>
                  <Text>Deprecated Gradle features</Text>
                </View>
              </View>
              <View style={style.sendingChat}>
                <View style={style.sendingText}>
                  <Text>sandi</Text>
                </View>
              </View>
              <View style={style.incomingChat}>
                <View style={style.incomingText}>
                  <Text>Deprecated Gradle features</Text>
                </View>
              </View>

              <View style={style.sendingChat}>
                <View style={style.sendingText}>
                  <Text>Deprecated Gradle features were</Text>
                </View>
              </View>

              <View style={style.incomingChat}>
                <View style={style.incomingText}>
                  <Text>Deprecated Gradle features</Text>
                </View>
              </View>
              <View style={style.sendingChat}>
                <View style={style.sendingText}>
                  <Text>sandi</Text>
                </View>
              </View>
              <View style={style.incomingChat}>
                <View style={style.incomingText}>
                  <Text>Deprecated Gradle features</Text>
                </View>
              </View>

              <View style={style.sendingChat}>
                <View style={style.sendingText}>
                  <Text>Deprecated Gradle features were</Text>
                </View>
              </View>

              <View style={style.incomingChat}>
                <View style={style.incomingText}>
                  <Text>Deprecated Gradle features</Text>
                </View>
              </View>
              <View style={style.sendingChat}>
                <View style={style.sendingText}>
                  <Text>sandi</Text>
                </View>
              </View>
              <View style={style.incomingChat}>
                <View style={style.incomingText}>
                  <Text>Deprecated Gradle features</Text>
                </View>
              </View>

              <View style={style.sendingChat}>
                <View style={style.sendingText}>
                  <Text>Deprecated Gradle features were</Text>
                </View>
              </View>

              <View style={style.incomingChat}>
                <View style={style.incomingText}>
                  <Text>Deprecated Gradle features</Text>
                </View>
              </View>
              <View style={style.sendingChat}>
                <View style={style.sendingText}>
                  <Text>sandi</Text>
                </View>
              </View>
            </ScrollView>
          </ImageBackground>
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

export default Chat;
