./mvnw package -DskipTests
docker build --tag ghcr.io/elyanuki/camconnect-backend .
docker compose up