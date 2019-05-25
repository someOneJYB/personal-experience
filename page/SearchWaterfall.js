import React, {Component} from 'react'
import {View, StyleSheet, Text, Platform, Image} from 'react-native'
import {Button, Card, CardItem, Icon, Left, Thumbnail} from "native-base";
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'
import {Actions} from 'react-native-router-flux';

const limit = 10


class Waterfalls extends Component {
    state: {
        dataList: item,
        refreshState: number,
    }

    constructor(props) {
        super(props)
        this.state = {
            dataList: [],
            refreshState: RefreshState.Idle,
            offset: 0,

        }

    }

    like = (id) => {
        if(!this.isLogin()) {
            Actions.login();
            return;
        }
        fetch(`http://127.0.0.1:3000/book/like/${2015224257}/`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                item_id: id,
            }),
        }).then(response => response.json()).catch(error => {
            alert(error.message)
        }).then(response => {
            alert(response.message)
            if (response.code === 100) {
                this.onHeaderRefresh()
            }
        });
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {
        this.onHeaderRefresh()
    }
    delete = (item) =>{
        fetch(`http://127.0.0.1:3000/book/delete/${item.item_id}`, {
            method: 'GET',
        }).then(response => response.json()).catch(err => {
            alert(JSON.stringify(err))
        }).then(response => {
            this.onHeaderRefresh()

        })
    }
    isLogin = () => {
        let id;
        global.storage.load({
            key: 'user',
        }).then(ret => {
            alert('90')
            // 如果找到数据，则在then方法中返回
            id = ret.token;
        }).catch(err => {
            // 如果没有找到数据且没有sync方法，
            alert('0')
            // 或者有其他异常，则在catch中返回

        })
        alert(JSON.stringify(id))
        return id
    }

    onHeaderRefresh = () => {
        let t = this.props.type
        this.setState({refreshState: RefreshState.HeaderRefreshing})
        fetch(`http://127.0.0.1:3000/search/${this.props.word}/0/10/${t}/${global.storage.name}`, {
            method: 'GET',
        }).then(response => response.json()).catch(err => {
            this.setState({refreshState: RefreshState.Failure})
            alert(JSON.stringify(err))
        }).then(response => {
            this.setState({
                dataList: [...response.list],
                refreshState: response.list.length === 0 ? RefreshState.NoMoreData : RefreshState.Idle,
                offset: limit
            })

        })

        // 模拟网络请求

    }

    onFooterRefresh = () => {
        const {word, type} = this.props
        this.setState({refreshState: RefreshState.FooterRefreshing})
        fetch(`http://127.0.0.1:3000/search/${word}/${this.state.offset}/${limit}/${type}/${global.storage.name}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()).catch(err => {
            this.setState({refreshState: RefreshState.Failure})
            alert(JSON.stringify(err))
        }).then(response => {
            this.setState({
                dataList: [...this.state.dataList, ...response.list],
                refreshState: response.list.length < 10 ? RefreshState.NoMoreData : RefreshState.Idle,
                offset: this.state.offset + limit
            })

        })
    }


    keyExtractor = (item: any, index: number) => {
        return index.toString()
    }

    cb = () => {
        fetch(`http://127.0.0.1:3000/search/${this.props.word}/0/10/${this.props.type}/${global.storage.name}`, {
            method: 'GET',
        }).then(response => response.json()).catch(err => {
            alert(JSON.stringify(err))
        }).then(response => {
            this.setState({
                dataList: [...response.list],
            })

        })
    }

    renderCell = (it) => {
        const item = it.item
        const img = item.image1 || item.image2 || item.image3 || item.image4 || item.image5 || item.image6 || item.image7 || item.image8 || item.image9
        // const like = this.state.likeIndex && this.state.likeIndex === parseInt(it.index) ? item.like_num + 1 : item.like_num
        return (
            <Card>
                <CardItem cardBody>
                    {img !== "" && <Image
                        source={{uri: item.image1 || item.image2 || item.image3 || item.image4 || item.image5 || item.image6 || item.image7 || item.image8} || item.image9}
                        style={{height: 150, width: null, flex: 1}}/>}
                </CardItem>
                <CardItem>
                    <Text onPress={() => Actions.black({
                        'id': item.item_id,
                        'user': item.creator,
                        'time': item.create_time,
                        title: item.title,
                        'items': item,
                        cb: this.cb
                    })}>
                        {item.title}
                    </Text>
                </CardItem>
                <CardItem>
                    <Left>
                        <Thumbnail
                            style={{marginRight: 10}}
                            source={{uri: this.props.type === 'tree' ? 'http://thumbs.dreamstime.com/b/外形匿名面孔象-灰色剪影人-男性缺省具体化-照片占位符-背景查出的白色-107327860.jpg' : item.pic}}
                            small/>
                        <Text onPress={() => Actions.ta()}>{this.props.type === 'tree' ? '匿名用户' : item.creator}</Text>
                    </Left>
                    <Button transparent>
                        <Icon active name="thumbs-up" onPress={() => this.like(item.item_id, parseInt(it.index))}/>
                        <Text>{item.like_num}</Text>
                        <Icon active name="chatbubbles"/>
                        <Text>{item.comment_num}</Text>
                        {global.storage.token && (global.storage.name === item.creator) && <Icon name="trash" onPress={()=>this.delete(item)}/>}
                    </Button>

                </CardItem>
            </Card>


        )
    }


    render() {
        return (
            <View style={styles.container}>
                <RefreshListView
                    data={this.state.dataList}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderCell}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this.onHeaderRefresh}
                    onFooterRefresh={this.onFooterRefresh}

                    // 可选
                    footerRefreshingText='玩命加载中 >.<'
                    footerFailureText='我擦嘞，居然失败了 =.=!'
                    footerNoMoreDataText='-我是有底线的-'
                    footerEmptyDataText='-好像什么东西都没有-'
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 20 : 0,
    },
    title: {
        fontSize: 18,
        height: 84,
        textAlign: 'center'
    }
})

export default Waterfalls