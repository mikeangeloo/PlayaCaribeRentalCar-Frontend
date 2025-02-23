#!/bin/bash
NAMESPACE=$1
IMAGE=$2
BACKEND_URL=$3

# Exportamos variables para ser utilizadas por envsubst
export NAMESPACE IMAGE BACKEND_URL

# Crear el namespace si no existe
envsubst < k8s/templates/namespace.yaml | kubectl apply -f -

# Aplicar los manifiestos con las variables inyectadas
envsubst < k8s/templates/deployment.yaml | kubectl apply -f -
envsubst < k8s/templates/service.yaml | kubectl apply -f -
