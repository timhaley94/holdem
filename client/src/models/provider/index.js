import React from 'react';
import { ErrorProvider, MetadataProvider } from '..';

export function Provider({ children }) {
  return (
    <MetadataProvider>
      <ErrorProvider>
        { children }
      </ErrorProvider>
    </MetadataProvider>
  )
}
