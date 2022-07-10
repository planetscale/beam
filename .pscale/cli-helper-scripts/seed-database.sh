#!/bin/bash

BRANCH_NAME=${BRANCH_NAME:-"main"}

. use-pscale-docker-image.sh

. authenticate-ps.sh

. set-db-and-org-and-branch-name.sh

# copy directory ../seed-data to a random diretory name in /tmp
TMP_DIR=$(mktemp -d --tmpdir=/tmp pscale-seed-data-XXXXXXXXXX)
cp -r ../seed-data/* $TMP_DIR/
cd $TMP_DIR

# add a prefix from variable DB_NAME to all .sql files in the temp seed directory when renaming them to fit the database name
for file in $(ls *.sql); do
  mv ${file} ${DB_NAME}.${file}
done

# seed the database with the data using pscale database restore-dump
pscale database restore-dump ${DB_NAME} ${BRANCH_NAME} --org ${ORG_NAME} --dir ${TMP_DIR}

# remove the temporary directory
cd ..
rm -rf $TMP_DIR





