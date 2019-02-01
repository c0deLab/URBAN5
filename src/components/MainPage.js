import React from 'react';
import PropTypes from 'prop-types';

import Menu from './Menu';
import Top from './Top';
import ButtonsEnum from '../js/enums/ButtonsEnum';
import ActionsEnum from '../js/enums/ActionsEnum';

import DesignModel from '../js/DesignModel';

import DisplayEdit from './center/DisplayEdit';
import DisplayWalkthrough from './center/DisplayWalkthrough';
import DisplaySetTopo from './center/DisplaySetTopo';

/* global document */

/** Class for the rendering the main view with top, menu, and center panels */
export default class MainPage extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  state = {
    action: 10, // Default action is ADDCUBE
    model: null,
    displayType: 'EDIT'
  };

  componentDidMount() {
    const model = new DesignModel();
    this.setState({
      model
    });

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
    console.log(event.keyCode);
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
      case 78: // v
        this.setState({
          displayType: 'TOPO'
        });
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

  getDisplay = () => {
    const { action } = this.state;
    const {
      model, displayType
    } = this.state;

    if (!model || !action) {
      return null;
    }

    switch (displayType) {
      case 'EDIT':
        return (<DisplayEdit action={action} model={model} />);
      case 'PATH':
        return (<DisplayWalkthrough model={model} />);
      case 'TOPO':
        return (<DisplaySetTopo model={model} />);
      default:
        break;
    }

    return null;
  }

  getButtons = () => {
    const { displayType } = this.state;

    switch (displayType) {
      case 'EDIT':
        return [
          ButtonsEnum.ADDCUBE,
          ButtonsEnum.ADDTREE,
          ButtonsEnum.ADDRFLFT,
          ButtonsEnum.ADDRFRGT,
          ButtonsEnum.REMOVE,
          ButtonsEnum.EDITTOPO
        ];
      case 'PATH':
        return [];
      case 'TOPO':
        return [];
      default:
        break;
    }

    return [];
  }

  render() {
    const buttons = this.getButtons();

    const { user } = this.props;
    return (
      <div>
        <div style={{ width: '864px', height: '100%', float: 'left' }}>
          <div style={{ width: '864px', height: '160px' }}>
            <div style={{ padding: '20px' }}>
              <Top user={user} />
            </div>
          </div>
          <div style={{ width: '852px', height: '852px', padding: '5px' }}>
            {this.getDisplay()}
          </div>
        </div>
        <div style={{ width: '160px', height: '100%', float: 'left' }}>
          <div style={{ padding: '20px' }}>
            <Menu buttons={buttons} onClick={this.onMenuClick} />
          </div>
        </div>
      </div>
    );
  }
}
