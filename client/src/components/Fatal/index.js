import React from 'react';
import { useError } from '../../models';
import { SmallPage } from '..';

const defaultMessage = `We're having trouble connecting to the server.`;

function Error() {
  const [error] = useError();
  return (
    <SmallPage>
      <h1>Whoops!</h1>
      <p>{ error || defaultMessage } :/</p>
    </SmallPage>
  );
}

export default Error;
