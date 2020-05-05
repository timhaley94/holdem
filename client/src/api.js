import { get, post, patch } from 'axios';
import config from './config';

const userRoute = `${config.serverUrl}/api/users`;
const gameRoute = `${config.serverUrl}/api/games`;

const opts = (token) => ({ headers: `Bearer ${token}` });

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
