#!/usr/bin/env bash

kubectl config set-context --current --namespace student-c-aberger
kubectl delete configmap download-webcontent || echo "not yet installed"
kubectl create configmap download-webcontent --from-file=download-webcontent.sh
