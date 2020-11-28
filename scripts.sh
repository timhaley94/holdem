up () {
  docker-compose up --scale server=2
}

rebuild() {
  docker-compose rm -f
  docker-compose build
}

shell() {
  docker-compose exec server sh
}

# prod_ssh() {

# }

case "$1" in
  up)
    up
    ;;
  rebuild)
    rebuild
    ;;
  shell)
    shell
    ;;
  prod_ssh)
    prod_ssh
    ;;
  *)
    echo $"Basic usage: $0 {up|rebuild|shell|prod_ssh}"
    exit 1
esac