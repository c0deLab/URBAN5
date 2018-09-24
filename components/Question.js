import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';
import TextURBAN from './simple/TextURBAN';

export default class StartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '_' };
  }

  render() {
    return (
      <View>
        <TextURBAN style={{paddingVertical: 100}}>{this.props.question}</TextURBAN>
        <TextInput
          style={styles.text}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          autoCapitalize='characters'
          caretHidden={true}
          underlineColorAndroid='rgba(0,0,0,0)'
          spellCheck={false}
          clearTextOnFocus={true}
          onFocus={() => this.setState({text: ''})}
          onSubmitEditing={() => this.props.onAnswer(this.state.text)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 17,
    color: '#ffffff',
    lineHeight: 24,
    textAlign: 'left',
    fontFamily: 'space-mono',
    height: 40,
  },
});