import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { useAPI } from '../../models';
import styles from './index.module.css';

const text = `Mauris accumsan non orci ac tincidunt. Aliquam erat volutpat. Etiam laoreet sem at euismod mollis. Fusce est ex, scelerisque in molestie vitae, vestibulum ac libero. Donec ornare augue tincidunt, sagittis orci et, aliquet augue. Aenean rutrum eget dolor at dictum. Aliquam fringilla scelerisque felis. Quisque auctor pharetra consectetur. Pellentesque vulputate nisl ut felis malesuada luctus.`;


function Home() {
  const { push } = useHistory();
  const { createGame, game } = useAPI();
  const [isCreating, setIsCreating] = useState(false);

  const onClick = () => {
    createGame();
    setIsCreating(true);
  };

  useEffect(() => {
    if (isCreating && game) {
      push(`/game/${game.id}`);
    }
  }, [isCreating, game, push]);

  return (
    <div className={ styles.container }>
      <h1>Texas Hold'em!</h1>
      <p>{ text }</p>
      <Button
        size="large"
        variant="contained"
        onClick={ onClick }
      >
        Create
      </Button>
    </div>
  );
}

export default Home;
