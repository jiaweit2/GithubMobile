import React, { Component } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Animatable from 'react-native-animatable';
import { Col, Row, Grid } from "react-native-easy-grid";
import Base64 from '../components/Base64';
import ModalSelector from 'react-native-modal-selector';
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
    Alert
} from 'react-native';
const axios = require('axios');


export default class SearchScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            name: "",
            type: "",
            sortMethod: "",
        }
        Dimensions.addEventListener('change', () => {
            this.render();
        });
        if (this.props.navigation != null) {
            this.focusListener = this.props.navigation.addListener('didFocus', (data) => {
                if (data && data.state && this.state.name == "") {
                    this.state.name = data.state.params.name;
                    this.state.type = data.state.params.type;
                    this.getData(this.state.name, this.state.type);
                }
            });
        }
    }

    async follow(userName, selfUserName, selfPassword) {
        if (selfUserName == null) {
            selfUserName = await AsyncStorage.getItem("@MySuperStore:userName");
        }
        if (selfPassword == null) {
            selfPassword = await AsyncStorage.getItem("@MySuperStore:password");
        }
        await axios.put("https://api.github.com/user/following/" + userName, {}, {
            headers: {
                'Authorization': 'Basic ' + Base64.btoa(selfUserName + ":" + selfPassword),
            }
        }).then(async () => {
            Alert.alert("Success", "Followed " + userName);
            this.props.navigation.navigate("Following");
        })
    }

    render() {
        table = [];
        row = [];
        for (let i = 0; i < this.state.data.length; i++) {
            col = []
            col.push(<Col size={2} key={i + 4 * this.state.data.length}>
                <Image
                    style={styles.userIconStyle}
                    source={this.state.type == "users" ? { uri: this.state.data[i]['avatar_url'] } : require('../assets/images/repo.png')}
                /></Col>)
            col.push(<Col size={3} key={i}><Text style={styles.title}
                onPress={() => {
                    this.state.type == "users" ? this.follow(this.state.data[i]['login']) :
                        this.props.navigation.navigate("Visual", {
                            name: this.state.data[i]['full_name'],
                        });
                }}>{this.state.type == "users" ? this.state.data[i]['login'] : this.state.data[i]['full_name']}
            </Text></Col>)
            row.push(<Row style={styles.row} key={i + 2 * this.state.data.length}>{col}</Row>)
        }
        table.push(
            <Grid key={"container"}>{row}</Grid>
        )

        var options = [
            { key: 0, section: true, label: 'Sort by' },
            { key: 1, label: 'RELEVANCE' },
            { key: 2, label: this.state.type == "users" ? "FOLLOWERS" : "STARS" },
        ];
        return (
            <ScrollView style={styles.container}>
                <AnimatView animation="bounceInDown" >
                    <ModalSelector
                        style={{ backgroundColor: "rgb(255,155,155)" }}
                        selectTextStyle={{ color: "white", fontSize: 20 }}
                        initValueTextStyle={{ color: "white", fontSize: 20 }}
                        data={options}
                        initValue="RELEVANCE"
                        onChange={(option) => { this.state.sortMethod = option.label.toLowerCase(); this.getData(this.state.name, this.state.type); }} />
                    {table}
                </AnimatView>
            </ScrollView>
        );
    }
    async getData(name, type, userName, password) {
        if (userName == null) {
            userName = await AsyncStorage.getItem("@MySuperStore:userName");
        }
        if (password == null) {
            password = await AsyncStorage.getItem("@MySuperStore:password");
        }
        if (name == null) {
            return;
        }
        await axios.get("http://api.github.com/search/" + type + "?q=" + name + "&sort=" + this.state.sortMethod, {
            headers: {
                'Authorization': 'Basic ' + Base64.btoa(userName + ":" + password)
            }
        }).then((res) => {
            const dataAPI = res.data;
            this.setState({
                data: dataAPI.items,
            })
        })
    }
    componentDidMount() {
        // this.getData();
    }
}

SearchScreen.navigationOptions = {
    title: 'Search Result',
};

const styles = StyleSheet.create({
    userIconStyle: {
        width: 40,
        height: 40,
        backgroundColor: 'transparent',
        borderColor: 'rgb(240,240,235)',
        borderWidth: 6,
        borderRadius: 10,
    },
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
        marginLeft: 30,
        marginRight: 20,
        marginBottom: 10,
    },
    regular: {
        marginTop: 5,
        fontSize: 15,
        textAlign: "right",
        fontFamily: 'AppleSDGothicNeo-UltraLight'
    },
});
