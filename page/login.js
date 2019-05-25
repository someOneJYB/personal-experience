import React, {Component} from 'react';
import {Container, Header,  Text, Content, Form, Thumbnail, Button, Item, Input, Label} from 'native-base';
import {StyleSheet, Dimensions, View} from "react-native";
import {Actions} from 'react-native-router-flux';
var Spinner = require('react-native-spinkit');
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: false,
        };
    }
    componentDidMount() {
        this.url = global.storage.url
        this.name = global.storage.name
    }
    onChange1 = (v) => {
        this.value1 = v.nativeEvent.text
    }
    onChange2 = (v) => {
        this.value2 = v.nativeEvent.text
    }
    end = () => {
        this.setState({
            fetching: false
        })
    }

    send = () => {
        const username = this.value1;
        const password = this.value2;
        if (!username) {
            alert('用户名不为空')
            return
        }
        if (!password) {
            alert('密码不为空')
            return
        }
        this.setState({
            fetching: true
        })
        fetch('http://127.0.0.1:3000/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        }).then(response => response.json()).catch(error => {
            this.end();
            alert(error)
        }).then(response => {
<<<<<<< HEAD
            alert(JSON.stringify(response))
=======
>>>>>>> first commit
            this.end();
            if(response.code === 1) {
                global.storage = {
                    token: response.password,
                    url: response.pic,
                    name: this.value1
                }
                alert('Success:')
                Actions.scarlet()
            }else {
                alert('密码错误')
            }


        });
    }

    render() {
        return (
            <Container>
                <Spinner style={styles.spinner} isVisible={this.state.fetching} size={50} type="Bounce" color="blue"/>
                <Content>
                    <View style={{marginTop: 100}}/>
                    <Form>
                        <Item fixedLabel>
                            <Label>Username</Label>
                            <Input ref="userInput" placeholder={this.name||''} onChange={this.onChange1}/>
                        </Item>
                        <Item fixedLabel last>
                            <Label>Password</Label>
                            <Input ref="passInput" password={true} onChange={this.onChange2}/>
                        </Item>
                    </Form>
                    <Button full onPress={()=>{Actions.register()}} style={styles.margin}>
                        <Text>注册</Text>
                    </Button>
                    <Button full onPress={this.send} style={styles.margin}>
                        <Text>登录</Text>
                    </Button>

                </Content>

            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    margin: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
    },
    spinner: {
        marginTop: 200,
        marginLeft:Dimensions.get('window').width / 2 - 25
    },
    text: {
        textAlign: 'center'
    },
    padding: {
        marginLeft: 15,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
    },
});