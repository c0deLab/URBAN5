import React from 'react';
import PropTypes from 'prop-types';

/* global document */

/** Class for the top of the screen where text interaction with URBAN5 takes place */
export default class TextInput extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  state = {
    value: ''
  };

  componentDidMount() {
    this.input = document.getElementById('speak');
    this.input.addEventListener('keydown', this.handleKeyDown);
    this.input.focus();
  }

  componentWillUnmount() {
    this.input.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = event => {
    if (event.keyCode === 13) { // Is 'Enter'
      this.handleSubmit();
    }
    switch (event.keyCode) {
      default:
        break;
    }
  };

  handleChange = event => {
    const val = event.target.value;
    // const last = val[val.length - 1];
    // const start = val.substring(0, val.length - 2);
    // const actualVal = `${start}${last}_`;
    const actualVal = val;
    this.setState({ value: actualVal });
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const { value } = this.state;

    onSubmit(value);
    this.setState({ value: '' });
  };

  render() {
    const { value } = this.state;

    return (
      <div>
        <input type="text" id="speak" autoComplete="off" spellCheck="false" value={value} onChange={this.handleChange} />
      </div>
    );
  }
}
