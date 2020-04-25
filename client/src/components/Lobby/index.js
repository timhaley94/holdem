import React from 'react';
import { Button } from '@material-ui/core';
import { useAPI } from '../../models';
import styles from './index.module.css';

function Lobby() {
  const {
    game,
    playerId,
    setReady
  } = useAPI();

  return (
    <div className={ styles.container }>
      {
        game
          && game.players
          ? Object.values(game.players).map(
            player => (
              <div key={ player.playerId }>
                <p>{ player.data.name }</p>
                <Button
                  disabled={ player.isReady }
                  onClick={
                    playerId === player.playerId
                      ? () => setReady(!player.isReady)
                      : null
                  }
                >
                  {
                    player.data.isReady
                      ? 'Ready!'
                      : 'Ready?'
                  }
                </Button>
              </div>
            )
          )
          : null
      }
    </div>
  );
}

export default Lobby;
