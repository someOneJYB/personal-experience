import React, {Component} from 'react';
import ImagePicker from 'react-native-image-picker';
import {Container, Header, Content, Icon, Form, Textarea, Item, Picker, Text, Input, Button} from 'native-base';
import {Image, PixelRatio, StyleSheet, TouchableOpacity, View, TextInput} from "react-native";

var Spinner = require('react-native-spinkit');

class AddItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canAdd: false,
            selectedNum: 0,
            fetching: false,
        };
        this.num = 0
    }

    selectPhotoTapped = (index) => {
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
                alert(response.uri)
                this.num++;
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.state.imageList[index] = response.uri
                this.setState({
                    imageList: [...this.state.imageList]
                });
            }
        });
    }
    onValueChangeNum = (val) => {
        const num = parseInt(val)
        this.content = new Array(num)
        this.setState({
            selectedNum: num,
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
    send = () => {
        var content1 = ''
        var content2 = ''
        var content3 = ''
        var content4 = ''
        var content5 = ''
        var content6 = ''
        var image1 = ''
        var image2 = ''
        var image3 = ''
        var image4 = ''
        var image5 = ''
        var image6 = ''
        const options = {
            content1,
            content2,
            content3,
            content4,
            content5,
            content6,
            image1,
            image2,
            image3,
            image4,
            image5,
            image6,
        }
        this.state.imageList.map((item, index) => {
            if (item !== index) {
                options[`image${index + 1}`] = item
            }
        })
        this.content.map((item, index) => {
            if (item) {
                options[`content${index + 1}`] = item
            }
        })
        fetch(`127.0.0.1:3000/book/add/${this.state.selected}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: this.title,
                ...options,
            }),
        }).then(response => response.json()).catch(error => {
            this.end();
            alert(error)
        }).then(response => {
            this.end();
            alert('Success:', response)
        });
    }

    getTitle = (val) => {
        this.title = val.nativeEvent.text
    }

    sendTitle = () => {
        this.setState({
            fetching: true
        })
        fetch('127.0.0.1:3000/vote/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: this.title,
            }),
        }).then(response => response.json()).catch(error => {
            this.end();
            alert(error)
        }).then(response => {
            this.end();
            alert('Success:', response)
        });
    }

    end = () => {
        this.setState({
            fetching: false
        })
    }

    render() {
        const data = this.getData(this.state.selectedNum)
        return (
            <Container>
                <Header/>
                <Content>
                    <Form>
                        <Spinner style={styles.spinner} isVisible={this.state.fetching} size={100} type="Bounce"
                                 color="blue"/>
                        <Text>一旦重新选择数字会导致数据丢失创建请谨慎, 目前仅支持一个用户一票</Text>
                        <Item picker>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down"/>}
                                style={{width: undefined}}
                                placeholder="创建的投票个数"
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
                                <Picker.Item label="10" value="10"/>
                                <Picker.Item label="11" value="11"/>
                                <Picker.Item label="12" value="12"/>
                            </Picker>
                        </Item>
                    </Form>
                    <Item>
                        <Icon active name='home'/>
                        <Input placeholder='投票标题' onChange={this.getTitle}/>
                    </Item>
                    <Button onPress={this.sendTitle}>
                        <Text>选择数目点击验证标题成功后才可以创建投票，不可再修改数目和标题</Text>
                    </Button>
                    {
                        this.state.canAdd && data.map((item, index) => {
                            return (
                                <View key={index}>
                                    <Textarea style={styles.text} rowSpan={5} bordered placeholder="投票简介不可以为空"
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
                </Content>
            </Container>
        );
    }
}

export default AddItem
const styles = StyleSheet.create({
    text: {
        borderRadius: 10,
        borderColor: '#00f',
        height: 100

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
        marginBottom: 50
    },
});