#! /bin/bash

NAMESPACE=workshop-ziad

helm upgrade --install ziad-praxis-form . --create-namespace -n $NAMESPACE