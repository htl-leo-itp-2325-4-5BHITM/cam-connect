#!/usr/bin/env bash

# minikube install script for users, that have no root permissions
# restart terminal after running this.

DEST=~/.local/bin

mkdir -p $DEST
pushd $DEST
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && chmod +x kubectl
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && chmod +x minikube
chmod +x minikube
if [[ $PATH == *"$HOME/.local/bin"* ]]
then
echo "$PATH already contains bin"
else
cat <<EOF >> ~/.bashrc
# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/.local/bin" ] ; then
    PATH="$HOME/.local/bin":\$PATH
fi
EOF
fi
pwd 
ls -l .
popd


