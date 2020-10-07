up () {
  docker-compose up --scale server=2
}

up_background () {
  docker-compose up -d --scale server=2
}

down () {
  docker-compose down
}

status () {
  docker-compose ps
}

lint_client () {
  docker-compose exec client npm run lint
}

lint_server () {
  docker-compose exec server npm run lint
}

lint () {
  lint_client
  lint_server
}

test_client () {
  docker-compose exec client npm run test
}

test_client_watch () {
  docker-compose exec client npm run test-watch
}

test_server () {
  docker-compose exec server npm run test
}

test_server_watch () {
  docker-compose exec server npm run test-watch
}

test () {
  test_client
  test_server
}

case "$1" in
  up)
    up
    ;;
  up_background)
    up_background
    ;;
  down)
    down
    ;;
  status)
    status
    ;;
  lint_client)
    lint_client
    ;;
  lint_server)
    lint_server
    ;;
  lint)
    lint
    ;;
  test_client)
    test_client
    ;;
  test_server)
    test_server
    ;;
  test_client_watch)
    test_client_watch
    ;;
  test_server_watch)
    test_server_watch
    ;;
  test)
    test
    ;;
  *)
    echo $"Basic usage: $0 {up|down|status|lint|test}"
    exit 1
esac