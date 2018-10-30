import React from 'react';
import PropTypes from 'prop-types';

export default class Menu extends React.PureComponent {
  propTypes = {
    buttons: PropTypes.array.isRequired
  }

  render() {
    const buttonElements = [];

    const { buttons, onClick } = this.props;
    if (buttons) {
      buttons.forEach(button => {
        buttonElements.push((<button
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
        </button>));
      });
    }

    return (
      <div>
        {buttonElements}
      </div>
    );
  }
}
