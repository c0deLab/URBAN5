import React from 'react';
import PropTypes from 'prop-types';

import Menu from './Menu';
import Top from './Top';
import ActionsEnum from '../js/enums/ActionsEnum';

import Draw from './Draw';
import DisplayWalkthrough from './DisplayWalkthrough';
import Topo from './Topo';

/* global document */

/** Class for the rendering the main view with top, menu, and center panels */
export default class MainPage extends React.Component {
  static propTypes = {
    actionsAPI: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    monitor: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    designModel: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  state = {
    action: ActionsEnum.ADDCUBE, // Default action is ADDCUBE
    displayType: 'DRAW'
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  onMenuClick = action => {
    this.setState({ action });
  }

  /** Add some hotkeys to make testing easier */
  handleKeyDown = event => {
    let { action } = this.state;
    if (action === ActionsEnum.SPEAK_CONSTRAINT) {
      // do nothing
    } else {
      console.log(event.keyCode);
      switch (event.keyCode) {
        case 48: // 0
          action = ActionsEnum.REMOVE;
          break;
        case 49: // 1
          action = ActionsEnum.ADDCUBE;
          break;
        case 50: // 2
          action = ActionsEnum.ADDTREE;
          break;
        case 51: // 3
          action = ActionsEnum.ADDRFLFT;
          break;
        case 52: // 4
          action = ActionsEnum.ADDRFRGT;
          break;
        case 53: // 5
          action = ActionsEnum.REMOVE;
          break;
        case 54: // 6
          action = ActionsEnum.ADDCUBE;
          break;
        case 55: // 7
          action = ActionsEnum.ADDRFLFT;
          break;
        case 56: // 8
          action = ActionsEnum.ADDRFRGT;
          break;

        // Switch between views
        case 66: // b
          this.setState({
            displayType: 'DRAW',
            action: ActionsEnum.ADDCUBE
          });
          break;
        case 86: // v
          this.setState({
            displayType: 'CALC'
          });
          break;
        case 67: // c
          this.setState({
            displayType: 'TOPO',
            action: ActionsEnum.INCREASE_HEIGHT
          });
          break;
        default:
          break;
      }

      if (action) {
        this.setState({ action });
      }
    }

  }

  getDisplay = () => {
    const { action, displayType } = this.state;
    const { actionsAPI, designModel } = this.props;

    if (!designModel || !action) {
      return null;
    }

    switch (displayType) {
      case 'DRAW':
        return (<Draw action={action} actionsAPI={actionsAPI} model={designModel} />);
      case 'CALC':
        return (<DisplayWalkthrough model={designModel} />);
      case 'TOPO':
        return (<Topo action={action} model={designModel} />);
      default:
        break;
    }

    return null;
  }

  getActions = () => {
    const { displayType } = this.state;

    switch (displayType) {
      case 'DRAW':
        return [
          ActionsEnum.ADDCUBE,
          ActionsEnum.ADDTREE,
          ActionsEnum.ADDRFLFT,
          ActionsEnum.ADDRFRGT,
          ActionsEnum.REMOVE,
          ActionsEnum.SPEAK_CONSTRAINT
        ];
      case 'CALC':
        return [];
      case 'TOPO':
        return [
          ActionsEnum.INCREASE_HEIGHT,
          ActionsEnum.DECREASE_HEIGHT
        ];
      default:
        break;
    }

    return [];
  }

  render() {
    const { action } = this.state;
    const actions = this.getActions();

    const { monitor, actionsAPI } = this.props;
    return (
      <div>
        <div style={{ width: '864px', height: '100%', float: 'left' }}>
          <div style={{ width: '864px', height: '160px' }}>
            <div style={{ padding: '20px' }}>
              <Top monitor={monitor} action={action} actionsAPI={actionsAPI} />
            </div>
          </div>
          <div style={{ width: '852px', height: '852px', padding: '5px' }}>
            {this.getDisplay()}
          </div>
        </div>
        <div style={{ width: '160px', height: '100%', float: 'left' }}>
          <div style={{ padding: '20px' }}>
            <Menu actions={actions} onClick={this.onMenuClick} />
          </div>
        </div>
      </div>
    );
  }
}
