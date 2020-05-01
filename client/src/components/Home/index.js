import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSocket } from '../../models';
import Button from '../Button';
import SmallPage from '../SmallPage';
import styles from './index.module.css';

function Home() {
  const { push } = useHistory();
  const { createGame, game } = useSocket();
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
    <SmallPage>
      <h1 className={styles.header}>
        Texas Hold&apos;em!
      </h1>
      <Button size="large" onClick={onClick}>
        Create Game
      </Button>
    </SmallPage>
  );
}

export default Home;
