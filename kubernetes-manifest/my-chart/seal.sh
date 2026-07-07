#!/bin/bash

SECRET_NAME="$1"
NAMESPACE="$2"
OUTPUT_FILE="$3"

kubectl get secret "$SECRET_NAME" -n "$NAMESPACE" -o yaml | kubeseal --controller-name=sealed-secrets --controller-namespace=sealed-secret --format yaml > "$OUTPUT_FILE"