#!/bin/bash
NAMESPACE=$1
IMAGE=$2
IS_PR=$3

# Eliminar namespace en Kubernetes
kubectl delete namespace $NAMESPACE

# Si es un PR, eliminar la imagen de Docker Hub
if [ "$IS_PR" = "true" ]; then
    echo "🗑️ Eliminando imagen de Docker Hub: $IMAGE"

    # Extraer el tag de la imagen
    IMAGE_NAME=$(echo $IMAGE | cut -d':' -f1)
    IMAGE_TAG=$(echo $IMAGE | cut -d':' -f2)

    # Obtener el token de autenticación en Docker Hub
    TOKEN=$(curl -s -H "Content-Type: application/json" -X POST -d \
        '{"username": "'"$DOCKER_HUB_USER"'", "password": "'"$DOCKER_HUB_PASS"'"}' \
        https://hub.docker.com/v2/users/login/ | jq -r .token)

    # Eliminar la imagen del Docker Hub
    curl -s -X DELETE -H "Authorization: Bearer $TOKEN" \
        "https://hub.docker.com/v2/repositories/$IMAGE_NAME/tags/$IMAGE_TAG/"

    echo "✅ Imagen eliminada de Docker Hub: $IMAGE_NAME:$IMAGE_TAG"
else
    echo "⚠️ No se elimina la imagen porque no es un entorno de PR."
fi
