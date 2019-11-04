import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, Button, TouchableHighlight } from 'react-native';
import { ImageBackground, rgb } from 'react-native'
import { AppRegistry, SectionList, FlatList, Linking, AsyncStorage } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Base64 from '../components/Base64';
AnimatImg = Animatable.createAnimatableComponent(Image);
AnimatView = Animatable.createAnimatableComponent(View);
import Ionicons from 'react-native-vector-icons/Ionicons';
const axios = require('axios');

export default class Like extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onClicked: false,
            repo: props.repo
        }
    }
    handlerButtonOnClick = async () => {
        var clicked = this.state.onClicked ? false : true;
        const repo = this.state.repo;
        let selfUserName = await AsyncStorage.getItem("@MySuperStore:userName");
        let selfPassword = await AsyncStorage.getItem("@MySuperStore:password");
        if (clicked) {
            axios.put('https://api.github.com/user/starred/' + selfUserName + "/" + repo, {}, {
                headers: {
                    'Authorization': 'Basic ' + Base64.btoa(selfUserName + ":" + selfPassword),
                    'Content-Length': 0
                }
            })
        } else {
            axios.delete('https://api.github.com/user/starred/' + selfUserName + "/" + repo, {
                headers: {
                    'Authorization': 'Basic ' + Base64.btoa(selfUserName + ":" + selfPassword),
                    'Content-Length': 0
                }
            })
        }
        this.setState({
            onClicked: clicked
        });
    }
    render() {
        return (
            <View>
                <Ionicons
                    onPress={this.handlerButtonOnClick}
                    color='rgb(250, 180, 180)'
                    name={this.state.onClicked ? 'md-heart' : 'md-heart-empty'}
                    size={30}
                    raised
                />
            </View>
        );
    }
}
