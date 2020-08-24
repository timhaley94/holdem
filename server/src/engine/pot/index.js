function Pot({ users }) {
  return {
    value: 0,
    sidepot: null,
    users: users.map(
      ({ id, bankroll }) => ({
        id,
        bankroll,
      }),
    ),
  };
}

function bet() {

}

function fold() {

}