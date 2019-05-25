import React, {Component} from 'react';
import ImagePicker from 'react-native-image-picker';
import {Container, Content, Icon, Form, Textarea, Item, Picker, Text, Input, Button} from 'native-base';
import {
    Image,
    PixelRatio,
    StyleSheet,
    TouchableOpacity,
    View,
    Dimensions,
    KeyboardAvoidingView
} from "react-native";
import {Actions} from "react-native-router-flux";

const Spinner = require('react-native-spinkit');


export default class AddItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected2: undefined,
            num: 0,
            canAdd: false,
            selectedNum: 0,
            fetching: false,
            imageList: [],
        };

        this.num = 0

    }

    uploadImage = (uri, title, index) => {
        let formData = new FormData();
        let file = {name: uri, type: 'application/octet-stream'};
        formData.append("file", file);
        fetch(`http://127.0.0.1:3000/submit/${index}/${encodeURIComponent(title).slice(0, 20)}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data;charset=utf-8',
            },
            body: formData,
        }).then((response) => response.json()).then((responseData) => {
            this.state.imageList[index] = responseData.ret.url
            alert('上传成功，不显示也成功了')
            this.setState({
                imageList: [...this.state.imageList]
            });
        }).catch((err) => {
            alert(JSON.stringify(err));
        });
    }
    selectPhotoTapped = (index) => {
        if(!this.isLogin()) {
            Actions.login();
            return;
        }
        const options = {
            title: '选择图片',
            cancelButtonTitle: '取消',
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
                alert('ImagePicker Error: ');
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                let source = {uri: response.uri};
                this.uploadImage(response.uri, this.title, index)
            }
        });
    }
    onValueChangeNum = (val) => {
        const num = parseInt(val)
        this.content = new Array(num)
        this.setState({
            selectedNum: num + '',
            imageList: this.getData(num)
        });
    }

    onValueChange2(value: string) {
        this.setState({
            selected: value
        });
    }

    getData = (length) => {
        const data = []
        for (let i = 0; i < length; i++) {
            data[i] = i
        }
        return data
    }

    addItem = () => {
        this.setState({
            selectedNum: this.num++,
            imageList: this.getData(this.num)
        });
    }

    getContent = (val, index) => {
        this.content[index] = val.nativeEvent.text
    }

    isLogin = () => {

        return global.storage.token
    }

    end = () => {
        this.setState({
            fetching: false
        })
    }
    send = () => {
        var content1 = ''
        var content2 = ''
        var content3 = ''
        var content4 = ''
        var content5 = ''
        var content6 = ''
        var content7 = ''
        var content8 = ''
        var content9= ''
        var image1 = ''
        var image2 = ''
        var image3 = ''
        var image4 = ''
        var image5 = ''
        var image6 = ''
        var image7 = ''
        var image8 = ''
        var image9 = ''
        const options = {
            content1,
            content2,
            content3,
            content4,
            content5,
            content6,
            content7,
            content8,
            content9,
            image1,
            image2,
            image3,
            image4,
            image5,
            image6,
            image7,
            image8,
            image9,
        }
        if(!this.title || !global.storage.name) {
            alert('请填写完整')
            return
        }
        this.state.imageList.map((item, index) => {
            if (item !== index) {
                options[`image${index + 1}`] = item
            }
        })
        this.content.map((item, index) => {
            if (item) {
                options[`content${index + 1}`] = item.replace(/(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g, '[表情]');
            }
        })
        this.setState({
            fetching: true
        })

        fetch(`http://127.0.0.1:3000/book/add/${this.state.selected}/`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: this.title,
                pic: global.storage.url,
                username: global.storage.name,
                ...options,
            }),
        }).then(response => response.json()).catch(error => {

            alert(error)
        }).then(response => {
                 this.end()
            if(response.code === -10) {
                alert('失败有敏感词汇')
                return
            }else {
                this.num = 0
                this.setState({
                    selectedNum: 0,
                    imageList: this.getData(this.num)
                });
            }
            alert(JSON.stringify(response))
        }).catch(err => {
            alert(JSON.stringify(err))
        });
    }

    getTitle = (val) => {
        this.title = val.nativeEvent.text
        this.setState({
            canAdd: val ? true : false
        })
    }

    render() {
        const data = this.getData(this.state.selectedNum)
        return (
            <Container>
                <Content>
                    <Form>
                        <Text style={{
                            marginBottom: 20,
                            marginTop: 100,
                            width: Dimensions.get('window').width,
                            textAlign: 'center'
                        }}>一旦重新选择数字会导致数据丢失创建请谨慎</Text>
                        <Item>
                            <Icon active name='home'/>
                            <Input placeholder='标题' onChange={this.getTitle}/>
                        </Item>
                        <Item picker>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down"/>}
                                style={{width: undefined}}
                                placeholder="选择创建的类型"
                                placeholderStyle={{color: "#bfc6ea"}}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.selected}
                                onValueChange={this.onValueChange2.bind(this)}
                            >
                                <Picker.Item label="好物" value="goods"/>
                                <Picker.Item label="学习" value="study"/>
                                <Picker.Item label="求职" value="career"/>
                                <Picker.Item label="树洞" value="tree"/>
                                <Picker.Item label="美食" value="food"/>
                                <Picker.Item label="校讯" value="info"/>
                                <Picker.Item label="旅行" value="trav"/>
                            </Picker>
                        </Item>
                        <Item picker>
                            <Spinner
                                style={styles.spinner}
                                isVisible={this.state.fetching}
                                size={50} type="Bounce"
                                color="blue"/>
                            {this.state.canAdd && <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down"/>}
                                style={{width: undefined}}
                                placeholder="创建的个数"
                                placeholderStyle={{color: "#bfc6ea"}}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.selectedNum}
                                onValueChange={this.onValueChangeNum}
                            >
                                <Picker.Item label="1" value="1"/>
                                <Picker.Item label="2" value="2"/>
                                <Picker.Item label="3" value="3"/>
                                <Picker.Item label="4" value="4"/>
                                <Picker.Item label="5" value="5"/>
                                <Picker.Item label="6" value="6"/>
                                <Picker.Item label="7" value="7"/>
                                <Picker.Item label="8" value="8"/>
                                <Picker.Item label="9" value="9"/>
                            </Picker>}
                        </Item>
                    </Form>
                    <KeyboardAvoidingView>
                    {
                        data.map((item, index) => {
                            return (
                                <View key={index}>
                                    <Textarea style={styles.text}
                                              rowSpan={5}
                                              bordered placeholder="可以为空"
                                              onChange={(val) => this.getContent(val, index)} ref={`input${index}`}/>
                                    <View style={styles.container}>
                                        <TouchableOpacity onPress={() => this.selectPhotoTapped(index)}>
                                            <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 30}]}>
                                                {this.state.imageList[index] === index ? <Text>选择照片</Text> :
                                                    <Image style={styles.avatar}
                                                           source={{uri: this.state.imageList[index]}}/>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        })
                    }

                    <Button full onPress={this.send} style={styles.margin}>
                        <Text>确定添加</Text>
                    </Button>
                    </KeyboardAvoidingView>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        borderRadius: 10,
        borderColor: '#00f',
        height: 100

    },
    margin: {
       borderRadius: 10,
       marginLeft: 10,
       marginRight: 10,
        marginTop: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    avatarContainer: {
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    avatar: {
        borderRadius: 50,
        width: 100,
        height: 100
    },
    spinner: {
        marginBottom: 50,
        marginLeft: Dimensions.get('window').width / 2 - 25
    },
});