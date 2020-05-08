const EventEmitter = require('events');

function create() {
  const emitter = new EventEmitter();

  const globalName = 'global';
  const updateName = (id) => `update-${id}`;

  const listen = (fn) => {
    emitter.addListener(
      globalName,
      fn,
    );
  };

  const subscribe = (id, fn) => {
    emitter.addListener(
      updateName(id),
      fn,
    );
  };

  const unsubscribe = (id, fn) => {
    emitter.removeListener(
      updateName(id),
      fn,
    );
  };

  const emit = (id, ...args) => {
    emitter.emit(
      globalName,
      id,
      ...args,
    );

    emitter.emit(
      updateName(id),
      ...args,
    );
  };

  return {
    listen,
    subscribe,
    unsubscribe,
    emit,
  };
}


module.exports = { create };
