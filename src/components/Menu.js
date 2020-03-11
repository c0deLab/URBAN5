import React from 'react';
import PropTypes from 'prop-types';

/** Class for the side panel of 'light buttons' */
export default class Menu extends React.PureComponent {
  static propTypes = {
    // Array of ActionsEnum to show
    actions: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    // Function to call when button is clicked
    onClick: PropTypes.func.isRequired // eslint-disable-line react/forbid-prop-types
  }

  render() {
    const buttonElements = [];

    const { actions, onClick, action } = this.props;
    if (actions) {
      actions.forEach(item => {
        buttonElements.push((
          <button
            type="button"
            key={item.label}
            onClick={e => {
              e.preventDefault();
              onClick(item);
            }}
            style={{ display: 'block', whiteSpace: 'pre' }}
          >
            {item.label + (item.id === action.id ? '_' : '')}
          </button>
        ));
      });
    }

    return (
      <div id="menu">
        {buttonElements}
      </div>
    );
  }
}
