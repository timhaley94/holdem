import React from 'react';
import { useError } from '../../state';

const defaultMessage = 'We\'re having trouble connecting to the server.';

function Error() {
  const [error] = useError();
  return (
    <div>
      <h1>Whoops!</h1>
      <p>
        { error || defaultMessage }
        {' '}
        :/
      </p>
    </div>
  );
}

export default Error;
