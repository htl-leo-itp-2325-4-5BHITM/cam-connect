# kubernetes deployment

For Demonstration the Deployment is done with 2 different methods:
-  we deploy the docker image from our own ghcr.io registry
- for the web application we use a standard nginx image that mounts the web-contents from a read only persistent volume. A Busybox - job mounts the volume for copying the web-content files to this volume when the deployment is done.

## Docker registry
create a personal access token with write packages permission in github.

Then login to ghcr.io from the command line using your github username as name and the generated access token as password

```bash
docker login ghcr.io
```

## nginx
nginx is configured to forward /api requests to quarkus. 
index.html and other files must be copied to the persistent volume nginx-www, then they are available in the browser.

## starting minikube
~~~bash
minikube start
~~~
on osx run:
~~~bash
minikube start --driver=hyperkit 
~~~

## deploy
NOTE: You must change caberger to your own github user name in ./deploy.sh

DO NOT FORGET: make the docker image public on ghcr.io

to forward nginx to localhost:
~~~bash
./port-forward.sh demo nginx 4200:80
~~~

## appsrv

Here the application server does not wait for the database in a loop. Instead the livenessProbe will fail an the situation is handled by the kube controller
