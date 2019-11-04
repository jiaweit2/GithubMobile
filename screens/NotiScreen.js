import React, { Component } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Animatable from 'react-native-animatable';
import { Col, Row, Grid } from "react-native-easy-grid";
import Base64 from '../components/Base64';
import { withNavigationFocus } from 'react-navigation';


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
    Linking,
    Dimensions,
    TouchableHighlight,
} from 'react-native';
const axios = require('axios');


class NotiScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            read: [],
            unread: [],
            data: {},
        }
        Dimensions.addEventListener('change', () => {
            this.render();
        });
        if (this.props.navigation != null) {
            this.focusListener = this.props.navigation.addListener('didFocus', (o) => {
                this.getData();
            });
        }
    }

    render() {
        unread_table = [];
        row = [<Row key={"unread"}><Col><Text style={styles.title}>Unread</Text></Col></Row>];
        for (let i = 0; i < this.state.unread.length; i++) {
            col = [];
            col.push(<Col size={2} key={i + 50}><Text style={styles.regular}>{this.state.data[this.state.unread[i]][0]}</Text></Col>);
            col.push(<Col size={1} key={i + 60}><Text style={styles.regular}>{this.state.data[this.state.unread[i]][1].toUpperCase()}</Text></Col>)
            row.push(<Row style={styles.row} key={i + 70}>{col}</Row>)
        }
        unread_table.push(
            <Grid style={styles.grid} key={"containerUnread"}>{row}</Grid>
        )
        read_table = [];
        row = [<Row key={"read"}><Col><Text style={styles.title}>Read</Text></Col></Row>];
        for (let i = 0; i < this.state.read.length; i++) {
            col = [];
            col.push(<Col size={2} key={i + 30}><Text style={styles.regular}>{this.state.data[this.state.read[i]][0]}</Text></Col>);
            col.push(<Col size={1} key={i + 40}><Text style={styles.regular}>{this.state.data[this.state.read[i]][1].toUpperCase()}</Text></Col>)
            row.push(<Row style={styles.rowRead} key={i + 20}>{col}</Row>)
        }
        read_table.push(
            <Grid style={styles.grid} key={"container_Read"}>{row}</Grid>
        )
        return (
            <ScrollView style={styles.container}>
                <AnimatView animation="bounceInDown" style={styles.viewCon} >
                    {unread_table}
                    {read_table}
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
        await axios.get("http://api.github.com/notifications", {
            headers: {
                'Authorization': 'Basic ' + Base64.btoa(userName + ":" + password)
            }
        }).then(async (res) => {
            const data = res.data;
            unread = [];
            read = await AsyncStorage.getItem("@MySuperStore:readNoti");
            read = JSON.parse(read);
            currData = await AsyncStorage.getItem("@MySuperStore:dataNoti");
            currData = JSON.parse(currData);
            for (let i = 0; i < data.length; i++) {
                id = data[i].id;
                title = data[i].subject.title;
                reason = data[i].reason;
                if (!read.includes(id)) {
                    unread.push(id);
                    currData[id] = [title, reason];
                }
            }
            AsyncStorage.setItem("@MySuperStore:dataNoti", JSON.stringify(currData));
            this.setState({
                data: currData,
                unread: unread,
                read: read,
            });
        })
    }
    componentDidMount() {
    }
    componentDidUpdate() {
        if (this.props.isFocused == false) {    //update unread to read
            for (let i = 0; i < this.state.unread.length; i++) {
                this.state.read.push(this.state.unread[i]);
            }
            AsyncStorage.setItem("@MySuperStore:readNoti", JSON.stringify(this.state.read));
        }
    }
}

NotiScreen.navigationOptions = {
    title: 'Notification',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(240,240,230)',
    },
    grid: {
        marginTop: 20,
        marginBottom: 20
    },
    title: {
        textAlign: "center",
        fontSize: 25,
        fontFamily: 'AppleSDGothicNeo-Thin',
    },
    row: {
        marginLeft: 40,
        marginRight: 30,
        marginTop: 30,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'rgb(200,200,150)',
    },
    rowRead: {
        marginLeft: 40,
        marginRight: 30,
        marginTop: 30,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'rgb(210,210,200)',
    },
    regular: {
        marginLeft: 20,
        fontSize: 20,
        fontFamily: 'AppleSDGothicNeo-UltraLight'
    },
});

export default withNavigationFocus(NotiScreen);
