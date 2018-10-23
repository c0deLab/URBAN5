import React from 'react';

export default class Menu extends React.Component {

  render() {
    var buttonElements = [];

    if (this.props.buttons) {
      this.props.buttons.forEach((button, index) => {
        buttonElements.push((<button 
            key={index} 
            button={button} 
            onClick={(e) => {
              e.preventDefault();
              this.props.onClick(button);
            }}
            style={{display: 'block'}}
          >{button.label}</button>));
      });
    }

    return (
      <div>
        {buttonElements}
      </div>
    );
  }
}
