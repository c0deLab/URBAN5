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
    this.refs.input.addEventListener('keydown', this.handleKeyDown);
    setTimeout(() => { // delay focus for mouse click event to pass by
      this.refs.input.focus();
    }, 0);
  }

  componentDidUpdate() {
    this.refs.input.focus();
  }

  componentWillUnmount() {
    this.refs.input.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = event => {
    if (event.keyCode === 13) { // Is 'Enter'
      this.handleSubmit();
    }
  };

  handleChange = event => {
    const val = event.target.value;
    const actualVal = val;
    this.setState({ value: actualVal });
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const { value } = this.state;

    this.setState({ value: '' });
    onSubmit(value);
  };

  render() {
    const { value } = this.state;

    return (
      <div>
        <input ref="input" type="text" id="speak" autoComplete="off" autoFocus={true} spellCheck="false" value={value} onChange={this.handleChange} />
      </div>
    );
  }
}
