import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import Base64 from '../components/Base64';
import {
    ScrollView,
    StyleSheet,
    Text,
    Dimensions,
    AsyncStorage,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
const axios = require('axios');
const screenWidth = Dimensions.get("window").width;
const chartConfig = {
    backgroundColor: '#F0F0E6',
    backgroundGradientFrom: '#F0F0E6',
    backgroundGradientTo: '#F8F3DF',
    decimalPlaces: 1, // optional, defaults to 2dp
    color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
    style: {
        borderRadius: 16,
    },
};

export default class VisualScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            labels: [],
            commits: [0, 0, 0, 0, 0, 0],
            languages: {},
        }
        Dimensions.addEventListener('change', () => {
            this.render();
        });
        if (this.props.navigation != null) {
            this.focusListener = this.props.navigation.addListener('didFocus', (data) => {
                if (data && data.state) {
                    this.state.name = data.state.params.name;
                    this.getData();
                }
            });
        }
    }

    render() {
        if (this.state.labels.length == 0) {
            this.createLabels();
        }
        var commit_data = {
            labels: this.state.labels.slice().reverse(),
            datasets: [{
                data: this.state.commits.slice().reverse(),
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }]
        }

        var language_data = [];
        for (var key in this.state.languages) {
            language_data.push({
                name: key,
                bytes: this.state.languages[key],
                color: "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); }),
            });
        }


        return (
            <ScrollView style={styles.container}>
                <AnimatView animation="bounceInDown" >
                    <Text style={styles.title}>Languages Use</Text>
                    <PieChart
                        data={language_data}
                        width={screenWidth}
                        height={220}
                        chartConfig={chartConfig}
                        accessor="bytes"
                        backgroundColor="transparent"
                        paddingLeft="15"
                    />
                    <Text style={styles.title}>Commits in the past 6 weeks</Text>
                    <LineChart
                        data={commit_data}
                        width={screenWidth}
                        height={256}
                        verticalLabelRotation={30}
                        chartConfig={chartConfig}
                        bezier
                    />
                </AnimatView>
            </ScrollView>
        )
    }

    async getData() {
        this.getCommits();
        this.getLanguages();
    }
    async getCommits() {
        let userName, password;
        if (userName == null) {
            userName = await AsyncStorage.getItem("@MySuperStore:userName");
        }
        if (password == null) {
            password = await AsyncStorage.getItem("@MySuperStore:password");
        }
        await axios.get("http://api.github.com/repos/" + this.state.name + "/stats/participation", {
            headers: { 'Authorization': 'Basic ' + Base64.btoa(userName + ":" + password) }
        }).then((res) => {
            const dataAPI = res.data.all;
            this.getStats(dataAPI);
            this.setState({
                commits: this.state.commits,
            })
        })
    }
    async getLanguages() {
        let userName, password;
        if (userName == null) {
            userName = await AsyncStorage.getItem("@MySuperStore:userName");
        }
        if (password == null) {
            password = await AsyncStorage.getItem("@MySuperStore:password");
        }
        await axios.get("http://api.github.com/repos/" + this.state.name + "/languages", {
            headers: { 'Authorization': 'Basic ' + Base64.btoa(userName + ":" + password) }
        }).then((res) => {
            const dataAPI = res.data;
            this.setState({
                languages: dataAPI,
            })
        })
    }

    createLabels() {
        let date = new Date();
        for (let i = 0; i < 6; i++) {
            date.setDate(date.getDate() - date.getDay());
            let dateString = date.toISOString().split('T')[0];
            let yyyymmdd = dateString.split('-');
            let finalDateString = yyyymmdd[1] + "/" + yyyymmdd[2] + "/" + yyyymmdd[0].slice(2, 4);
            this.state.labels.push(finalDateString);// with inverse order
            date.setDate(date.getDate() - 1);
        }
    }
    getStats(data) {
        for (let i = 0; i < 6; i++) {
            if (data[data.length - 1 - i] != null) {
                this.state.commits[i] = data[data.length - 1 - i];
            }
        }
    }
}

VisualScreen.navigationOptions = {
    title: 'Visualization',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(240,240,230)',
    },
    title: {
        padding: 25,
        fontSize: 25,
        textAlign: "center",
        fontFamily: 'AppleSDGothicNeo-UltraLight'
    },
});