#!/usr/bin/env bash

if [[ $# -eq 2 ]]
then
    echo $(kubectl get pods|grep $1|cut -d\  -f 1)
    POD=$(kubectl get pods|grep $1|cut -d\  -f 1)
    echo "port forward pod is $POD"
    kubectl port-forward $POD $2
else
    echo "usage: $0  <podname> <port:port>"
fi
