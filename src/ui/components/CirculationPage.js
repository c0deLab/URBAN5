import React from 'react';
import PropTypes from 'prop-types';

import CameraPath from './CameraPath';
import ChoosePath from './ChoosePath';

/* global SETTINGS */
export default class CirculationPage extends React.Component {
  static propTypes = {
    session: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  state = {
    path: null,
    distance: null
  }

  componentWillUnmount() {
    const { session } = this.props;
    session.monitor.setMessages([]);
  }

  render() {
    const { path, distance } = this.state;
    const { session } = this.props;

    if (distance === -1) {
      session.monitor.setMessages([`${SETTINGS.userName}, No path could be found.`]);
    } else if (distance) {
      session.monitor.setMessages([`${SETTINGS.userName}, I have arrived at the destination point`, `the trip distance (in feet) is ${distance}.`]);
    }

    return (
      <div>
        { !path
          ? (
            <ChoosePath
              session={session}
              onSelectPath={(path, distance) => this.setState({ path, distance })}
            />
          )
          : (
            <CameraPath
              session={session}
              path={path}
              onWalkthroughEnd={() => {
                setTimeout(() => this.setState({ path: null }), 500);
              }}
            />
          )
        }
      </div>
    );
  }
}
