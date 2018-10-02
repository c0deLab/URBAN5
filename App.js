// Based on expo init tabs startup file

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainScreen from './screens/MainScreen';
import StartScreen from './screens/StartScreen';
import { AppLoading, Font } from 'expo';
import { StatusBar } from 'react-native';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    isStart: false,
    user: {
      isNewUser: false,
      name: 'Erik',
    },
  };

  componentDidMount() {
    StatusBar.setHidden(true);
  }

  componentWillUnmount() {
    StatusBar.setHidden(false);
  }

  renderBody() {
    if (this.state.isStart) {
      return (<StartScreen nextScreen={(user) => this.setState(
        {
          isStart: false,
          user: user,
        }
      )} />);
    } else {
      return (<MainScreen user={this.state.user} />);
    }
  }

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.fixedRatio}>
            {this.renderBody()}
          </View>
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
});
