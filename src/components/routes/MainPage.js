import React from 'react';
import PropTypes from 'prop-types';

import Center from '../parts/Center';
import Menu from '../parts/Menu';
import Top from '../parts/Top';
import ButtonsEnum from '../../js/enums/ButtonsEnum';
import ActionsEnum from '../../js/enums/ActionsEnum';

/* global document */

/** Class for the rendering the main view with top, menu, and center panels */
export default class MainPage extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  state = {
    action: 2, // Default action is ADDCUBE
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  onMenuClick = button => {
    this.setState({
      action: button.action,
    });
  }

  /** Add some hotkeys to make testing easier */
  handleKeyDown = event => {
    let actionCode;
    switch (event.keyCode) {
      case 48: // 0
        actionCode = ActionsEnum.REMOVE;
        break;
      case 49: // 1
        actionCode = ActionsEnum.ADDCUBE;
        break;
      case 50: // 2
        actionCode = ActionsEnum.ADDTREE;
        break;
      case 51: // 3
        actionCode = ActionsEnum.ADDRFLFT;
        break;
      case 52: // 4
        actionCode = ActionsEnum.ADDRFRGT;
        break;
      case 53: // 5
        actionCode = ActionsEnum.REMOVE;
        break;
      case 54: // 6
        actionCode = ActionsEnum.ADDCUBE;
        break;
      case 55: // 7
        actionCode = ActionsEnum.ADDRFLFT;
        break;
      case 56: // 8
        actionCode = ActionsEnum.ADDRFRGT;
        break;
      default:
        break;
    }

    if (actionCode) {
      this.setState({
        action: actionCode,
      });
    }
  }

  render() {
    const buttons = [
      ButtonsEnum.ADDCUBE,
      ButtonsEnum.ADDTREE,
      ButtonsEnum.ADDRFLFT,
      ButtonsEnum.ADDRFRGT,
      ButtonsEnum.REMOVE
    ];

    const { user } = this.props;
    const { action } = this.state;
    return (
      <div>
        <div style={{ width: '864px', height: '100%', float: 'left' }}>
          <div style={{ width: '864px', height: '160px' }}>
            <Top user={user} />
          </div>
          <div style={{ width: '852px', height: '852px', padding: '5px' }}>
            <Center action={action} />
          </div>
        </div>
        <div style={{ width: '160px', height: '100%', float: 'left' }}>
          <div>
            <Menu buttons={buttons} onClick={this.onMenuClick} />
          </div>
        </div>
      </div>
    );
  }
}
