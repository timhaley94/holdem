import React from 'react';
import PropTypes from 'prop-types';
import { ErrorProvider } from '../error';
import { MetadataProvider } from '../metadata';

function Provider({ children }) {
  return (
    <MetadataProvider>
      <ErrorProvider>
        { children }
      </ErrorProvider>
    </MetadataProvider>
  );
}

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Provider;
