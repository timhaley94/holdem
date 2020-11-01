up () {
  docker-compose up --scale server=2
}

rebuild() {
  docker-compose rm -f
  docker-compose build
}

case "$1" in
  up)
    up
    ;;
  rebuild)
    rebuild
    ;;
  *)
    echo $"Basic usage: $0 {up|rebuild}"
    exit 1
esac