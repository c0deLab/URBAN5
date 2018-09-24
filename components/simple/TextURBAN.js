import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

export default class TextURBAN extends React.Component {

  render() {
    return <Text {...this.props} style={[this.props.style, styles.text]}>{this.props.children.toUpperCase()}</Text>;
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 17,
    color: '#ffffff',
    lineHeight: 24,
    textAlign: 'left',
    fontFamily: 'space-mono',
  },
});
