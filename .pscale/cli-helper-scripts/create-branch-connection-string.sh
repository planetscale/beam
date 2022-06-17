function create-branch-connection-string {
    local DB_NAME=$1
    local BRANCH_NAME=$2
    local ORG_NAME=$3
    local CREDS=${4,,}
    local secretshare=$5

    # delete password if it already existed
    # first, list password if it exists
    local raw_output=`pscale password list "$DB_NAME" "$BRANCH_NAME" --org "$ORG_NAME" --format json `
    # check return code, if not 0 then error
    if [ $? -ne 0 ]; then
        echo "Error: pscale password list returned non-zero exit code $?: $raw_output"
        exit 1
    fi

    local output=`echo $raw_output | jq -r "[.[] | select(.display_name == \"$CREDS\") ] | .[0].id "`
    # if output is not "null", then password exists, delete it
    if [ "$output" != "null" ]; then
        echo "Deleting existing password $output"
        pscale password delete --force "$DB_NAME" "$BRANCH_NAME" "$output" --org "$ORG_NAME"
        # check return code, if not 0 then error
        if [ $? -ne 0 ]; then
            echo "Error: pscale password delete returned non-zero exit code $?"
            exit 1
        fi
    fi
    
    local raw_output=`pscale password create "$DB_NAME" "$BRANCH_NAME" "$CREDS" --org "$ORG_NAME" --format json`
    
    if [ $? -ne 0 ]; then
        echo "Failed to create credentials for database $DB_NAME branch $BRANCH_NAME: $raw_output"
        exit 1
    fi

    local DB_URL=`echo "$raw_output" |  jq -r ". | \"mysql://\" + .id +  \":\" + .plain_text +  \"@\" + .database_branch.access_host_url + \"/\""`

read -r -d '' SECRET_TEXT <<EOF
DATABASE_URL=${DB_URL}/${DB_NAME}?sslaccept=strict
EOF

    # if not running in CI
    if [ -z "$CI" ]; then
        echo "Please copy file .env.example to .env and set the value of DATABASE_URL to your newly created PlanetScale database like this:" 
        echo "$SECRET_TEXT"
    elif [ -n "$secretshare" ]; then
        # store the DB URL in secret store
        echo "::notice ::Please follow the link in the next line and click on 'Read the Secret!' to see the secret, branch specific connection string for various frameworks."
        local link=`curl -s -X POST -d "plain&secret=$SECRET_TEXT" https://shared-secrets-planetscale.herokuapp.com/`
        echo "$link"
        echo "::set-output name=CONNECTION_STRING_LINK::${link}"
    fi
    echo
    echo "Alternatively, you can connect to your new branch like this:"
    echo "pscale shell \"$DB_NAME\" \"$BRANCH_NAME\" --org \"$ORG_NAME\""
    echo "or, to create a local tunnel to the database:"
    echo "pscale connect \"$DB_NAME\" \"$BRANCH_NAME\" --org \"$ORG_NAME\""
    export MY_DB_URL=$DB_URL
}