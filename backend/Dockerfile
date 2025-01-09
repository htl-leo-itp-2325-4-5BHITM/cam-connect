FROM eclipse-temurin:17-jre

RUN mkdir -p /opt/application
COPY ./target/*-runner.jar /opt/application/backend.jar
#CMD ["sleep", "1000"]
#CMD [ "java", "-jar", "backend.jar" ]
CMD ["sh", "-c", "echo '\n10.191.112.13\tauth.htl-leonding.ac.at\n' >> /etc/hosts && java -jar backend.jar"]
WORKDIR /opt/application