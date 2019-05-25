import React, {Component} from 'react';
import {Container, Header, Tab, Tabs, ScrollableTab, Text} from 'native-base';
import {StyleSheet} from "react-native";
import {Actions} from 'react-native-router-flux';
import Waterfall from "./Waterfall";
import WaterfallLike from './LikeWaterFall'
import WaterfallMayLike from './MayLikeWaterfall'
import Example from './Chat'
export default class Home extends Component {
    constructor(props) {
        super(props)
    }
    render() {

        return (
            <Container style={styles.height}>
                <Header hasTabs/>
                <Tabs renderTabBar={() => <ScrollableTab style={styles.height} underlineStyle={styles.container}

                                                         tabsContainerStyle={styles.container}/>}>

                    <Tab heading="校讯">
                        <Waterfall type="info"/>
                    </Tab>
                    <Tab heading="学习">
                        <Waterfall type="study"/>
                    </Tab>
                    <Tab heading="好物">
                        <Waterfall type="goods"/>
                    </Tab>
                    <Tab heading="旅行">
                        <Waterfall type="trav"/>
                    </Tab>
                    <Tab heading="美食">
                        <Waterfall type="food"/>
                    </Tab>
                    <Tab heading="求职">
                        <Waterfall type="career"/>
                    </Tab>
                    <Tab heading="树洞">
                        <Waterfall type="tree"/>
                    </Tab>
                    <Tab heading="猜你喜欢">
                        <WaterfallMayLike/>
                    </Tab>
                    <Tab heading="大家喜欢">
                        <WaterfallLike/>
                    </Tab>
                    <Tab heading="在线客服">
                        <Example/>
                    </Tab>
                </Tabs>

            </Container>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#00cb05',
    },
    height: {
        height: 50,
        marginBottom: 0,
        paddingBottom: 0,
    }

});