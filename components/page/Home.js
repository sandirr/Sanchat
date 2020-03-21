import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/database';

class HomeScreen extends Component {
  state = {
    name: '',
    items: [],
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
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View
          style={{
            marginLeft: 10,
            marginTop: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <TextInput
            style={{height: 80}}
            placeholder="Add Items"
            onChangeText={text => this.setState({name: text})}
            value={this.state.name}
          />
          <TouchableOpacity
            style={{
              backgroundColor: 'blue',
              width: 330,
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={this.handleSubmit.bind(this)}>
            <Text style={{color: 'white'}}>Submit</Text>
          </TouchableOpacity>
        </View>
        <FlatList data={this.state.items} renderItem={this.renderRow} />
        <View
          style={{
            marginLeft: 10,
            marginTop: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              width: 330,
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={this.handleLogout}>
            <Text style={{color: 'white'}}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: 'green',
              width: 330,
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}
            onPress={e => this.props.navigation.navigate('Map')}>
            <Text style={{color: 'white'}}>View Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default HomeScreen;
