import React from 'react'
import {GiftedChat} from 'react-native-gifted-chat'
import {
    ScrollView, View,
} from 'react-native';
import SocketIOClient from 'socket.io-client';

class Example extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            messages: [
                {
                    _id: 1,
                    text: '客服在此',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'robot',
                        avatar: 'https://placeimg.com/140/140/any',
                    },

                },
            ],
        }
        this.socket = SocketIOClient('http://localhost:3008');
        this.socket.on('message', this.onReceivedMessage);
    }

    determineUser = () => {
        if (!global.storage.name) {
            alert('请先登录')
        } else {
            this.socket.emit('userJoined', global.storage.name);
            this.setState({userId: global.storage.name});
        }
    }

    componentDidMount() {
        this.determineUser()
        if (!global.storage.name) {
            alert('请先登录')
            return
        }
        fetch(`http://127.0.0.1:3000/feedback/get/${global.storage.name}/${global.storage.url.slice(22)}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()).catch(error => {
            alert(JSON.stringify(error))
        }).then(response => {
            this.setState({
                messages: [...this.state.messages, ...response.list]
            })
        }).catch(err => {
            alert(JSON.stringify(err))
        });
    }


    // Event listeners
    /**
     * When the server sends a message to this.
     */
    onReceivedMessage = (messages) => {
        if (messages[0].token !== global.storage.name) {
            return
        }
        alert(JSON.stringify(messages))
        if (messages.length > 1) {
            this._storeMessages(messages);
            return;
        } else {
            messages[0]._id = (Math.random() + '').slice(2)
        }

        this._storeMessages(messages);
    }

    /**
     * When a message is sent, send the message to the server
     * and store it in this component's state.
     */
    onSend = (messages = []) => {
        if (!global.storage.name) {
            alert('请先登录')
            return
        }
        messages[0].user = {
            _id: global.storage.name
        }
        this.socket.emit('message', messages[0]);
        this._storeMessages(messages);
    }
    _storeMessages = (messages) => {
        alert(JSON.stringify(messages))
        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            };
        });
    }


    render() {
        var user = {_id: global.storage.name || -1};
        return (
            <ScrollView>
                <View style={{height: 800, backgroundColor: 'green'}}>
                    <GiftedChat
                        placeholder="输入发送信息"
                        forceGetKeyboardHeight={true}
                        messages={this.state.messages}
                        showUserAvatar={true}
                        onSend={messages => this.onSend(messages)}
                        user={user}
                    />
                </View>
            </ScrollView>
        )
    }
}

module.exports = Example