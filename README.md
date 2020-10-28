<h1 align="center">Hold'em Hounds</h1>

<p align="center">
  <a href="https://codeclimate.com/github/timhaley94/holdem/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/b4b31a8f8cf13a23ca93/maintainability" />
  </a>
  <a href="https://codeclimate.com/github/timhaley94/holdem/test_coverage">
    <img src="https://api.codeclimate.com/v1/badges/b4b31a8f8cf13a23ca93/test_coverage" />
  </a>
  <a href="https://circleci.com/gh/timhaley94/holdem">
    <img src="https://circleci.com/gh/timhaley94/holdem.svg?style=shield" />
  </a>
</p>

Born of the pandemic, Hold'em Hounds is an (🚧 in development 🚧) poker app that's aiming to
bring a fresh perspective to a crowded field of garish, clunky apps, desparate to suck you
into microtransactions.

## Product priorities

Hold'em Hounds should be...

- Multiplayer
- Free to play
- Real time
- Account optional
- Download optional
- Not too serious
- Beautiful

## Directory structure

```
holdem/
  .circleci/        --> CI/CD configuration
  client/           --> Client (React) code
  infrastructure/   --> Infrastructure (Terraform) code
  server/           --> Server (Node.js) code
```

## Development

While you you could set up each individual piece of the system locally (i.e. server, client, mongo, redis)
the easiest way to run the project is through `docker-compose`. First make sure you have `docker` and
`docker-compose` installed. Then you can use the `scripts.sh` file which takes a variety of subcommands:

We have a `scripts.sh` file which takes a includes a number of subcommands. Some options are:
- `up` stand up the system in the foreground (with logs)
- `up_background` stand up the system in the background (no logs)
- `down` bring the system down
- `build` force a fresh build of the docker images/containers
- `rm` remove stopped containers

For example, to get the app up and running, run `./scripts.sh up` and then, viola,
[http:localhost:3000](http:localhost:3000).

The `docker-compose` configuration supports hot reloading, so once you have it running, your
changes to `./client` and `./server` will be respected. However, if you ever need to force a
rebuild: `./scripts build`.

### Testing and linting

In order to lint the source code or run the test suite, you'll need to run `npm install` in the
directory in question (i.e. `client` or `server`) and then run either `npm run test` or `npm run lint`.

### High level docs

We have a couple of diagrams to get a high level feel for the implementation:
- [Our technical stack](docs/diagrams/the_stack.png)
- [Our infrastructure](docs/diagrams/infrastructure.png)

## Contributing

1. Read [our contributing guide](docs/CONTRIBUTING.md)
2. Find a Github issues
3. Fork this repository (if you aren't a collaborator)
4. Open a pull request
