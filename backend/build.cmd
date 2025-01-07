./mvnw package -DskipTests
docker build --tag ghcr.io/elyanuki/camconnect-backend .
docker push ghcr.io/elyanuki/camconnect-backend
