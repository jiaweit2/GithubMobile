import { View, Text, Alert, Image, Icon, TextInput, TouchableOpacity, Linking, AsyncStorage } from 'react-native';
import React, { Component } from 'react';
import Base64 from '../components/Base64';
const axios = require('axios');

// Splash Screen that will appears before displaying the main page
export default class SigninScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userText: '',
            password: '',
            error: ''
        }
    }
    async signIn(userName, password) {
        await axios.get("https://api.github.com/user", {
            headers: { 'Authorization': 'Basic ' + Base64.btoa(userName + ":" + password) }
        }).then((res) => {
            AsyncStorage.setItem('@MySuperStore:userName', userName);
            AsyncStorage.setItem('@MySuperStore:password', password);
            //Initialization
            AsyncStorage.setItem("@MySuperStore:dataNoti", JSON.stringify({}));
            AsyncStorage.setItem("@MySuperStore:readNoti", JSON.stringify([]));
            this.props.navigation.navigate('Home');
        }).catch((error) => {
            this.setState({
                error: error.response.status,
            });
            Alert.alert("Username or password does NOT match");
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={{ marginTop: 40, width: 200, height: 200 }}
                    source={require('../assets/images/github.png')}
                />
                <AnimatView animation='fadeInDown' style={styles.userInfoStyle}>
                    <View style={styles.viewStyles2}>
                        <TextInput
                            placeholder="Username"
                            placeholderTextColor='black'
                            style={styles.input}
                            autoCapitalize='none'
                            returnKeyType="next"
                            value={this.state.userText}
                            onSubmitEditing={() => { this.signIn(this.state.userText, this.state.password); }}
                            onChangeText={(text) => this.setState({ userText: text })}

                        />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor='black'
                            secureTextEntry
                            style={styles.input}
                            autoCapitalize='none'
                            returnKeyType="go"
                            value={this.state.password}
                            onSubmitEditing={() => { this.signIn(this.state.userText, this.state.password); }}
                            onChangeText={(text) => this.setState({ password: text })}

                        />
                        <TouchableOpacity
                            onPress={() => {
                                this.signIn(this.state.userText, this.state.password);
                            }}>
                            <Text style={styles.text}>LOGIN</Text>
                        </TouchableOpacity>
                    </View>
                </AnimatView>
            </View>
        );
    }
}
SigninScreen.navigationOptions = {
    title: 'Sign in',
};

const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgb(212,183,151)',
        paddingTop: 50,
    },
    input: {
        height: 40, width: 300, borderColor: 'gray', borderWidth: 1,
        paddingLeft: 10, paddingRight: 30,
        marginBottom: 10,
        textAlign: "left",
        backgroundColor: 'white',
        color: 'black',
    },
    viewStyles2: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 30
    },
    text: {
        fontSize: 30,
        paddingTop: 200
    }
}
