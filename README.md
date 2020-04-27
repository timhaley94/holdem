<h1 align="center">Hold'em</h1>

<p align="center">
  <a href="https://codeclimate.com/github/timhaley94/holdem/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/b4b31a8f8cf13a23ca93/maintainability" />
  </a>
  <a href="https://codeclimate.com/github/timhaley94/holdem/test_coverage">
    <img src="https://api.codeclimate.com/v1/badges/b4b31a8f8cf13a23ca93/test_coverage" />
  </a>
</p>

## Directory structure

```
holdem/
  .circleci/        --> CI/CD configuration
  client/           --> Client (React) code
  infrastructure/   --> Infrastructure (Terraform) code
  server/           --> Server (Node.js) code
```

## Running locally

Pull this repository using `git clone` and then verify you have
[node.js](https://nodejs.org/en/) v12.16.2 installed. You can check using your node
version using `node --version` in the terminal.

### Launch the server

Change into the server directory with `cd server`. Install dependencies using
`npm install`. Start the server using `npm run dev`. To verify it's running, check
that `curl http://localhost:80/ping` returns a 200.

### Launch the client

Change into the client directory with `cd ../client`. Install dependencies using
`npm install`. Start the server using `npm run dev`. This will automatically open
a browser tab.

## Production builds

Only the client needs to be "built" for production. You can create a production
build of the client by running `npm run build` in the client directory. This
creates a (gitignore'd) directory `client/build` which is the production build.

Since static websites are just files, you can serve this directory for anywhere
to "deploy" the website.

## Contributing

Check Github issues for what to work on, fork this repository, and then open a
pull request to get your code integrated.
