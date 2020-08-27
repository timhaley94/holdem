const listFields = [
  'id',
  'name',
  'isPrivate',
  'isStarted',
  'userCount',
];

const detailFields = [
  ...listFields,
  'users',
  'tableId',
];

const renderers = {
  isStarted: ({ tableId }) => !!tableId,
  userCount: async ({ users }) => Object.values(users).length,
  users: async ({ users }) => {
    const data = await Promise.all(
      Object.entries(users).map(
        async ([id, user]) => {
          const userData = await Users.retrieve({ id });
          return {
            ...userData,
            player: user.player,
          };
        },
      ),
    );

    return data.reduce(
      (acc, user) => ({
        ...acc,
        [user.id]: user,
      }),
      {},
    );
  },
};

const render = async (game, useListView) => {
  const fields = (
    useListView
      ? listFields
      : detailFields
  );

  const entries = await Promise.all(
    fields.map(
      async (field) => {
        const value = (
          renderers[field]
            ? await renderers[field](game)
            : game[field]
        );

        return [field, value];
      },
    ),
  );

  return entries.reduce(
    (acc, [field, value]) => ({
      ...acc,
      [field]: value,
    }),
    {},
  );
};