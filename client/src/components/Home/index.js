import React, { useState } from 'react';
import { Card } from '@material-ui/core';
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
        <h1 className={styles.header}>
          Texas Hold&apos;em!
        </h1>
        <Button
          size="large"
          onClick={() => setShowModal(true)}
        >
          Create Game
        </Button>
        <Games />
      </Card>
    </Page>
  );
}

export default Home;
