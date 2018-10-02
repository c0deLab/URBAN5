import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Scene from '../components/Scene';
import Menu from '../components/Menu';
import Conversation from '../components/Conversation';
import ButtonsEnum from '../js/ButtonsEnum';

export default class MainScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      zoom: 10,
      action: 3,
    };
  }

  onMenuClick = (button) => {
    this.setState({
      action: button.action,
    });
  }

  render() {
    const buttons = [ButtonsEnum.STEPOUT, ButtonsEnum.STEPIN, ButtonsEnum.ADDCUBE, ButtonsEnum.REMVCUBE];

    return (
      <View style={styles.container}>
        <View style={styles.containerLeft}>
          <View style={styles.containerConversation}>
            <Conversation user={this.props.user} />
          </View>
          <View style={styles.containerGraphics}>
            <Scene action={this.state.action} />
          </View>
        </View>
        <View style={styles.containerRight}>
          <View style={styles.containerMenu}>
            <Menu buttons={buttons} onClick={this.onMenuClick} />
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
    width: '86%',
  },
  containerRight: {
    width: '14%',
  },
  containerMenu: {
    padding: 10,
  },
  containerConversation: {
    padding: 10,
    height: '25%',
    // borderColor: '#ff0000',
    // borderWidth: 1,
  },
  containerGraphics: {
    width: 600,
    height: 450,
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
