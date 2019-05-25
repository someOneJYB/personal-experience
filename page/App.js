import React, {Component} from 'react';
import {Dimensions} from 'react-native';
import {Router, Scene, Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome'
import Detail from './Detail';
import GoldScreen from './GoldScreen';
import SearchResult from './SearchResult';
import Home from './Home'
import AddItem from './AddItem'
import People from './People'
import VoteDetail from './VoteDetail'
import Login from './login'
import Register from './register'
import Edit from './Edit'
import UserContent from './UserConntent'
import UserComment from './UserComment'

// Simple component to render something in place of icon
const TabIcon = ({selected, title}) => {
    return (
        <Icon name={title} size={px2dp(22)} style={{color: selected ? 'red' : 'black'}}/>

    );
}
const basePx = 375
const deviceW = Dimensions.get('window').width

function px2dp(px) {
    return px * deviceW / basePx
}

class App extends Component {
    render() {
        return (
            <Router>
                <Scene key="root">
                    <Scene
                        key="tabbar"
                        tabs={true}
                        tabBarStyle={{backgroundColor: '#FFFFFF'}}
                    >
                        <Scene key="osu" title="home" icon={TabIcon}>
                            <Scene key="scarlet"
                                   component={Home}
                                   title="首页"
                            />
                            <Scene key="usercoment"
                                   component={UserComment}
                                   title="评论内容"
                            />

                            <Scene
                                key="black"
                                component={Detail}
                                title="Black"
                                leftTitle="关闭"
                                panHandlers={null}
                                onLeft={Actions.pop}
                            />
                            <Scene
                                key="vote"
                                component={VoteDetail}
                                title="vote"
                            />

                            <Scene
                                key="usercontent"
                                component={UserContent}
                                title="发布的内容"
                            />
                            <Scene
                                key="ta"
                                component={People}
                                title="Ta"
                            />
                            <Scene
                                key="login"
                                component={Login}
                                title="Login"
                            />
                            <Scene
                                key="register"
                                component={Register}
                                title="register"
                            />
                            <Scene
                                key="edit"
                                component={Edit}
                                title="edit"
                            />
                        </Scene>
                        <Scene key="um" title="plus" icon={TabIcon}>
                            <Scene
                                key="blue"
                                component={AddItem}
                                title="创建"
                            />
                        </Scene>
                        <Scene key="vu" title="search" icon={TabIcon}>
                            <Scene
                                key="gold"
                                component={GoldScreen}
                            />
                            <Scene
                                key="searchPage"
                                title="搜索结果页"
                                component={SearchResult}
                            />
                        </Scene>
                    </Scene>
                </Scene>
            </Router>
        )
    }
}

export default App;

