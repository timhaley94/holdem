up () {
  docker-compose up --scale server=2
}

up_background () {
  docker-compose up -d --scale server=2
}

build() {
  docker-compose build
}

down () {
  docker-compose down
}

status () {
  docker-compose ps
}

rm () {
  docker-compose rm
}

case "$1" in
  up)
    up
    ;;
  up_background)
    up_background
    ;;
  build)
    build
    ;;
  down)
    down
    ;;
  status)
    status
    ;;
  rm)
    rm
    ;;
  *)
    echo $"Basic usage: $0 {up|down|status}"
    exit 1
esac