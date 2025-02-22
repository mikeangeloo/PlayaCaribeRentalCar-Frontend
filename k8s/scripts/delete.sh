#!/bin/bash
NAMESPACE=$1
IMAGE=$2
IS_PR=$3  # Recibimos si es PR o no (true/false)

# Eliminar namespace
kubectl delete namespace $NAMESPACE

# Si es un entorno efímero de PR, eliminamos la imagen de Docker Hub
if [ "$IS_PR" = "true" ]; then
    echo "Eliminando imagen de Docker Hub: $IMAGE"
    docker rmi $IMAGE
    docker login -u $DOCKER_HUB_USER -p $DOCKER_HUB_PASS
    docker push --delete $IMAGE  # Comando para eliminar la imagen en Docker Hub
else
    echo "No se elimina la imagen porque no es un entorno de PR."
fi
