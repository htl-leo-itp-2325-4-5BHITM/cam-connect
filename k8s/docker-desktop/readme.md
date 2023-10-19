# Running the dashboard for kubernetes on Docker Desktop

## Installing the dashboard
[Deploy and Access the Kubernetes Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/) describes how to install the dashboard.
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
```

To create the admin-user apply [dashboard-user.yaml](./dashboard-user.yaml):
```bash
kubectl apply -f dashboard-user.yaml
```

# Opening the Dashboard

1. create a token by:
```bash
kubectl -n kubernetes-dashboard create token admin-user
```
copy the output to the clipboard
2. start the proxy by runnings
```bash
kubectl proxy
```

3. then the dashboard can be reached [here](http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/).