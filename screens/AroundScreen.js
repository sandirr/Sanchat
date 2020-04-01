import React, {Component} from 'react';
import {Text, View, Button, Image, Thumbnail, Icon} from 'native-base';
import MapView from 'react-native-maps';
import {Dimensions, StatusBar} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import User from './navigations/User';
import {FlatList} from 'react-native-gesture-handler';

class Around extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSource: User.image
        ? {uri: User.image}
        : {
            uri:
              'https://cdn.iconscout.com/icon/free/png-256/account-profile-avatar-man-circle-round-user-30452.png',
          },
    };
  }
  render() {
    // console.log(this.props.users);
    const {width} = Dimensions.get('window');
    return (
      <MapView
        style={{flex: 1, width: width}}
        region={{
          latitude: User.latitude,
          longitude: User.longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}>
        <MapView.Marker
          title={User.name}
          coordinate={{
            latitude: User.latitude,
            longitude: User.longitude,
          }}>
          <View style={{alignItems: 'center'}}>
            <Thumbnail
              style={{
                width: 30,
                height: 30,
                borderWidth: 1,
                borderColor: '#fff',
              }}
              source={this.state.imageSource}
            />
            <Icon
              name="pin"
              style={{
                zIndex: -1,
                color: '#3cb4dc',
                fontSize: 50,
                marginTop: -33,
              }}
            />
          </View>
        </MapView.Marker>
        {this.props.users.map(item => (
          <MapView.Marker
            key={item.phone}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            title={item.name}>
            {item.image ? (
              <View style={{alignItems: 'center'}}>
                <Thumbnail
                  style={{
                    width: 30,
                    height: 30,
                    borderWidth: 1,
                    borderColor: '#fff',
                  }}
                  source={{
                    uri: item.image,
                  }}
                />
                <Icon
                  name="pin"
                  style={{
                    zIndex: -1,
                    color: '#3cb4dc',
                    fontSize: 50,
                    marginTop: -33,
                  }}
                />
              </View>
            ) : (
              <View style={{alignItems: 'center'}}>
                <Thumbnail
                  style={{
                    width: 30,
                    height: 30,
                    borderWidth: 1,
                    borderColor: '#fff',
                  }}
                  source={{
                    uri:
                      'https://cdn.iconscout.com/icon/free/png-256/account-profile-avatar-man-circle-round-user-30452.png',
                  }}
                />
                <Icon
                  name="pin"
                  style={{
                    zIndex: -1,
                    color: '#3cb4dc',
                    fontSize: 50,
                    marginTop: -33,
                  }}
                />
              </View>
            )}
          </MapView.Marker>
        ))}
      </MapView>
    );
  }
}

export default Around;
