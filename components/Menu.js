import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import TextURBAN from './simple/TextURBAN';

export default class Menu extends React.Component {

  render() {
    const buttons = ['LGHTBTNS', 'STEP OUT', 'STEP  IN', 'STORPERM', 'STORTEMP', 'RETRIEVE', 'ADD NAME'];
    var buttonElements = [];

    buttons.forEach((label) => {
      buttonElements.push(<TextURBAN key={label}>{label}</TextURBAN>);
    });

    return (
      <View>
        {buttonElements}
      </View>
    );
  }
}
