import React, {Component} from 'react';
import {
    ScrollView, Text, Image,
    StyleSheet, View, KeyboardAvoidingView, Dimensions, Modal, TextInput, PixelRatio
} from 'react-native';
import {
    List,
    Button,
    Icon,
    CardItem,
    Thumbnail,
    Right,
    ListItem,
    Left,
    Body,
} from 'native-base';

import {Actions} from 'react-native-router-flux';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: false,
            animationType: 'none',
            modalVisible: false,
            transparent: true,
            commentList: [],
            status: 'none',
        };

    }

    getLikeStatus = () => {
        if (!this.isLogin()) {
            return;
        }
        fetch(`http://127.0.0.1:3000/islike/`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: global.storage.name,
                item_id: this.props.id
            })
        }).then(response => response.json()).catch(err => {
            alert(JSON.stringify(err))
        }).then(response => {
            if (response.code === 1) {
                this.setState({status: true})
            } else {
                this.setState({status: false})
            }
        }).catch(err => {
            alert('失败')
            this.setState({status: 'none'})
        });
    }

    getComment = () => {
        fetch(`http://127.0.0.1:3000/comment/get/${this.props.id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()).catch(error => {

            alert('失败')
        }).then(response => {
            this.setState({
                commentList: [...response.list]
            })
        }).catch(err => {

        });
    }

    componentDidMount() {
        this.getLikeStatus()
        this.getComment()
    }

    _setModalVisible = (visible) => {
        if (!this.isLogin()) {
            alert('请登录')
            Actions.login();
            return;
        }
        this.setState({modalVisible: visible});
    }
    startShow = () => {

    }
    getItem = () => {
        let list = []
        const items = this.props.items
        for (var i = 1; i < 10; i++) {
            list.push({
                img: items[`image${i}`] || '',
                text: items[`content${i}`] || '',
            })
        }
        return list
    }
    isLogin = () => {
        return global.storage.token
    }
    sendComment = () => {
        if (!this.isLogin()) {
            alert('请登录')
            this.setState({modalVisible: false});
            Actions.login();
            return;
        }
        if (!this.text) {
            alert('请填写评论');
            return;
        }

        fetch(`http://127.0.0.1:3000/comment/add`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: global.storage.name,
                content: this.text,
                item_id: this.props.id,
                pic: global.storage.url
            })
        }).then(response => response.json()).catch(error => {
            alert('失败')
        }).then(response => {
            alert(response.message)
            if (response.code === 1) {
                this.getComment()
            }
        }).catch(err => {
            alert('失败')
        });

    }

    getText = (e) => {
        this.text = e.nativeEvent.text
    }

    deletes = (item) => {
        fetch(`http://127.0.0.1:3000/comment/deletes/`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                item_id: this.props.id
            })
        }).then(response => response.json()).catch(err => {
            alert(JSON.stringify(err))
        }).then(response => {
            fetch(`http://127.0.0.1:3000/comment/deleting/`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: global.storage.name,
                    item_id: this.props.id
                })
            }).then(response => response.json()).catch(err => {
            }).then(response => {
                const commentList = this.state.commentList.filter(itm => {
                    return itm.comment_id !== global.storage.name
                })
                this.setState({
                    commentList: [...commentList]
                })
                this.forceUpdate()
            }).catch(err => {
                alert('err')
                alert(JSON.stringify(err))
            });
        }).catch(err => {
            alert('失败')
        });
    }
    changeStatus = () => {
        const id = this.props.id
        console.log(this.state.status)
        if (this.state.status) {
            fetch(`http://127.0.0.1:3000/book/dislike/${global.storage.name}/`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item_id: id,
                }),
            }).then(response => response.json()).then(response => {

                this.setState({status: false})

            }).catch(err => {
                alert('失败')
                this.setState({status: 'none'})
            });
        } else {
            fetch(`http://127.0.0.1:3000/book/like/${global.storage.name}/`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item_id: id,
                }),
            }).then(response => response.json()).then(response => {

                this.setState({status: true})

            }).catch(err => {
                alert('失败')
                this.setState({status: 'none'})
            });
        }
    }


    render() {
        const modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? {backgroundColor: '#fff', padding: 20}
            : null;
        let screenWidth = Dimensions.get('window').width - 30;
        const imgs = []
        this.getItem().map(it => {
            Image.getSize(it.img, (width, height) => {
                imgs.push(Math.floor(screenWidth / width * height) || undefined);
            });
        })
        return (
            <View>
                <KeyboardAvoidingView>
                    <Modal
                        animationType={this.state.animationType}
                        transparent={this.state.transparent}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this._setModalVisible(false)
                        }}
                        onShow={this.startShow}
                    >
                        <View style={[styles.containers, modalBackgroundStyle]}>
                            <View style={[styles.innerContainer, innerContainerTransparentStyle]}>
                                <View style={styles.row}>
                                    <TextInput
                                        style={styles.inputView}
                                        returnKeyType="search"
                                        placeholder="请输入评论"
                                        onChange={this.getText}
                                    />
                                    <Button success onPress={this.sendComment}>
                                        <Text>确定</Text>
                                    </Button>
                                </View>
                                <Button danger style={styles.btnd} onPress={() => this._setModalVisible(false)}>
                                    <Text>关闭</Text>
                                </Button>
                            </View>
                        </View>
                    </Modal>
                </KeyboardAvoidingView>
                <View style={{height: 70}}>
                </View>
                <List>
                    <ListItem noIndent>
                        <Left>
                            <Icon name="arrow-forward"
                                  style={{fontSize: 20, color: 'blue', transform: [{rotate: "180deg"}]}}
                                  onPress={() => {
                                      this.props.cb ? Actions.pop(this.props.cb()) : Actions.pop()
                                  }}/>
                            {this.state.status !== 'none' && <Icon active name="thumbs-up" onPress={this.changeStatus}
                                                                   style={{
                                                                       marginLeft: 120,
                                                                       color: this.state.status ? 'red' : 'blue'
                                                                   }}/>}
                        </Left>
                        <Right>
                            <Text style={{width: 100}} numberOfLines={1}>{this.props.title}</Text>
                        </Right>
                    </ListItem>
                </List>
                <ScrollView style={styles.container}>
                    <CardItem>
                        <Left>
                            <Thumbnail
                                source={{uri: this.props.items.type === 'tree' ? 'https://www.kitcle.com/blog/wp-content/uploads/2019/02/incognito-2231825_960_720.png' : this.props.items.pic}}/>
                            <Body>
                            <Text>{this.props.items.type === 'tree' ? '一个不愿意透露姓名的网友' : this.props.items.creator}</Text>
                            <Text note>{this.props.items.create_time}</Text>
                            </Body>
                        </Left>
                    </CardItem>
                    <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}><Text
                        numberOfLines={1} ellipsizeMode={'tail'} style={{fontSize: 20}}>{this.props.title}</Text></View>
                    {
                        this.getItem().map((it, index) => {
                            return (
                                <CardItem key={index}>
                                    <Body>
                                    {(it.img && it.img !== "") ? <Image source={{uri: it.img}} style={{
                                        marginTop: 10,
                                        marginBottom: 10,
                                        height: imgs[index] || 150,
                                        width: screenWidth
                                    }}/> : null}
                                    {it.text !== "" ? <View>
                                        <Text>
                                            {it.text}
                                        </Text>
                                    </View> : null}
                                    </Body>
                                </CardItem>
                            )
                        })
                    }
                    <CardItem>
                        <Body style={{marginTop: -100}}>
                        <Left>
                            <Text>{`${this.state.commentList.length}评论`}</Text>
                        </Left>
                        <Right>
                            <Icon name="add-circle" onPress={() => this._setModalVisible(true)}/>
                        </Right>
                        </Body>
                    </CardItem>
                    <List>
                        {
                            this.state.commentList.map((item, index) => {
                                return (
                                    <ListItem avatar key={index}>
                                        <Left>
                                            <Thumbnail
                                                source={{uri: item.comment_pic || 'https://p.ssl.qhimg.com/dmfd/400_300_/t013323f4d5bb2e1f26.jpg'}}/>
                                        </Left>
                                        <Body>
                                        <Text>{this.props.items.type === 'tree' ? '一个不愿意透露姓名的网友' : item.comment_id}</Text>
                                        <Text note>评论内容: {item.content}</Text>
                                        {global.storage.name === item.comment_id &&
                                        <Icon name="trash" onPress={() => this.deletes(item)}/>}
                                        </Body>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                    <View style={{height: 200}}></View>
                </ScrollView>

            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 80,
    },
    containers: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 20

    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
    },
    btnd: {
        marginTop: 45,
        marginLeft: 10
    },
    innerContainer: {
        borderRadius: 10,
        alignItems: 'center',
    },
    row: {
        alignItems: 'center',

        flex: 1,
        flexDirection: 'row',
        marginBottom: 20,
    },
    rowTitle: {
        flex: 1,
        fontWeight: 'bold',
    },
    spinner: {
        marginBottom: 50,
        marginLeft: Dimensions.get('window').width / 2 - 25
    },
    inputView: {
        width: 250,
        height: 45,
        borderWidth: 1,
        marginLeft: 5,
        marginRight: 5,
        paddingLeft: 5,
        borderColor: '#ccc',
        borderRadius: 14,
    },
    button: {
        borderRadius: 5,
        flex: 1,
        height: 44,
        alignSelf: 'stretch',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    buttonText: {
        fontSize: 18,
        margin: 5,
        textAlign: 'center',
    },

    page: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
    },
    zhifu: {
        height: 150,
    },

    flex: {
        flex: 1,
    },
    at: {
        borderWidth: 1 / PixelRatio.get(),
        width: 80,
        marginLeft: 10,
        marginRight: 10,
        borderColor: '#18B7FF',
        height: 1,
        marginTop: 10

    },
    date: {
        textAlign: 'center',
        marginBottom: 5
    },
    station: {
        fontSize: 20
    },
    mp10: {
        marginTop: 5,
    },
    btn: {
        width: 60,
        height: 30,
        borderRadius: 3,
        backgroundColor: '#FFBA27',
        padding: 5,
    },
    btn_text: {
        lineHeight: 18,
        textAlign: 'center',
        color: '#fff',
    },
});

export default Detail

