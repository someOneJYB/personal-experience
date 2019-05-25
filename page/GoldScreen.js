import React, {Component} from 'react';
import {ScrollView, Text, Dimensions} from 'react-native';
import {Container, Header, ListItem, List, Item, Left, Right, Content, Input, Icon, Button} from 'native-base';
import {Actions} from 'react-native-router-flux';

export default class GoldScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            search: ''
        }
    }
    noRepeate = (list) => {
        var l = {}
        var w = []
        list.forEach(item => {
            if(!l[item.search]) {
                w.push(item)
                l[item.search] = 1
            }
        })
        return w;
    }
    getMore = () => {
        if(!global.storage.name) {
            fetch(`http://127.0.0.1:3000/search/get/`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json()).catch(error => {
                alert(error)
            }).then(response => {
                this.setState({
                    list: [...this.noRepeate(response.list)]
                })
            }).then(() => {

            });
            return
        }
        fetch(`http://127.0.0.1:3000/search/get/${global.storage.name}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => response.json()).catch(error => {
            alert(error)
        }).then(response => {
            this.setState({
                list: [...this.noRepeate(response.list)]
            })
        }).then(() => {

        });
    }
    componentDidMount() {
        this.getMore()
    }
    search = (word) => {
        this.setState({
            search: word
        })
        Actions.searchPage({'searchWord': word, cb: this.getMore})
    }

    searchFormBar = e => {
        this.setState({
            search: e.nativeEvent.text
        })
    }

    searchBar = () => {
        const {search} = this.state
        if(!search){
            alert('请选择搜索词')
            return
        }
        this.search(search)
    }

    render() {

        return (
            <Container style={{marginTop: Dimensions.get('window').width/9}}>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search"/>
                        <Input placeholder={this.state.search} onChange={this.searchFormBar}/>
                        <Icon name="ios-people"/>
                    </Item>
                    <Button transparent>
                        <Text onPress={this.searchBar}>Search</Text>
                    </Button>
                </Header>
                <ScrollView>
                    <Container>
                        <Content>
                            <List>
                                {
                                    this.state.list.map(item => {
                                        return(<ListItem key={item.id+''}>
                                            <Left>
                                                <Text onPress={() => this.search(item.search)}>{item.search+''}</Text>
                                            </Left>
                                            <Right>
                                                <Icon onPress={() => this.search(item.search)} name="arrow-forward" />
                                            </Right>
                                        </ListItem>)
                                    })
                                }
                                </List>
                        </Content>
                    </Container>
                </ScrollView>
            </Container>
        );
    }
}




