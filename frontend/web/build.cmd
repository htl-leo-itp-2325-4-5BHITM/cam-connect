npm run build
docker build --tag ghcr.io/elyanuki/camconnect-web --file docker/Dockerfile .
docker push ghcr.io/elyanuki/camconnect-web
