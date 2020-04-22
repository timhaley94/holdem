import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { useAPI } from '../../models';
import { Page } from '..';
import styles from './index.module.css';

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
    <Page>
      <h1 className={ styles.header }>Texas Hold'em!</h1>
      <Button
        size="large"
        variant="contained"
        onClick={ onClick }
      >
        Create Game
      </Button>
    </Page>
  );
}

export default Home;
