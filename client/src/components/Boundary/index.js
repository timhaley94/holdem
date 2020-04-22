import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { useError } from '../../models';

class Boundary extends Component {
  componentDidCatch(error, errorInfo) {
    this.props.fire(error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}

Boundary.propTypes = {
  fire: PropTypes.func.isRequired
};

function WrappedBoundary({ children }) {
  const [, setError] = useError();
  return (
    <Boundary fire={ setError }>
      { children }
    </Boundary>
  );
}

export default WrappedBoundary;
