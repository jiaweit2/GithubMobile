import React, { Component } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Animatable from 'react-native-animatable';
import { Col, Row, Grid } from "react-native-easy-grid";
import Base64 from '../components/Base64';
AnimatImg = Animatable.createAnimatableComponent(Image);
AnimatView = Animatable.createAnimatableComponent(View);
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  AsyncStorage,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
const axios = require('axios');

class CountView extends Component {
  render() {
    return (
      <View>
        <Text style={styles.count}>{this.props.count}</Text>
        <Text style={styles.suffix}>{this.props.suffix}</Text>
      </View>
    );
  }
}

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      userName: '',
      urlAvatar: 'https://facebook.github.io/react-native/docs/assets/favicon.png',
      bio: null,
      date: '',
      website: '',
      repo: 0,
      follower: 0,
      following: 0,
      repo_navigation: 'Repo',
      follower_navigation: 'Follower',
      following_navigation: 'Following'
    }
    Dimensions.addEventListener('change', () => {
      this.render();
    });
    if (this.props.navigation != null) {
      this.focusListener = this.props.navigation.addListener('didFocus', (o) => {
        if (o.state && o.state.params) {
          this.setState({
            repo_navigation: '',
            follower_navigation: '',
            following_navigation: ''
          });
          this.getData(o.state.params.userName, null);
        } else {
          this.getData();
        }
      });
    }
  }


  render() {
    return (
      <ScrollView style={styles.container}>
        <AnimatView animation='fadeInDown' style={styles.userInfoStyle}>
          <Image
            source={{ uri: this.state.urlAvatar }}
            style={styles.userIconStyle}
          />
        </AnimatView>
        <AnimatView style={styles.accoutInfoStyle} animation='fadeInUp'>
          <Text style={styles.accountStyle}> {this.state.name} </Text>
          <Text style={styles.website}>{this.state.website}</Text>
          <Grid style={{ width: 350, paddingBottom: 60 }}>
            <Row>
              <Col><Text style={styles.accountStyle2}>{"id: " + this.state.userName}</Text></Col>
              <Col><Text style={styles.accountStyle2}>{this.state.bio}</Text></Col>
            </Row>
            <Row>
              <Col><Text style={styles.accountStyle2}>{"Member since " + this.state.date}</Text></Col>
            </Row>
          </Grid>
          <Grid style={{ width: 350, marginLeft: 10, marginRight: 10 }}>
            <Col><TouchableOpacity onPress={() => { this.props.navigation.navigate(this.state.repo_navigation); }}><CountView count={this.state.repo} suffix="repos" /></TouchableOpacity></Col>
            <Col><TouchableOpacity onPress={() => { this.props.navigation.navigate(this.state.follower_navigation); }}><CountView count={this.state.follower} suffix="followers" /></TouchableOpacity></Col>
            <Col><TouchableOpacity onPress={() => { this.props.navigation.navigate(this.state.following_navigation); }}><CountView count={this.state.following} suffix="following" /></TouchableOpacity></Col>
          </Grid>

        </AnimatView>

      </ScrollView >
    );
  }

  async getData(userName, password) {
    selfuserName = null;
    if (userName != null && password == null) {
      selfuserName = await AsyncStorage.getItem("@MySuperStore:userName");
    }
    if (userName == null) {
      userName = await AsyncStorage.getItem("@MySuperStore:userName");
    }
    if (password == null) {
      password = await AsyncStorage.getItem("@MySuperStore:password");
    }
    if (selfuserName == null) {
      selfuserName = userName;
    }
    await axios.get("http://api.github.com/users/" + userName, {
      headers: { 'Authorization': 'Basic ' + Base64.btoa(selfuserName + ":" + password) }
    }).then((res) => {
      userName = res.data.login;
      urlAvatar = res.data.avatar_url;
      bio = res.data.bio;
      name = res.data.name;
      date = res.data.created_at.split("T")[0];
      website = res.data.html_url;
      repo = res.data.public_repos;
      following = res.data.following;
      follower = res.data.followers;
      // Split text into individual words and count length
      this.setState({
        name: name,
        userName: userName,
        urlAvatar: urlAvatar,
        bio: bio,
        date: date,
        website: website,
        repo: repo,
        follower: follower,
        following: following,
      })
    })
  }
  componentDidMount() {
    // this.getData();
  }
}



HomeScreen.navigationOptions = {
  title: "Profile",
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(240,240,230)',
  },
  userInfoStyle: {
    flex: 1,
    paddingTop: 55,
    paddingBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconStyle: {
    width: 260,
    height: 260,
    backgroundColor: 'transparent',
    borderColor: 'rgb(240,240,235)',
    borderWidth: 6,
    borderRadius: 50,
  },
  userNameStyle: {
    paddingTop: 21,
    paddingLeft: 90,
    backgroundColor: 'transparent',
    fontSize: 20,
    textAlign: 'right',
    justifyContent: 'flex-end',
  },
  accoutInfoStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgb(242,	242	,242)',
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'rgb(240, 240,	230)',
  },
  accountStyle: {
    fontSize: 30,
    fontFamily: 'AvenirNextCondensed-DemiBold'
  },
  website: {
    paddingBottom: 40,
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'Apple SD Gothic Neo'
  },
  accountStyle2: {
    textAlign: 'center',
    fontSize: 15,
    paddingVertical: 1.5,
    fontFamily: 'Apple SD Gothic Neo'
  },
  count: {
    textAlign: 'center',
    fontSize: 70,
    fontFamily: 'AppleSDGothicNeo-Thin',
  },
  suffix: {
    textAlign: 'center',
    paddingLeft: 50,
    fontSize: 12,
  }
});
