import React from 'react';
import PropTypes from 'prop-types';

import Menu from './Menu';
import Top from './Top';
import ActionsEnum from '../js/enums/ActionsEnum';

import Draw from './Draw';
import Topo from './Topo';
import Surface from './Surface';

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
    displayType: 'CALC'

    // action: ActionsEnum.ADDCUBE, // Default action is ADDCUBE
    // displayType: 'DRAW'

    // action: ActionsEnum.NO_SURFACE, // Default action is ADDCUBE
    // displayType: 'SURF'
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
        case 78: // n
          this.setState({
            displayType: 'SURF',
            action: ActionsEnum.NO_SURFACE
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
        return (<Topo action={action} actionsAPI={actionsAPI} model={designModel} />);
      case 'SURF':
        return (<Surface action={action} actionsAPI={actionsAPI} model={designModel} />);
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
          ActionsEnum.ADD_ROOF_EAST,
          ActionsEnum.ADD_ROOF_WEST,
          ActionsEnum.ADD_ROOF_NORTH,
          ActionsEnum.ADD_ROOF_SOUTH,
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
      case 'SURF':
        return [
          ActionsEnum.SOLID_SURFACE,
          ActionsEnum.PARTITION_SURFACE,
          ActionsEnum.TRANSPARENT_SURFACE,
          ActionsEnum.NO_SURFACE,
          ActionsEnum.HAS_ACCESS,
          ActionsEnum.NO_ACCESS
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
