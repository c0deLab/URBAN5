import React from 'react';
import PropTypes from 'prop-types';

import Menu from './Menu';
import Top from './Top';
import ActionsEnum from '../js/enums/ActionsEnum';

import DisplayEdit from './DisplayEdit';
import DisplayWalkthrough from './DisplayWalkthrough';

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
    displayType: 'EDIT'
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
    let action;
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
          displayType: 'EDIT'
        });
        break;
      case 86: // v
        this.setState({
          displayType: 'PATH'
        });
        break;
      default:
        break;
    }

    if (action) {
      this.setState({ action });
    }
  }

  getDisplay = () => {
    const { action, displayType } = this.state;
    const { actionsAPI, designModel } = this.props;

    if (!designModel || !action) {
      return null;
    }

    switch (displayType) {
      case 'EDIT':
        return (<DisplayEdit action={action} actionsAPI={actionsAPI} model={designModel} />);
      case 'PATH':
        return (<DisplayWalkthrough model={designModel} />);
      default:
        break;
    }

    return null;
  }

  getActions = () => {
    const { displayType } = this.state;

    switch (displayType) {
      case 'EDIT':
        return [
          ActionsEnum.ADDCUBE,
          ActionsEnum.ADDTREE,
          ActionsEnum.ADDRFLFT,
          ActionsEnum.ADDRFRGT,
          ActionsEnum.REMOVE,
          ActionsEnum.EDITTOPO
        ];
      case 'PATH':
        return [];
      default:
        break;
    }

    return [];
  }

  render() {
    const actions = this.getActions();

    const { monitor } = this.props;
    return (
      <div>
        <div style={{ width: '864px', height: '100%', float: 'left' }}>
          <div style={{ width: '864px', height: '160px' }}>
            <div style={{ padding: '20px' }}>
              <Top monitor={monitor} />
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
