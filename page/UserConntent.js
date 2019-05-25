import React, {Component} from 'react'
import {View, StyleSheet, Text, Platform, Image} from 'react-native'
import {Button, Card, CardItem, Icon, Left, Thumbnail} from "native-base";
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'
import {Actions} from 'react-native-router-flux';
const limit = 10


class WaterfallUserLike extends Component {
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
    isLogin = () => {

        return global.storage.token
    }
    like = (id) => {
        if(!this.isLogin()) {
            Actions.login();
            return;
        }
        fetch(`http://127.0.0.1:3000/book/like/${global.storage.name}/`, {
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
            if(response.code === 100) {
                this.onHeaderRefresh()
            }
        });
    }
    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {
        this.onHeaderRefresh()
    }

    onHeaderRefresh = () => {
        this.setState({refreshState: RefreshState.HeaderRefreshing})
        const name = this.props.name
        const url = `http://127.0.0.1:3000/users/0/${limit}/${name}`
        fetch(url, {
            method: 'GET',
        }).then(response => response.json()).catch(err => {
            this.setState({ refreshState: RefreshState.Failure })
            alert(JSON.stringify(err))
        }).then(response => {
            this.setState({
                dataList: [...response.list],
                refreshState: response.list.length === 0 ? RefreshState.NoMoreData : RefreshState.Idle,
                offset: limit
            })
        })
    }
    onFooterRefresh = () => {
        this.setState({refreshState: RefreshState.FooterRefreshing})
        const name = this.props.name
        const url = `http://127.0.0.1:3000/users/${this.state.offset}/${limit}/${name}`
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()).catch(err => {
            this.setState({ refreshState: RefreshState.Failure })
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

    renderCell = (it) => {
        const item = it.item
        const img = item.image1 || item.image2 || item.image3 || item.image4 || item.image5 || item.image6 || item.image7 || item.image8 || item.image9
        // const like = this.state.likeIndex && this.state.likeIndex === parseInt(it.index) ? item.like_num + 1 : item.like_num
        return (
            <Card>
                <CardItem cardBody>
                    {img !== "" && <Image source={{uri: item.image1 || item.image2 || item.image3 || item.image4 || item.image5 || item.image6 || item.image7 || item.image8} || item.image9} style={{height: 150, width: null, flex: 1}}/>}
                </CardItem>
                <CardItem>
                    <Text onPress={()=>Actions.black({'id': item.item_id, 'user': item.creator, 'time': item.create_time, title: item.title, 'items': item, cb: this.cb})}>
                        {item.title}
                    </Text>
                </CardItem>
                <CardItem>
                    <Left>
                        <Thumbnail source={{uri: this.props.type === 'tree' ? 'http://thumbs.dreamstime.com/b/外形匿名面孔象-灰色剪影人-男性缺省具体化-照片占位符-背景查出的白色-107327860.jpg' : item.pic}} small/>
                        <Text>{this.props.type === 'tree' ? '匿名用户': item.creator}</Text>
                    </Left>
                    <Button transparent>
                        <Icon active name="thumbs-up" onPress={() => this.like(item.item_id, parseInt(it.index))}/>
                        <Text>{item.like_num}</Text>
                        <Icon active name="chatbubbles"/>
                        <Text>{item.comment_num}</Text>
                    </Button>

                </CardItem>
            </Card>
        )
    }


    render() {
        let data = [...this.state.dataList]
        if(!global.storage.name) {
            data = data.filter(item => {
                return item.type !== 'tree'
            })
        }
        return (
            <View style={styles.container}>
                <Text>大家喜欢这些</Text>
                <RefreshListView
                    data={data}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderCell}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this.onHeaderRefresh}
                    onFooterRefresh={this.onFooterRefresh}

                    // 可选
                    footerRefreshingText='玩命加载中 >.<'
                    footerFailureText='我擦嘞，居然失败了 =.=!'
                    footerNoMoreDataText='-没有啥啦😅-'
                    footerEmptyDataText='-好像什么东西都没有-'
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 50 : 0,
    },
    title: {
        fontSize: 18,
        height: 84,
        textAlign: 'center'
    }
})

export default WaterfallUserLike