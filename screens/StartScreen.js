import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';
import Question from '../components/Question';

export default class StartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0,
      isNewUser: true,
    };
  }

  renderQuestion() {
    var questions = [];
    switch (this.state.stage) {
      case 0:
        questions.push(
          <Question 
            question='Is this the first time you are using this machine?'
            key={0}
            onAnswer={(text) => {
              this.setState({
                stage: 1,
                isNewUser: text ? text.toUpperCase().includes('YES') : true,
              });
            }}
          />
        );
        break;
      case 1:
        questions.push(
          <Question 
            question='What is your name?'
            key={1}
            onAnswer={(text) => {
              this.props.nextScreen({
                isNewUser: this.state.isNewUser,
                name: text,
              })
            }}
          />
        );
        break;
    }
    return questions;
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderQuestion()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
    flexDirection: 'column',
    padding: 10,
    paddingVertical: 100,
  },
});