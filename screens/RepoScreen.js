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
    View,
    Button,
    AsyncStorage,
    Linking,
    Dimensions,
    TouchableHighlight,
} from 'react-native';
import Like from '../components/Like';
const axios = require('axios');


export default class RepoScreen extends Component {
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
        table = [];
        row = [];
        for (let i = 0; i < this.state.data.length; i++) {
            col = []
            col.push(<Col size={1} key={i + 4 * this.state.data.length}><Like key={i + 4 * this.state.data.length} repo={this.state.data[i]['name']}></Like></Col>)
            col.push(<Col size={5} key={i}><Text style={styles.title}
                onPress={() => { Linking.openURL(this.state.data[i]['html_url']) }}>{this.state.data[i]['name']}
            </Text></Col>)
            col.push(<Col size={1} key={i + this.state.data.length}><Text style={styles.regular}>{this.state.data[i]['owner']['login']}</Text></Col>)
            row.push(<Row style={styles.row} key={i + 2 * this.state.data.length}>{col}</Row>)
            row.push(<Row style={styles.row2} key={i + 3 * this.state.data.length}><Text style={styles.regular2}>{this.state.data[i]['description']}</Text></Row>)
        }
        table.push(
            <Grid key={"container"}>{row}</Grid>
        )
        return (
            <ScrollView style={styles.container}>
                <AnimatView animation="bounceInDown" style={styles.viewCon} >
                    <TextInput
                        underlineColor="transparent"
                        theme={{ colors: { placeholder: 'white', text: 'black', primary: 'white', underlineColor: 'transparent', background: 'rgb(255,204,200)' } }}
                        label="Search Repo..."
                        autoCapitalize='none'
                        onSubmitEditing={(name) => {
                            this.props.navigation.navigate('Search', {
                                name: name.nativeEvent.text,
                                type: "repositories"
                            });
                        }}></TextInput>
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
        await axios.get("http://api.github.com/users/" + userName + "/repos", {
            headers: {
                'Authorization': 'Basic ' + Base64.btoa(userName + ":" + password)
            }
        }).then((res) => {
            const dataAPI = res.data;
            this.setState({
                data: dataAPI,
            })
            AsyncStorage.setItem('@MySuperStore:repoList', JSON.stringify(this.state.data));
        })
    }
    componentDidMount() {
        this.getData();
    }
}

RepoScreen.navigationOptions = {
    title: 'Repositories',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(240,240,230)',
    },
    title: {
        fontSize: 25,
        fontFamily: 'AppleSDGothicNeo-Thin',
    },
    row: {
        marginTop: 15,
        marginLeft: 20,
        marginRight: 20,
    },
    row2: {
        marginLeft: 20,
        marginRight: 20,
    },
    regular: {
        marginTop: 5,
        fontSize: 15,
        textAlign: "right",
        fontFamily: 'AppleSDGothicNeo-UltraLight'
    },
    regular2: {
        paddingBottom: 25,
        fontSize: 15,
        textAlign: "right",
        fontFamily: 'AppleSDGothicNeo-UltraLight'
    },
});
