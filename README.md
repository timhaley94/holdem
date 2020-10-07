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

While you you could set up each individual piece of the system locally (i.e. server, client, redis, mongo) or start the system using `docker-compose`. We have provided a `scripts.sh` file which covers the fast majority of deverlopment cases.

To get started, run `./scripts.sh up`. Viola, [http:localhost:3000](http:localhost:3000).

This script supports hot reloading, so once you have it running, your
changes to `./client` and `./server` will be respected. However, if you ever need to force a
rebuild, run `./scripts.sh down` and then `./scripts.sh up`.

### scripts.sh

`scripts.sh` can take other arguments. A few options include:
- `up` stand up the system in the foreground (with logs)
- `up_background` stand up the system in the background (no logs)
- `down` bring the system down
- `lint` run the linter against both the client and server source code
- `test` run both the client and server test suites

For example, if you wanted to start the app and then run the test suite, you'd run:
```sh
./scripts.sh up_background
./scripts.sh test
```

### High level docs

We have a couple of diagrams to get a high level feel for the implementation:
- [Our technical stack](docs/diagrams/the_stack.png)
- [Our infrastructure](docs/diagrams/infrastructure.png)

## Contributing

1. Read [our contributing guide](docs/CONTRIBUTING.md)
2. Find a Github issues
3. Fork this repository (if you aren't a collaborator)
4. Open a pull request
