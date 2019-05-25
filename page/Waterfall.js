import React, {Component} from 'react'
import {View, StyleSheet, Text, Platform, Image,ScrollView} from 'react-native'
import {Button, Card, CardItem, Icon, Left, Thumbnail} from "native-base";
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'
import {Actions} from 'react-native-router-flux';
const limit = 10


class Waterfall extends Component {
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
        let t = this.props.type
        this.setState({refreshState: RefreshState.HeaderRefreshing})
        fetch(`http://127.0.0.1:3000/book/getList/0/10/${t}`, {
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

        // 模拟网络请求

    }

    onFooterRefresh = () => {
        this.setState({refreshState: RefreshState.FooterRefreshing})
        fetch(`http://127.0.0.1:3000/book/getList/${this.state.offset}/${limit}/${this.props.type}`, {
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
    cb = () => {
        fetch(`http://127.0.0.1:3000/book/getList/0/10/${this.props.type}`, {
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
                    {img !== "" && <Image source={{uri: item.image1 || item.image2 || item.image3 || item.image4 || item.image5 || item.image6 || item.image7 || item.image8} || item.image9} style={{height: 150, width: null, flex: 1}}/>}
                </CardItem>
                <CardItem>
                    <Text onPress={()=>Actions.black({'id': item.item_id,'user': item.creator, 'time': item.create_time, title: item.title, 'items': item, cb: this.cb})}>
                        {item.title}
                    </Text>
                </CardItem>
                <CardItem>
                    <Left>
                        <Thumbnail style={{marginRight: 10}} source={{uri: this.props.type === 'tree' ? 'https://www.kitcle.com/blog/wp-content/uploads/2019/02/incognito-2231825_960_720.png' : item.pic}} small/>
                        <Text onPress={() => this.props.type === 'tree' ? null : Actions.ta({item: item, name: item.creator})}>{this.props.type === 'tree' ? '匿名用户': item.creator}</Text>
                    </Left>
                    <Button transparent>
                        <Icon active name="thumbs-up" onPress={() => this.like(item.item_id, parseInt(it.index))}/>
                        <Text>{item.like_num}</Text>
                        <Icon active name="chatbubbles"/>
                        <Text>{item.comment_num}</Text>
                        {global.storage.token && (global.storage.name === item.creator) && <Icon name="add" onPress={()=>{Actions.edit({id: item.item_id,cb: this.cb})}}/>}
                        {global.storage.token && (global.storage.name === item.creator) && <Icon name="trash" onPress={()=>this.delete(item)}/>}
                    </Button>

                </CardItem>
            </Card>


        )
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

export default Waterfall