import React from 'react';
import PropTypes from 'prop-types';

import CameraPath from './CameraPath';
import ChoosePath from './ChoosePath';

export default class DisplayWalkthrough extends React.Component {
  static propTypes = {
    session: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  state = {
    path: null
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
              onSelectPath={newPath => this.setState({ path: newPath })}
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
