import { get, post, patch } from 'axios';
import config from './config';

const userRoute = `${config.serverUrl}/users`;
const gameRoute = `${config.serverUrl}/games`;

const opts = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const Users = {
  create: ({ secret }) => post(
    `${userRoute}`,
    { secret },
  ),
  auth: ({ id, secret }) => post(
    `${userRoute}/auth`,
    { id, secret },
  ),
  update: ({ id, token, metadata }) => patch(
    `${userRoute}/${id}`,
    { metadata },
    opts(token),
  ),
};

const Games = {
  list: () => get(`${gameRoute}`),
  retrieve: ({ id }) => get(`${gameRoute}/${id}`),
  create: ({ name, isPrivate }) => post(
    `${gameRoute}`,
    { name, isPrivate },
  ),
};

export { Users, Games };
