import React, {Component} from 'react';
import ImagePicker from 'react-native-image-picker';
import {
    Icon,
    Textarea,
    Text,
    Button,
    List,
    ListItem,
    Left, Right
} from 'native-base';
import {Image, PixelRatio, StyleSheet, TouchableOpacity, View, TextInput, Dimensions, ScrollView} from "react-native";
import {Actions} from "react-native-router-flux";


export default class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageList: [],
            contentList: [],
            title: '',
            content1: '',
            content2: '',
            content3: '',
            content4: '',
            content5: '',
            content6: '',
            content7: '',
            content8: '',
            content9: '',
            image1: '',
            image2: '',
            image3: '',
            image4: '',
            image5: '',
            image6: '',
            image7: '',
            image8: '',
            image9: '',
        };
        this.getDatas()

    }

    getDatas = () => {
        fetch(`http://127.0.0.1:3000/book/get/${this.props.id}/detail`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()).catch(err => err).then(response => {
            const data = response.res
            this.setState({
                contentList: this.getContentList(data),
                imageList: this.getImageList(data),
                title: data.title
            })
        }).catch(err => {
            alert('失败')
        });
    }
    getContentList = (item) => {
        var list = []
        for (var i = 1; i < 10; i++) {
            list.push(item[`content${i}`])
        }
        return list;
    }
    getImageList = (item) => {
        var list = []

        for (var i = 1; i < 10; i++) {
            list.push(item[`image${i}`])
        }
        return list;
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
            this.setState({
                imageList: [...this.state.imageList]
            });
        }).catch((err) => {
            alert(JSON.stringify(err));
        });
    }

    selectPhotoTapped = (index) => {
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
                this.uploadImage(response.uri, this.state.title, index)
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
        for (let i = 0; i < 9; i++) {
            data[i] = i + 1
        }
        return data
    }


    getContent = (val, index) => {
        const f = this.state.contentList
        f[index] = val.nativeEvent.text
        alert(JSON.stringify(f))
        this.setState({
            contentList: [...f],
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
        var content9 = ''
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
        this.state.imageList.map((item, index) => {
            if (item !== index) {
                options[`image${index + 1}`] = item
            }
        })
        this.state.contentList.map((item, index) => {
            if (item) {
                options[`content${index + 1}`] = item
            }
        })
        this.setState({
            fetching: true
        })

        fetch(`http://127.0.0.1:3000/book/update/`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                item_id: this.props.id,
                ...options,
            }),
        }).then(response => response.json()).catch(error => {

            alert(error)
        }).then(response => {
            alert('成功，跳转页面查看')
            this.getDatas()
        }).catch(err => {
            alert('失败')
        });
    }


    render() {
        const data = this.getData()
        return (<View style={{marginTop: 50, marginBottom: 50}}>
            <View style={{height: 30}}>
            </View>
            <List>
                <ListItem noIndent>
                    <Left>
                        <Icon name="arrow-forward"
                              style={{fontSize: 20, color: 'blue', transform: [{rotate: "180deg"}]}}
                              onPress={() => {
                                  Actions.pop(this.props.cb())
                              }}/>
                    </Left>
                    <Right>
                        <Text>{this.state.title}</Text>
                    </Right>
                </ListItem>
            </List>
            <ScrollView contentContainerStyle={{paddingBottom: 60}}>
                {
                    data.map((item, index) => {
                        return (
                            <View key={index}>
                                    <Textarea style={styles.text}
                                              rowSpan={5}
                                              value={this.state.contentList[index] || ''}
                                              bordered placeholder="可以为空"
                                              onChange={(val) => this.getContent(val, index)} ref={`input${index}`}/>
                                <View style={styles.container}>
                                    <TouchableOpacity onPress={() => this.selectPhotoTapped(index)}>
                                        <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 30}]}>
                                            {(!this.state.imageList[index]) ? <Text>选择照片</Text> :
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
                    <Text>确定修改</Text>
                </Button>
            </ScrollView>
        </View>)
    }
}

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
        marginBottom: 50,
        marginLeft: Dimensions.get('window').width / 2 - 25
    },
});