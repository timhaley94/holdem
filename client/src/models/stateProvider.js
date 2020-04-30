import React from 'react';
import PropTypes from 'prop-types';
import { ErrorProvider } from './error';
import { MetadataProvider } from './metadata';

function StateProvider({ children }) {
  return (
    <MetadataProvider>
      <ErrorProvider>
        { children }
      </ErrorProvider>
    </MetadataProvider>
  );
}

StateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StateProvider;
