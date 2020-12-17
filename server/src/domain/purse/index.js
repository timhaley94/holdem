const { Schema } = require('mongoose');
const config = require('../../config');
const { Errors } = require('../../modules');

const DEFAULT_BANKROLL = config.game.defaultBankroll;

const schema = new Schema({
  bankroll: Number,
  wagered: Number,
  winnings: Number,
});

function create(bankroll = DEFAULT_BANKROLL) {
  return {
    bankroll,
    wagered: 0,
  };
}

function bet(purse, value) {
  if (value < 0) {
    throw new Errors.BadRequest('Cannot bet negative value');
  }

  return {
    ...purse,
    wagered: Math.min(
      purse.bankroll,
      purse.wagered + value,
    ),
  };
}

function allIn(purse) {
  return {
    ...purse,
    wagered: purse.bankroll,
  };
}

function win(purse, winnings) {
  return {
    ...purse,
    winnings,
  };
}

function isBankrupt({ bankroll }) {
  return bankroll <= 0;
}

function isAllIn({ wagered, bankroll }) {
  if (isBankrupt({ bankroll })) {
    return false;
  }

  return wagered >= bankroll;
}

function resolve({ bankroll, wagered, winnings }) {
  return bankroll - wagered + winnings;
}

module.exports = {
  DEFAULT_BANKROLL,
  schema,
  create,
  bet,
  allIn,
  win,
  isBankrupt,
  isAllIn,
  resolve,
};
