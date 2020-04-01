import React from 'react';
import {StyleSheet, View, StatusBar, TouchableOpacity} from 'react-native';
import {Left, Body, Icon, Header, Input, Button} from 'native-base';
import firebase from 'firebase';
import User from './navigations/User';

class CreateStatus extends React.Component {
  state = {
    colorsPlate: [
      '#E97439',
      '#6F1BC6',
      '#E64A39',
      '#EDD157',
      '#65ED99',
      '#5F8BE9',
    ],
    chooseColor: 0,
    status: '',
    disabledSend: true,
  };
  static navigationOptions = {
    headerShown: false,
  };
  changeColor = () => {
    if (this.state.chooseColor === this.state.colorsPlate.length - 1) {
      this.setState({
        chooseColor: 0,
      });
    } else {
      this.setState({
        chooseColor: this.state.chooseColor + 1,
      });
    }
  };
  createStatus = () => {
    const Data = {
      color: this.state.colorsPlate[this.state.chooseColor],
      status: this.state.status,
      phone: User.phone,
      name: User.name,
      time: firebase.database.ServerValue.TIMESTAMP,
    };
    if (User.image) {
      Data.image = User.image;
    }
    firebase
      .database()
      .ref('status')
      .push(Data).key;

    this.setState({
      status: '',
      disabledSend: true,
    });
    this.props.navigation.goBack();
  };
  handleChangeText = text => {
    this.setState({status: text});
    if (text.length > 0) {
      this.setState({
        disabledSend: false,
      });
    } else if (text.length < 1) {
      this.setState({disabledSend: true});
    }
  };
  render() {
    return (
      <>
        <Header
          style={{
            backgroundColor: this.state.colorsPlate[this.state.chooseColor],
          }}>
          <Left style={{marginLeft: 10}}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" style={{color: '#fff'}} />
            </TouchableOpacity>
          </Left>
          <Body></Body>
        </Header>
        <StatusBar
          barStyle="light-content"
          backgroundColor={this.state.colorsPlate[this.state.chooseColor]}
        />
        <View style={styles.container}>
          <View
            style={{
              paddingHorizontal: 50,
              backgroundColor: this.state.colorsPlate[this.state.chooseColor],
            }}>
            <Button
              transparent
              style={{position: 'absolute', left: 60, bottom: 20, zIndex: 2}}
              onPress={this.changeColor}>
              <Icon
                name="color-palette"
                style={{fontSize: 35, color: '#fff'}}
              />
            </Button>
            {this.state.disabledSend ? (
              <></>
            ) : (
              <Button
                rounded
                style={{
                  position: 'absolute',
                  right: 60,
                  bottom: 20,
                  zIndex: 2,
                  height: 60,
                  width: 60,
                  textAlign: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#176781',
                }}
                onPress={this.createStatus}>
                <Icon name="send" style={{color: '#fff'}} />
              </Button>
            )}

            <Input
              autoFocus
              multiline
              style={styles.input}
              placeholder="Share your moment !"
              onChangeText={this.handleChangeText}
            />
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    width: 400,
  },
});

export default CreateStatus;
