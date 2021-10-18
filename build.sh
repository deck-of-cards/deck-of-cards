#!/bin/bash

build_no="$1"
build_args="--compress"

if [ -z "$build_no" ]; then
   echo "Usage: $0 <build number>"
   exit 1
fi
tag1="registry.library.oregonstate.edu/researchdeck:osulp-${build_no}"
latest=`echo $tag1 | sed -e "s/:osulp-${build_no}/:latest/"`

echo "Building for tag $tag1"
docker build ${build_args} . -t "$tag1"

if [ "$?" -ne 0 ]; then
   echo "Build for $tag1 failed"
   exit 1
fi

echo "Logging into BCR as admin"
echo admin | docker login --password-stdin registry.library.oregonstate.edu

echo "pushing: $tag1"
docker push "$tag1"

if [ "$?" -ne 0 ]; then
   echo "Push of $tag1 failed"
   exit 1
fi

echo "Updating :latest tag to :osulp-${build_no}"
docker tag $tag1 $latest
docker push "$latest"
echo "$build_no" > .version
