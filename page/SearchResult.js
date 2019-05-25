import React, {Component} from 'react';
import {Container, Header, Tab, Tabs, ScrollableTab, Text, ListItem, Left, Icon, Right, List} from 'native-base';
import {StyleSheet, Dimensions} from "react-native";
import Waterfalls from "./SearchWaterfall";
import {Actions} from "react-native-router-flux";

export default class SearchResult extends Component {
    render() {
        const searchWord = this.props.searchWord
        return (
            <Container style={styles.height}>
                <Header hasTabs/>
                <Icon name="arrow-forward"
                      style={{fontSize: 20, color: 'blue', marginRight: Dimensions.get('window').width - 10, transform: [{rotate: "180deg"}]}}
                      onPress={() => {
                          Actions.pop(this.props.cb())
                      }}/>
                <Tabs renderTabBar={() =>
                    <ScrollableTab
                        style={styles.height}
                        underlineStyle={styles.container}
                        tabsContainerStyle={styles.container}/>}
                >
                    <Tab heading="美食">
                    <Waterfalls type="food" word={searchWord}/>
                    </Tab>
                    <Tab heading="旅行">
                        <Waterfalls type="trav" word={searchWord}/>
                    </Tab>
                    <Tab heading="考研">
                        <Waterfalls type="study" word={searchWord}/>
                    </Tab>
                    <Tab heading="好物">
                        <Waterfalls type="goods" word={searchWord}/>
                    </Tab>
                    <Tab heading="校讯">
                        <Waterfalls type="info" word={searchWord}/>
                    </Tab>
                    <Tab heading="求职">
                        <Waterfalls type="career" word={searchWord}/>
                    </Tab>
                    <Tab heading="树洞">
                        <Waterfalls type="tree" word={searchWord}/>
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