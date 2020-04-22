import React from 'react';
import { useError } from '../../models';
import { Page } from '..';

const defaultMessage = `We're having trouble connecting to the server.`;

function Error() {
  const [error] = useError();
  return (
    <Page>
      <h1>Whoops!</h1>
      <p>{ error || defaultMessage } :/</p>
    </Page>
  );
}

export default Error;
