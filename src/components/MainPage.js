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
    session: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  state = {
    // action: ActionsEnum.ADDCUBE, // Default action is ADDCUBE
    // displayType: 'CALC'

    action: ActionsEnum.ADDCUBE, // Default action is ADDCUBE
    displayType: 'DRAW'

    // action: ActionsEnum.INCREASE_HEIGHT, // Default action is ADDCUBE
    // displayType: 'TOPO'

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
    const { action } = this.state;
    if (action === ActionsEnum.SPEAK_CONSTRAINT) {
      // do nothing
    } else {
      console.log(event.keyCode);
      switch (event.keyCode) {
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
        case 191: // /
          const { session } = this.props;
          session.monitor.clearConstraints();
          break;
        default:
          break;
      }
    }

  }

  getDisplay = () => {
    const { action, displayType } = this.state;
    const { session } = this.props;

    if (!session || !action) {
      return null;
    }

    switch (displayType) {
      case 'DRAW':
        return (<Draw action={action} session={session} />);
      case 'CALC':
        return (<DisplayWalkthrough session={session} />);
      case 'TOPO':
        return (<Topo action={action} session={session} />);
      case 'SURF':
        return (<Surface action={action} session={session} />);
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
          ActionsEnum.NO_SURFACE,
          // ActionsEnum.PARTITION_SURFACE,
          // ActionsEnum.TRANSPARENT_SURFACE,
          // ActionsEnum.HAS_ACCESS,
          // ActionsEnum.NO_ACCESS
        ];
      default:
        break;
    }

    return [];
  }

  render() {
    const { action } = this.state;
    const actions = this.getActions();

    const { session } = this.props;
    return (
      <div>
        <div style={{ width: '864px', height: '100%', float: 'left' }}>
          <div style={{ width: '864px', height: '160px' }}>
            <div style={{ padding: '20px' }}>
              <Top session={session} action={action} />
            </div>
          </div>
          <div style={{ width: '852px', height: '852px', padding: '5px' }}>
            {this.getDisplay()}
          </div>
        </div>
        <div style={{ width: '160px', height: '100%', float: 'left' }}>
          <div style={{ padding: '20px' }}>
            <Menu actions={actions} onClick={this.onMenuClick} action={action} />
          </div>
        </div>
      </div>
    );
  }
}
