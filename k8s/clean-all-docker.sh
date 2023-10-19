#!/usr/bin/env bash
# reset your docker to a clean state

docker container prune --force
docker image prune --force
docker volume prune --force
echo "rmi..."
docker rmi -f $(docker images -q)

docker image ls
docker container ls
docker volume ls
