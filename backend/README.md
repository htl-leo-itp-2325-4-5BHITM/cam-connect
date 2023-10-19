# Demo Backend

This is a backend that demonstrates the basics of an Elipse Microprofile REST Server that uses JPA to access a relational database. Its purpose is to give an introduction to using quarkus. 

To give a smooth start to readers who com from other fields than quarkus or Jakarta EE we made some decisions for didactical reasons:
- the application has a *main* entypoint. This is not strictly required, but is familiar to users that are only used to console applications.
- we do not (yet) use [reactive](https://quarkus.pro/guides/getting-started-reactive.html)
- we do not use Panache but pure JPA. Panache will be uses later to reduce the boilerplate code in data access objects later
- we use http port 0.0.0.0 from the start so that the application server listens on all addresses of its host and so can be accessed used in a variety of ways in serveral deployments. This reduces time for tracking problems.

- This example also shows how to correctly respond to HTTP - POST requests, i.e. with a 201 created Response code and a "Location" header, that contains the URI for the new created resource. See "Testing" below and the UserResource.java file.

## building a docker image

We use [jib](https://quarkus.io/guides/container-image) to build a container image with:

~~~bash
mvn clean install
docker image ls
~~~

## Testing

Open [api.rest](./api/api.rest) int the HTTP Rest client of your development environment and try the requests.


## Optional (unused): using the minikube registry
In order to make docker accept pushing images to this registry, we have to redirect port 5000 on the docker virtual machine over to port 5000 on the minikube machine. We can (ab)use docker’s network configuration to instantiate a container on the docker’s host, and run socat there (see [minikube documentation](https://minikube.sigs.k8s.io/docs/handbook/registry/)):
~~~bash
docker run --rm -it --network=host alpine ash -c "apk add socat && socat TCP-LISTEN:5000,reuseaddr,fork TCP:$(minikube ip):5000"
~~~
After the image is pushed, refer to it by localhost:5000/{name} in kubectl specs.



