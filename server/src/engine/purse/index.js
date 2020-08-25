const config = require('../../config');
const Errors = require('../errors');

const DEFAULT_BANKROLL = config.engine.defaultBankroll;

function create(bankroll = DEFAULT_BANKROLL) {
  return {
    bankroll,
    wagered: 0,
  };
}

function bet(purse, value) {
  if (value < 0) {
    throw new Errors.RequestError('Cannot bet negative value');
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

function resolve(purse, winnings) {
  return {
    ...purse,
    wagered: 0,
    bankroll: purse.bankroll - purse.wagered + winnings,
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

module.exports = {
  DEFAULT_BANKROLL,
  create,
  bet,
  allIn,
  resolve,
  isBankrupt,
  isAllIn,
};
