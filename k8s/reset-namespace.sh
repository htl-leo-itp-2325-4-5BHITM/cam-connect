#!/usr/bin/env bash

if [ -z "$1" ]
then
    echo "set the current namespace"
    echo "usage $0 <namespace> [delete]"
    exit 1
fi

if [[ "$2." == "delete." ]]
then
    kubectl delete namespace $1 > /dev/null 2>&1 || echo "namespace did not exist, let us continue..."
    kubectl create namespace $1
fi
kubectl config set-context --current --namespace $1

