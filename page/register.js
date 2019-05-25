import ImagePicker from 'react-native-image-picker';
import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    PixelRatio,
    TouchableOpacity,
    Image, Dimensions,

} from 'react-native';
import {Button, Container, Content, Form, Input, Item, Label, Thumbnail} from "native-base";
import {Actions} from "react-native-router-flux";

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
        'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});


export default class Register extends Component {
    state = {
        avatarSource: null,
        videoSource: null
    };
    uploadImage = (uri, username, index) => {
        let formData = new FormData();
        let file = {name: uri, type: 'application/octet-stream'};
        formData.append("file", file);
        fetch(`http://127.0.0.1:3000/submit/${index}/${username}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data;charset=utf-8',
            },
            body: formData,
        }).then((response) => response.json()).then((responseData) => {
            alert(responseData.ret.url)
            this.setState({
                image: responseData.ret.url
            });
        }).catch((err) => {
            alert(JSON.stringify(err));
        });
    }


    //选择图片
    selectPhotoTapped() {
        const username = this.value1;

        if (!username) {
            alert('请先填写用户名')
            return
        }
        const options = {
            title: '选择图片',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '选择照片',
            customButtons: [
                {name: 'fb', title: 'Choose Photo from Facebook'},
            ],
            cameraType: 'back',
            mediaType: 'photo',
            videoQuality: 'high',
            durationLimit: 10,
            maxWidth: 300,
            maxHeight: 300,
            quality: 0.8,
            angle: 0,
            allowsEditing: false,
            noData: false,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {


            if (response.didCancel) {
                console.log('User cancelled photo picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                let source = {uri: response.uri};
                this.uploadImage(response.uri, username, 1)
            }
        });
    }
    onChange1 = (v) => {
        this.value1 = v.nativeEvent.text
    }
    onChange2 = (v) => {
        this.value2 = v.nativeEvent.text
    }
    send = () => {
        const username = this.value1;
        const password = this.value2
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
        fetch('http://127.0.0.1:3000/signup/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                pic: this.state.image || ''
            }),
        }).then(response => response.json()).catch(error => {
            this.end();
            alert(JSON.stringify(error))
        }).then(response => {
            if(response.code === 1) {
                alert(JSON.stringify(response))
                global.storage = {
                    token: response.token,
                    url: this.state.image,
                    name: this.value1
                }
                alert('Success:', response)
                Actions.scarlet()
            }else {
                alert(response.message+'修改用户名后重新上传图片')
            }

        });
    }

    render() {
        return (
            <Container>

                <Content>
                    <Form>
                        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                            <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 30, marginLeft: Dimensions.get('window').width / 2 - 40, width: 80, height: 80, marginTop: 60}]}>
                                {!this.state.image ? <Text>选择照片</Text> :
                                    <Image style={styles.avatar} source={{uri: this.state.image}}/>
                                }
                            </View>
                        </TouchableOpacity>
                        <Item>
                            <Label>Username</Label>
                            <Input ref="userInput" onChange={this.onChange1}/>
                        </Item>
                        <Item>
                            <Label>Password</Label>
                            <Input ref="passInput" password={true} onChange={this.onChange2}/>
                        </Item>
                    </Form>

                    <Button full onPress={this.send} style={styles.margin}>
                        <Text>注册</Text>
                    </Button>

                </Content>

            </Container>


        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    avatarContainer: {
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center'
    },
    margin: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
    },
    avatar: {
        borderRadius: 50,
        width: 100,
        height: 100
    }
});

