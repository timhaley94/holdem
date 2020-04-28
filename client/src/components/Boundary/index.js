import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { useError } from '../../models';

class Boundary extends Component {
  componentDidCatch(error, errorInfo) {
    const { fire } = this.props;
    fire(error, errorInfo);
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

Boundary.propTypes = {
  fire: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

function WrappedBoundary({ children }) {
  const [, setError] = useError();
  return (
    <Boundary fire={setError}>
      { children }
    </Boundary>
  );
}

WrappedBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default WrappedBoundary;
