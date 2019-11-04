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
    Dimensions,
    TouchableHighlight,
} from 'react-native';
const axios = require('axios');


export default class FollowerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
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

    render() {
        table = []
        row = []
        for (let i = 0; i < this.state.data.length; i++) {
            row.push(<Row style={styles.row} key={i}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate('Home', {
                            userName: this.state.data[i]['login'],
                        });
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
            <ScrollView style={styles.container}>
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
        await axios.get("http://api.github.com/users/" + userName + "/followers", {
            headers: { 'Authorization': 'Basic ' + Base64.btoa(userName + ":" + password) }
        }).then((res) => {
            const dataAPI = res.data;
            this.setState({
                data: dataAPI,
            });
            AsyncStorage.setItem('@MySuperStore:followerList', JSON.stringify(this.state.data));
        })
    }
    componentDidMount() {
        this.getData();
    }
}

FollowerScreen.navigationOptions = {
    title: 'Followers',
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
