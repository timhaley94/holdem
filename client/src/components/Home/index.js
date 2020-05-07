import React, { useState } from 'react';
import { Card } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Button from '../Button';
import Create from '../Create';
import Games from '../Games';
import Page from '../Page';
import styles from './index.module.css';

function Home() {
  const [showModal, setShowModal] = useState(false);

  return (
    <Page>
      <Create
        open={showModal}
        onClose={() => setShowModal(false)}
      />
      <Card className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Public Games</h2>
          <Button
            className={styles.button}
            size="large"
            onClick={() => setShowModal(true)}
            startIcon={<AddIcon />}
          >
            Create Game
          </Button>
        </div>
        <div className={styles.content}>
          <Games />
        </div>
      </Card>
    </Page>
  );
}

export default Home;
