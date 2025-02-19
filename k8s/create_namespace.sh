#!/bin/bash

PR_NUMBER=$1  # Número del PR recibido como argumento

if [ -z "$PR_NUMBER" ]; then
    echo "❌ Debes proporcionar el número del Pull Request."
    exit 1
fi

NAMESPACE="pr-${PR_NUMBER}"

echo "🚀 Creando namespace: ${NAMESPACE}"
kubectl create namespace $NAMESPACE
