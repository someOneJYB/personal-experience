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
    Right,
    ListItem,
    Left,
    Body,
    H3,
    Card,
} from 'native-base';

import {Actions} from 'react-native-router-flux';

const cards = [
    {
        text: 'Card One',
        man: 123,
        name: 'One',
        image: 'https://img3.doubanio.com/view/movie_poster_cover/mpst/public/p2266110047.jpg',
    },
    {
        man: 13,
        text: 'Card two',
        name: 'Two',
        image: 'https://img3.doubanio.com/view/movie_poster_cover/mpst/public/p2266110047.jpg',
    },
    {
        man: 23,
        text: 'Card three',
        name: 'Three',

    },

];


class Detail extends Component {
    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
        };
    }

    _setModalVisible = (visible) => {
        // alert('如果评论未发送将丢失评论');
        this.setState({modalVisible: visible});
    }
    startShow = () => {

    }

<<<<<<< HEAD
    callBack = () => {
=======
    callBack = ( ) => {
>>>>>>> first commit
        this.a = 0
    }

    render() {
        const modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? {backgroundColor: '#fff', padding: 20}
            : null;
        const imgs = []
        const w = Dimensions.get('window').width / 2
        cards.map(it => {
            if (it.image) {
                Image.getSize(it.image, (width, height) => {
                    //width 图片的宽度
                    //height 图片的高度
                    imgs.push(Math.floor(width / w * height) || undefined);
                });
            }
        })
        return (
            <View>
                <View style={{height: 70}}>
                </View>
                <List>
                    <ListItem noIndent>
                        <Left>
                            <Icon name="arrow-forward"
                                  style={{fontSize: 20, color: 'blue', transform: [{rotate: "180deg"}]}}
                                  onPress={() => {
                                      Actions.pop()
                                  }}/>
                            <Icon active name="thumbs-up"
                                  style={{marginLeft: 120, color: this.state.like ? 'red' : 'blue'}}/>
                        </Left>
                        <Right>
                            <Text>这个故事</Text>
                        </Right>
                    </ListItem>
                </List>
                <ScrollView style={styles.container} horizontal={true}>
                    {
                        cards.map((item, index) => {
                            return (
                                <Card style={{width: w, flex: 1}} key={index}>
                                    <CardItem>
                                        <Left>
                                            <Body>
                                            <Text>{item.text}</Text>
                                            <Text note>NativeBase</Text>
                                            </Body>
                                        </Left>
                                    </CardItem>
                                    <CardItem cardBody>
                                        {item.image && <Image style={{height: imgs[index] || 150, width: w}}
                                                              source={{uri: item.image}}/>}
                                    </CardItem>
                                    <CardItem>
                                        <H3 style={styles.center}>已经有{item.man || 0}人支持</H3>


                                    </CardItem>
                                    <CardItem cardBody style={{textAlign: 'center'}}>
                                        <Button rounded success large style={styles.center}>
                                            <H3>{item.like ? '已支持' : '支持一下'}</H3>
                                        </Button>
                                    </CardItem>
                                    <CardItem>
                                        <H3 style={styles.center}
                                            onPress={() => this._setModalVisible(true)}>查看统计结果</H3>
                                    </CardItem>
                                </Card>)
                        })
                    }
                    <View style={{height: 90}}></View>
                </ScrollView>
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
                                    />
                                    <Button success onPress={this._setModalVisible( false)}>
                                        <Text>确定</Text>
                                    </Button>
                                </View>
                                <Button danger style={styles.btnd} onPress={this._setModalVisible(false)}>
                                    <Text>关闭</Text>
                                </Button>
                            </View>
                        </View>
                    </Modal>
                </KeyboardAvoidingView>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 80,
        display: 'flex',
    },
    containers: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 20

    },
    center: {
        flex: 1,
        justifyContent: 'center',
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

