import React from 'react';
import PropTypes from 'prop-types';

import Menu from './Menu';
import Top from './Top';
import { getActions } from '../js/enums/ActionsEnum';

import DrawPage from './DrawPage';
import TopoPage from './TopoPage';
import SurfacePage from './SurfacePage';

import CirculationPage from './CirculationPage';

/** Class for rendering screen when a session has been started */
export default class SessionPageContainer extends React.Component {
  static propTypes = {
    session: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    action: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    displayType: PropTypes.string.isRequired,
    cameraView: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    setAction: PropTypes.func.isRequired,
  }

  onMenuClick = action => {
    const { setAction } = this.props;
    if (this.actionListeners) {
      this.actionListeners.forEach(fn => {
        fn(action);
      });
    }
    if (!action.nonSelectable) {
      setAction(action);
    }
  }

  // These functions handle passing menu clicks to the page views
  registerActionListener = fn => {
    if (!this.actionListeners) {
      this.actionListeners = [];
    }
    this.actionListeners.push(fn);
  }

  unregisterActionListener = fn => {
    if (this.actionListeners) {
      const index = this.actionListeners.indexOf(fn);
      if (index > -1) {
        this.actionListeners.splice(index, 1);
      }
    }
  }

  getDisplay = () => {
    const { session, cameraView, action, displayType } = this.props;

    if (!session || !action) {
      return null;
    }

    switch (displayType) {
      case 'DRAW':
        return (
          <DrawPage
            action={action}
            session={session}
            cameraView={cameraView}
            registerActionListener={this.registerActionListener}
            unregisterActionListener={this.unregisterActionListener}
          />
        );
      case 'CALC':
        return (<CirculationPage session={session} />);
      case 'TOPO':
        return (<TopoPage action={action} session={session} />);
      case 'SURF':
        return (
          <SurfacePage
            action={action}
            session={session}
            cameraView={cameraView}
            registerActionListener={this.registerActionListener}
            unregisterActionListener={this.unregisterActionListener}
          />
        );
      default:
        break;
    }

    return null;
  }

  getActions = () => {
    const { displayType } = this.props;
    return getActions(displayType);
  }

  render() {
    const { action, session } = this.props;
    const actions = this.getActions();
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
