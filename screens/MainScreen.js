import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Scene from '../components/Scene';
import Menu from '../components/Menu';
import Conversation from '../components/Conversation';

export default class MainScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerLeft}>
          <View style={styles.containerConversation}>
            <Conversation user={this.props.user} />
          </View>
          <View style={styles.containerGraphics}>
            <Scene />
          </View>
        </View>
        <View style={styles.containerRight}>
          <View style={styles.containerMenu}>
            <Menu />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  containerLeft: {
    flexDirection: 'column',
    width: '75%',
  },
  containerRight: {
    width: '25%',
  },
  containerMenu: {
    padding: 10,
  },
  containerConversation: {
    padding: 10,
    height: '25%',
  },
  containerGraphics: {
    width: '100%',
    height: '75%',
    padding: 10,
  },
  text: {
    fontSize: 17,
    color: '#ffffff',
    lineHeight: 24,
    textAlign: 'left',
    fontFamily: 'space-mono',
  },
});
