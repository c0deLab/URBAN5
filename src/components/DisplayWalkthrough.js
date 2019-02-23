import React from 'react';
import PropTypes from 'prop-types';

import CameraPath from './CameraPath';
import ChoosePath from './ChoosePath';

export default class DisplayWalkthrough extends React.Component {
  static propTypes = {
    session: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  state = {
    path: null,
    start: null
  }

  doWalkthrough = end => {
    const { session } = this.props;
    const { start } = this.state;

    const path = this.calculatePath(start, end, session);

    this.setState({ path });
  }

  calculatePath = (start, end) => {
    const steps = 15;
    const dx = (end.x - start.x) / steps;
    const dy = (end.y - start.y) / steps;
    const path = [];
    for (let i = 0; i < steps; i += 1) {
      path.push({ x: start.x + (i * dx), y: start.y + (i * dy), z: 0 });
    }
    return path;
  }

  render() {
    const { path } = this.state;
    const { session } = this.props;

    return (
      <div>
        { !path
          ? (
            <ChoosePath
              session={session}
              onSelectStart={start => this.setState({ start })}
              onSelectEnd={end => this.doWalkthrough(end)}
            />
          )
          : (
            <CameraPath
              session={session}
              path={path}
              onWalkthroughEnd={() => this.setState({ path: null })}
            />
          )
        }
      </div>
    );
  }
}
