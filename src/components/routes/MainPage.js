import React from 'react';
import DesignViewer from '../parts/DesignViewer';
import Menu from '../parts/Menu';
import Conversation from '../parts/Conversation';
import ButtonsEnum from '../../js/ButtonsEnum';

export default class MainPage extends React.Component {

  state = {
      action: 2,
  };

  onMenuClick = (button) => {
    this.setState({
      action: button.action,
    });
  }

  render() {
    const buttons = [ButtonsEnum.STEPOUT, ButtonsEnum.STEPIN, ButtonsEnum.ADDCUBE, ButtonsEnum.REMVCUBE];

    return (
      <div>
        <div style={{width: '864px', height: '100%', float: 'left'}}>
          <div style={{width: '864px', height: '160px'}}>
            <Conversation user={this.props.user} />
          </div>
          <div style={{width: '852px', height: '852px', padding: '5px'}}>
            <DesignViewer action={this.state.action} />
          </div>
        </div>
        <div style={{width: '160px', height: '100%', float: 'left'}}>
          <div>
            <Menu buttons={buttons} onClick={this.onMenuClick} />
          </div>
        </div>
      </div>
    );
  }
}