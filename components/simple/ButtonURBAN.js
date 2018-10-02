import React from 'react';
import {
  StyleSheet,
  Button,
  Text,
} from 'react-native';
import TextURBAN from './TextURBAN';

export default class ButtonURBAN extends React.Component {

  render() {
    
    return (
      <TextURBAN onPress={() => this.props.onClick(this.props.button)}>{this.props.button.label}</TextURBAN>
    );
  }
}
