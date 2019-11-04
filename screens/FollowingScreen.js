import React, { Component } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Animatable from 'react-native-animatable';
import { Col, Row, Grid } from "react-native-easy-grid";
import Base64 from '../components/Base64';
import { TextInput } from 'react-native-paper';

AnimatImg = Animatable.createAnimatableComponent(Image);
AnimatView = Animatable.createAnimatableComponent(View);
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    AsyncStorage,
    Alert,
    Dimensions,
    RefreshControl
} from 'react-native';
const axios = require('axios');


export default class FollowingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: false,
        }
        Dimensions.addEventListener('change', () => {
            this.render();
        });
        if (this.props.navigation != null) {
            this.focusListener = this.props.navigation.addListener('didFocus', () => {
                this.getData();
            });
        }
    }


    async unfollow(userName, selfUserName, selfPassword) {
        if (selfUserName == null) {
            selfUserName = await AsyncStorage.getItem("@MySuperStore:userName");
        }
        if (selfPassword == null) {
            selfPassword = await AsyncStorage.getItem("@MySuperStore:password");
        }
        await axios.delete("https://api.github.com/user/following/" + userName, {
            headers: { 'Authorization': 'Basic ' + Base64.btoa(selfUserName + ":" + selfPassword) }
        }).then(() => {
            Alert.alert("Success", "Unfollowed " + userName);
            AsyncStorage.setItem('@MySuperStore:followList', JSON.stringify(this.state.data));
        })
    }


    render() {
        table = [];
        row = [];
        for (let i = 0; i < this.state.data.length; i++) {
            row.push(<Row style={styles.row} key={i}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate('OtherProfile', {
                            userName: this.state.data[i]['login'],
                        });
                    }}
                    onLongPress={() => {
                        Alert.alert(
                            'Warning',
                            'Are you sure to unfollow ' + this.state.data[i]['login'] + '?',
                            [
                                { text: 'Cancel' },
                                { text: 'Remove', onPress: () => this.unfollow(this.state.data[i]['login']) },
                            ],
                            { cancelable: false },
                        );
                    }}
                >
                    <AnimatImg
                        animation='fadeIn'
                        style={styles.userIconStyle}
                        source={{ uri: this.state.data[i]['avatar_url'] }}
                    />
                    <Text style={styles.regular}>{this.state.data[i]['login']}</Text>
                </TouchableOpacity></Row>)
        }
        table.push(
            <Grid style={{ alignItems: 'center' }} key={"container"}>{row}</Grid>
        )
        return (
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={async () => await this.getData()} />}
            >
                <TextInput
                    underlineColor="transparent"
                    theme={{ colors: { placeholder: 'white', text: 'black', primary: 'white', underlineColor: 'transparent', background: 'rgb(255,204,200)' } }}
                    label="Search User..."
                    autoCapitalize='none'
                    onSubmitEditing={(name) => {
                        this.props.navigation.navigate('Search', {
                            name: name.nativeEvent.text,
                            type: "users"
                        });
                    }}></TextInput>
                <AnimatView animation="bounceInDown" style={styles.viewCon} >
                    {table}
                </AnimatView>
            </ScrollView>
        );
    }
    async getData(userName, password) {
        if (userName == null) {
            userName = await AsyncStorage.getItem("@MySuperStore:userName");
        }
        if (password == null) {
            password = await AsyncStorage.getItem("@MySuperStore:password");
        }
        await axios.get("http://api.github.com/users/" + userName + "/following", {
            headers: { 'Authorization': 'Basic ' + Base64.btoa(userName + ":" + password) }
        }).then((res) => {
            const dataAPI = res.data;
            this.setState({
                data: dataAPI,
            })
            AsyncStorage.setItem('@MySuperStore:followList', JSON.stringify(this.state.data));
        })
    }
    componentDidMount() {
        this.getData();
    }
}

FollowingScreen.navigationOptions = {
    title: 'Following',
};

const styles = StyleSheet.create({
    userIconStyle: {
        width: 150,
        height: 150,
        backgroundColor: 'transparent',
        borderColor: 'rgb(240,240,235)',
        borderWidth: 6,
        borderRadius: 50,
    },
    container: {
        flex: 1,
        backgroundColor: 'rgb(240,240,230)',
    },
    title: {
        fontSize: 30,
        fontFamily: 'AppleSDGothicNeo-Thin',
    },
    row: {
        marginTop: 15,
        marginLeft: 20,
        marginRight: 20,
    },
    regular: {
        fontSize: 15,
        textAlign: "center",
        fontFamily: 'AppleSDGothicNeo-UltraLight'
    },
});
