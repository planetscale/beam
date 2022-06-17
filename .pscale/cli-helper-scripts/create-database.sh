#!/bin/bash

BRANCH_NAME=${BRANCH_NAME:-"main"}

. use-pscale-docker-image.sh

# At the moment, service tokens do not allow DB creations or prod branch promotions, hence not using the service token.
unset PLANETSCALE_SERVICE_TOKEN
. authenticate-ps.sh

. set-db-and-org-and-branch-name.sh
. wait-for-branch-readiness.sh

pscale database create "$DB_NAME" --region us-east --org "$ORG_NAME"
# check if DB creation worked
if [ $? -ne 0 ]; then
  echo "Failed to create database $DB_NAME"
  exit 1
fi

# If BRANCH_NAME was not set to main, we need to create the branch
if [ "$BRANCH_NAME" != "main" ]; then
  pscale branch create "$BRANCH_NAME" --org "$ORG_NAME"
  if [ $? -ne 0 ]; then
    echo "Failed to create branch $BRANCH_NAME"
    exit 1
  fi
fi

wait_for_branch_readiness 10 "$DB_NAME" "$BRANCH_NAME" "$ORG_NAME" 30

# grant service token permission to use the database if service token is set
if [ -n "$PLANETSCALE_SERVICE_TOKEN_ID" ]; then
  echo "Granting access to new database for service tokens ..."
  pscale service-token add-access "$PLANETSCALE_SERVICE_TOKEN_ID" approve_deploy_request connect_branch create_branch create_comment create_deploy_request delete_branch read_branch read_deploy_request connect_production_branch  --database "$DB_NAME" --org "$ORG_NAME"
fi

. create-branch-connection-string.sh

create-branch-connection-string  "$DB_NAME" "$BRANCH_NAME" "$ORG_NAME" "creds-${BRANCH_NAME}" "share"
