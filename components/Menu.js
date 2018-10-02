import React from 'react';
import {
  Text,
  View,
  Button,
} from 'react-native';
import ButtonURBAN from './simple/ButtonURBAN';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var buttonElements = [];

    if (this.props.buttons) {
      this.props.buttons.forEach((button, index) => {
        buttonElements.push(<ButtonURBAN key={index} button={button} onClick={this.props.onClick} />);
      });
    }

    return (
      <View>
        {buttonElements}
      </View>
    );
  }
}
