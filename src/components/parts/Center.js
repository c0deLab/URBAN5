import React from 'react';
import PropTypes from 'prop-types';

import DesignController from '../../js/DesignController';
import DesignModel from '../../js/DesignModel';
import DisplayDeveloper from './DisplayDeveloper';
import Display2D from './Display2D';
import Display3D from './Display3D';

export default class Center extends React.Component {
  static propTypes = {
    action: PropTypes.number.isRequired
  }

  state = {
    controller: null,
    model: null,
    displayType: '2D',
    showDeveloperView: true,
  };

  componentDidMount() {
    this.width = 852;
    this.height = 852;

    const model = new DesignModel();
    const controller = new DesignController(model);

    document.addEventListener('keydown', this.handleKeyDown);

    this.setState({
      controller,
      model
    });
  }

  handleKeyDown = event => {
    const { controller } = this.props;

    switch (event.keyCode) {
      case 86: // v
        this.setState({
          displayType: this.state.displayType === '3D' ? '2D' : '3D'
        });
        break;
      default:
        break;
    }
  }

  render() {
    const { action } = this.props;
    const {
      controller, model, displayType, showDeveloperView
    } = this.state;

    return (
      <div>
        {displayType === '3D' ? (
          <Display3D action={action} controller={controller} model={model} />
        ) : (
          <Display2D action={action} controller={controller} model={model} />
        )}
        {showDeveloperView && <DisplayDeveloper controller={controller} model={model} />}
      </div>
    );
  }
}
