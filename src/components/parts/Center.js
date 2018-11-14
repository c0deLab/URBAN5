import React from 'react';
import PropTypes from 'prop-types';

import DesignController from '../../js/DesignController';
import DesignModel from '../../js/DesignModel';
import DisplayDeveloper from './DisplayDeveloper';
import Display2D from './Display2D';
import Display3D from './Display3D';
import DisplaySelectPath from './DisplaySelectPath';

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
    switch (event.keyCode) {
      case 86: // v
        this.setState({
          displayType: '2D'
        });
        break;
      case 66: // b
        this.setState({
          displayType: '3D'
        });
        break;
      case 78: // n
        this.setState({
          displayType: 'SELECT_PATH'
        });
        break;
      default:
        break;
    }
  }

  getDisplay = () => {
    const { action } = this.props;
    const {
      controller, model, displayType
    } = this.state;

    switch (displayType) {
      case '2D':
        return (<Display2D action={action} controller={controller} model={model} />);
      case '3D':
        return (<Display3D action={action} controller={controller} model={model} />);
      case 'SELECT_PATH':
        return (<DisplaySelectPath action={action} controller={controller} model={model} />);
      default:
        break;
    }

    return null;
  }

  render() {
    const {
      controller, model, showDeveloperView
    } = this.state;

    return (
      <div>
        {this.getDisplay()}
        {showDeveloperView && <DisplayDeveloper controller={controller} model={model} />}
      </div>
    );
  }
}
