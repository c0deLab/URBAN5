import React from 'react';

import U5SessionFactory from '../api/U5SessionFactory';

/* global localStorage */
/* global document */

/** Class for the rendering the view showing sessions that can be loaded */
export default class StartPage extends React.Component {
  state = {
    active: 0
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = event => {
    const { active } = this.state;
    const ids = new U5SessionFactory().getIDList();
    console.log(event.keyCode);
    switch (event.keyCode) {
      case 38: // up arrow
        //
        this.setState({ active: Math.max(0, active - 1) });
        break;
      case 40: // down arrow
        this.setState({ active: Math.min(ids.length, active + 1) });
        break;
      case 13: // ENTER
        this.refs.sessions.getElementsByTagName('BUTTON')[active].click();
        break;
      default:
        break;
    }
    event.preventDefault();
  }

  onButtonClick = id => {
    const { onSelectSession } = this.props;
    const factory = new U5SessionFactory();
    let session;
    if (id === 'new') {
      session = factory.newSession();
    } else if (id === 'last') {
      session = factory.last();
    } else {
      session = factory.get(id);
    }

    onSelectSession(session);
  }

  getButton = (id, i) => {
    const { active } = this.state;
    const date = localStorage.getItem(`${id}_date`);
    let dateStr = '';
    if (date) {
      dateStr = new Date(parseInt(date, 10)).toLocaleString();
    }
    const title = dateStr;
    return (
      <li key={id} style={{ paddingTop: '4px' }}>
        <button type="button" onClick={() => this.onButtonClick(id)}>
          {title}
          { (active - 1) === i ? '_' : '' }
        </button>
      </li>);
  }

  render() {
    const { active } = this.state;
    const ids = new U5SessionFactory().getIDList();
    ids.reverse();
    const recentIds = ids.slice(0, 8);

    return (
      <div style={{ width: '1024px', height: '100%', float: 'left', padding: '20px' }}>
        <div>Select a session to use</div>
        <ul style={{ lineHeight: '28px' }} ref="sessions">
          <li key="new"><button type="button" onClick={() => this.onButtonClick('new')}>START NEW SESSION{ active === 0 ? '_' : '' }</button></li>
          <br/>
          <div>Open Previous Sessions:</div>
          { recentIds.map(this.getButton) }
        </ul>
      </div>
    );
  }
}
