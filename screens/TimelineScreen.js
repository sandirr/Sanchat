import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';
import {
  Text,
  Container,
  Thumbnail,
  Card,
  Left,
  Right,
  Body,
  CardItem,
  Button,
  Icon,
  Image,
  Content,
  List,
} from 'native-base';
import User from './navigations/User';
import firebase from 'firebase';

class Timeline extends React.Component {
  state = {
    timelines: [],
  };
  componentDidMount() {
    this.setState({timelines: []});
    firebase
      .database()
      .ref('status')
      .on('child_added', value => {
        const time = new Date(value.val().time + 1000 * 60 * 60 * 24);
        const n = new Date();

        if (time >= n) {
          this.setState(prevState => {
            return {
              timelines: [...prevState.timelines, value.val()],
            };
          });
        }
      });
  }
  renderTime = statusTime => {
    const d = new Date(statusTime);
    const n = new Date();
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + '.';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    if (n.getDate() !== d.getDate()) {
      result = 'Yesterday, ' + result;
    } else if (n.getDate() === d.getDate()) {
      result = 'Today, ' + result;
    }
    return result;
  };
  renderStatus = ({item}) => {
    return (
      <Card style={{borderRadius: 10}}>
        <CardItem style={{borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
          <Left>
            <Thumbnail
              source={{
                uri: item.image
                  ? item.image
                  : 'https://cdn.iconscout.com/icon/free/png-256/account-profile-avatar-man-circle-round-user-30452.png',
              }}
              style={{width: 40, height: 40}}
            />
            <Body>
              <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
            </Body>
          </Left>
          <Right>
            <Text style={{color: 'black'}}>{this.renderTime(item.time)}</Text>
          </Right>
        </CardItem>
        <CardItem
          cardBody
          style={{borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
          <View
            style={{
              backgroundColor: item.color,
              width: null,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 20,
              paddingHorizontal: 15,
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#fff',
                fontSize: item.status.length < 16 ? 32 : 24,
                textAlign: 'center',
              }}>
              {item.status}
            </Text>
          </View>
        </CardItem>
      </Card>
    );
  };
  render() {
    return (
      <ScrollView style={styles.container}>
        <FlatList
          data={this.state.timelines
            .sort((a, b) => (a.time > b.time ? 1 : -1))
            .reverse()}
          renderItem={this.renderStatus}
          keyExtractor={item => item.phone}
        />
        <View style={{height: 150}}></View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '3.5%',
    marginTop: 10,
    paddingBottom: 200,
  },
});

export default Timeline;
