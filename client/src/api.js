import Axios, {
  get,
  post,
  patch,
} from 'axios';
import config from './config';

const usersRoute = `${config.serverUrl}/users`;
const roomsRoute = `${config.serverUrl}/rooms`;
const gamesRoute = `${config.serverUrl}/games`;

const opts = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const Users = {
  create: ({ secret }) => post(
    `${usersRoute}`,
    { secret },
  ),
  auth: ({ id, secret }) => post(
    `${usersRoute}/auth`,
    { id, secret },
  ),
  update: ({ id, token, ...data }) => patch(
    `${usersRoute}/${id}`,
    { ...data },
    opts(token),
  ),
};

const Rooms = {
  list: () => get(`${roomsRoute}`),
  retrieve: ({ id }) => get(`${roomsRoute}/${id}`),
  create: ({ name, isPrivate }) => post(
    `${roomsRoute}`,
    { name, isPrivate },
  ),
  setReady: ({
    id,
    token,
    userId,
    isReady,
  }) => patch(
    `${roomsRoute}/${id}/players/${userId}`,
    { isReady },
    opts(token),
  ),
  join: ({ id, token }) => post(
    `${roomsRoute}/${id}/players`,
    {},
    opts(token),
  ),
  leave: ({ id, token, userId }) => Axios.delete(
    `${roomsRoute}/${id}/players/${userId}`,
    {},
    opts(token),
  ),
};

const Games = {
  retrieve: ({ id }) => get(`${gamesRoute}/${id}`),
  makeMove: ({ id, token, ...data }) => post(
    `${gamesRoute}/${id}/moves`,
    data,
    opts(token),
  ),
};

export {
  Users,
  Rooms,
  Games,
};
