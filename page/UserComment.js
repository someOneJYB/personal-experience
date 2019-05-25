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
    H4, Item,
} from 'native-base';

import {Actions} from 'react-native-router-flux';

class UserComment extends Component {
    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            fetching: false,
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            commentList: [],
            status: 'none',
        };

    }

    getComment = () => {
        fetch(`http://127.0.0.1:3000/users/${this.props.item.creator}`, {
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
        this.getComment()
    }

    render() {

        return (
            <View>
                <View style={{height: 70}}>
                </View>
                <ScrollView style={styles.container}>
                    <List>
                        {
                            this.state.commentList.length ? this.state.commentList.map((item, index) => {
                                return (
                                    <ListItem avatar key={index}>
                                        <Left>
                                            <Thumbnail
                                                source={{uri: this.props.item.pic}}/>
                                        </Left>
                                        <Body>
                                        <Text>{item.comment_id}</Text>
                                        <Text note>评论内容: {item.content}</Text>
                                        </Body>
                                    </ListItem>
                                )
                            }) : <Text style={{marginLeft: Dimensions.get('window').width/3+40, marginTop: 50, display: 'flex', justifyContent: 'center'}}>无评论</Text>
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

export default UserComment

