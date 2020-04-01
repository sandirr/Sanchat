import React from 'react';
import {Text, View, Button, Image, Thumbnail, Icon} from 'native-base';
import MapView from 'react-native-maps';
import {Dimensions, StatusBar} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import User from './navigations/User';

class MapScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };
  state = {
    latitude: 0,
    longitude: 0,
    image: '',
    title: '',
    _latitude: 0,
    _longitude: 0,
    viewLatitude: 0,
    viewLongitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
    imageSource: User.image
      ? {uri: User.image}
      : {
          uri:
            'https://cdn.iconscout.com/icon/free/png-256/account-profile-avatar-man-circle-round-user-30452.png',
        },
  };
  componentDidMount() {
    const destination = this.props.navigation.getParam('location');
    this.setState({
      latitude: destination.latitude,
      longitude: destination.longitude,
      image: this.props.navigation.getParam('image'),
      title: this.props.navigation.getParam('name'),
    });
    Geolocation.getCurrentPosition(info => {
      const {longitude, latitude} = info.coords;
      this.setState({_latitude: latitude, _longitude: longitude});

      if (destination.latitude < latitude) {
        var latitudeDelta = latitude - destination.latitude;
        if (latitudeDelta < 0) {
          latitudeDelta = latitudeDelta * -1;
        }
        this.setState({
          viewLatitude:
            destination.latitude + (latitude - destination.latitude) / 2,
          latitudeDelta: latitudeDelta + 0.02,
        });
      } else {
        var latitudeDelta = destination.latitude - latitude;
        if (latitudeDelta < 0) {
          latitudeDelta = latitudeDelta * -1;
        }
        this.setState({
          viewLatitude: latitude + (destination.latitude - latitude) / 2,
          latitudeDelta: latitudeDelta + 0.02,
        });
      }
      if (destination.longitude < longitude) {
        var longitudeDelta = longitude - destination.longitude;
        if (longitudeDelta < 0) {
          longitudeDelta = longitudeDelta * -1;
        }
        this.setState({
          viewLongitude:
            destination.longitude + (longitude - destination.longitude) / 2,
          longitudeDelta: longitudeDelta + 0.02,
        });
      } else {
        var longitudeDelta = destination.longitude - longitude;
        if (longitudeDelta < 0) {
          longitudeDelta = longitudeDelta * -1;
        }
        this.setState({
          viewLongitude: longitude + (destination.longitude - longitude) / 2,
          longitudeDelta: longitudeDelta + 0.02,
        });
      }
    });
  }
  render() {
    const {height} = Dimensions.get('window');
    return (
      <View>
        <Button
          onPress={() => this.props.navigation.goBack()}
          rounded
          style={{
            position: 'absolute',
            zIndex: 999,
            right: 10,
            top: 15,
            backgroundColor: '#176781',
          }}>
          <Icon name="arrow-back" />
        </Button>
        <Button
          onPress={() => this.componentDidMount()}
          rounded
          style={{
            position: 'absolute',
            zIndex: 999,
            right: 10,
            bottom: 50,
            backgroundColor: '#fff',
          }}>
          <Icon name="locate" style={{color: '#176781'}} />
        </Button>
        <StatusBar barStyle="light-content" backgroundColor="#145970" />
        <MapView
          style={{height: height}}
          region={{
            latitude: this.state.viewLatitude,
            longitude: this.state.viewLongitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta,
          }}>
          <MapView.Marker
            coordinate={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
            }}
            title={this.state.title}>
            {this.state.image ? (
              <View style={{alignItems: 'center'}}>
                <Thumbnail
                  style={{
                    width: 30,
                    height: 30,
                    borderWidth: 1,
                    borderColor: '#fff',
                  }}
                  source={{
                    uri: this.state.image,
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
          <MapView.Marker
            title={User.name}
            coordinate={{
              latitude: this.state._latitude,
              longitude: this.state._longitude,
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
        </MapView>
      </View>
    );
  }
}

export default MapScreen;
