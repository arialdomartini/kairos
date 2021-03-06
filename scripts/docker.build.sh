#!/bin/bash

VERSION=${1:-'0.0.0'}
ENVIRONMENT=${2:-'LOCAL'}

case $ENVIRONMENT in
    LOCAL)
        REGISTRY='192.168.205.100'
    ;;
    PROD)
        REGISTRY='registry.kairos.rocks'
    ;;
    *)
        echo Wrong Environment $ENVIRONMENT
        exit 1
    ;;
esac

echo building ${VERSION} for registry ${REGISTRY}
docker build -f ./src/Kairos.Web.App/Dockerfile -t ${REGISTRY}/kairos/web.app:${VERSION} .
docker build -f ./src/Kairos.Web.Api/Dockerfile -t ${REGISTRY}/kairos/web.api:${VERSION} .
echo built
