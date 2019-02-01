import React from 'react';
import PropTypes from 'prop-types';

/** Class for the side panel of 'light buttons' */
export default class Menu extends React.PureComponent {
  static propTypes = {
    // Array of ButtonsEnum to show
    buttons: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    // Function to call when button is clicked
    onClick: PropTypes.func.isRequired // eslint-disable-line react/forbid-prop-types
  }

  render() {
    const buttonElements = [];

    const { buttons, onClick } = this.props;
    if (buttons) {
      buttons.forEach(button => {
        buttonElements.push((
          <button
            type="button"
            key={button.label}
            button={button}
            onClick={e => {
              e.preventDefault();
              onClick(button);
            }}
            style={{ display: 'block' }}
          >
            {button.label}
          </button>
        ));
      });
    }

    return (
      <div>
        {buttonElements}
      </div>
    );
  }
}
