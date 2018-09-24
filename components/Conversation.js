import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import TextURBAN from './simple/TextURBAN';

export default class Conversation extends React.Component {

  render() {
    var welcome = 'Welcome';
    if (this.props.user) {
      welcome = 'Welcome ' + (!this.props.user.isNewUser ? 'back ' : '') + this.props.user.name + ', this is URBAN5.'
    }
    return (
      <View>
        <TextURBAN>{welcome}</TextURBAN>
      </View>
    );
  }
}