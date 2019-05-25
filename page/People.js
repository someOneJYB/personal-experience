import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {
    Container,
    Header,
    Right,
    H3,
    Content,
    Card,
    CardItem,
    Thumbnail,
    Text,
    Button,
    Icon,
    Left,
    Body,
    List,
    ListItem
} from 'native-base';

import {Actions} from 'react-native-router-flux';
export default class People extends Component {
    constructor(props) {
        super(props)
        this.state = {
            num : 0
        }
    }
    componentDidMount() {
        fetch(`http://127.0.0.1:3000/users/${this.props.name}/like`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => response.json()).catch(error => {
            alert(error)
        }).then(response => {

            this.setState({
                num: response.num
            })
        }).then(() => {

        });
    }

    render() {
        const name = global.storage.name
        return (
            <Container style={{paddingTop: 60}}>
                <Content>
                    <Card style={{flex: 0}}>
                        <CardItem>
                            {this.props.item.pic && <Thumbnail
                                source={{uri: this.props.item.pic}}/>}
                            <Left>
                                <Body>
                                <Text>{this.props.item.creator}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Container>
                                <Content>
                                    <List>
                                        <ListItem>
                                            <Left>
                                                <Text style={styles.padding}>
                                                    Ta的发布内容
                                                </Text>
                                            </Left>
                                            <Body>
                                            </Body>
                                            <Right>
                                                <Icon name="arrow-forward" onPress={()=>{
                                                    Actions.usercontent({name: this.props.name})
                                                }}/>
                                            </Right>
                                        </ListItem>
                                        {global.storage.name === this.props.item.creator && <ListItem>
                                            <Left>

                                                <Text style={styles.padding}>Ta 的评论</Text>
                                            </Left>
                                            <Body>
                                            </Body>
                                            <Right>
                                                <Icon name="arrow-forward" onPress={()=>{
                                                    Actions.usercoment({name: this.props.name, item: this.props.item})
                                                }}/>
                                            </Right>
                                        </ListItem>}
                                        {global.storage.name === this.props.item.creator && <ListItem>
                                            <Left>
                                                <Text style={styles.padding}>喜欢: {this.state.num}</Text>
                                            </Left>
                                            <Body>
                                            </Body>
                                            <Right>
                                                <Icon active name="heart" style={{ color:'red'}}/>

</Right>

                                        </ListItem>}
                                    </List>
                                </Content>
                            </Container>


                        </CardItem>


                    </Card>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        textAlign: 'center'
    },
    padding: {
        marginLeft: 15,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
    },
});
