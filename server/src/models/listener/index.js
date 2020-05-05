const EventEmitter = require('events');

function create() {
  const emitter = new EventEmitter();
  const name = (id) => `update-${id}`;

  const subscribe = (id, fn) => {
    emitter.addListener(name(id), fn);
  };

  const unsubscribe = (id, fn) => {
    emitter.removeListener(name(id), fn);
  };

  const emit = (id, ...args) => {
    emitter.emit(name(id), ...args);
  };

  return {
    subscribe,
    unsubscribe,
    emit,
  };
}


module.exports = { create };
