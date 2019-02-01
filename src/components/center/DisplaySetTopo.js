import React from 'react';
import PropTypes from 'prop-types';

/**  */
export default class DisplaySetTopo extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  render() {
    const { model } = this.props;

    return (
      <div>
        Display Set Topo
      </div>
    );
  }
}
