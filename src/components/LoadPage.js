import React from 'react';

import U5SessionFactory from '../js/data/U5SessionFactory';

/** Class for the rendering the main view with top, menu, and center panels */
export default class LoadPage extends React.Component {

  state = {};

  componentDidMount() {
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

  getButton = id => {
    const date = localStorage.getItem(`${id}_date`);
    let dateStr = '';
    if (date) {
      dateStr = new Date(parseInt(date)).toLocaleString();
    }
    const title = dateStr;
    return (<li key={id}><button type="button" onClick={e => this.onButtonClick(id)}>{title}</button></li>);
  }

  render() {
    const ids = new U5SessionFactory().getIDList();
    ids.reverse();
    const recentIds = ids.slice(0, 8);

    return (
      <div>
        <div>Load Previous Session:</div>
        <ul style={{ lineHeight: '28px' }}>
          <li key={'new'}><button type="button" onClick={e => this.onButtonClick('new')}>NEW</button></li>
          { recentIds.map(this.getButton) }
        </ul>
      </div>
    );
  }
}
