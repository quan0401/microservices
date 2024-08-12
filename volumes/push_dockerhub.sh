#!/bin/bash

images=$(docker image ls | grep quan0401/ecommerce | awk '{print $1}') 

for i in $images
do
  echo "Pushing $i to DockerHub"
  docker push $i
done