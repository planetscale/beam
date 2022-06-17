function wait_for_branch_readiness {
    local retries=$1
    local db=$2
    local branch=${3,,}
    local org=$4
    
    # check whether fifth parameter is set, otherwise use default value
    if [ -z "$5" ]; then
        local max_timeout=60
    else
        local max_timeout=$5
    fi

    local count=0
    local wait=1

    echo "Checking if branch $branch is ready for use..."
    while true; do
        local raw_output=`pscale branch list $db --org $org --format json`
        # check return code, if not 0 then error
        if [ $? -ne 0 ]; then
            echo "Error: pscale branch list returned non-zero exit code $?: $raw_output"
            return 1
        fi
        local output=`echo $raw_output | jq ".[] | select(.name == \"$branch\") | .ready"`
        # test whether output is false, if so, increase wait timeout exponentially
        if [ "$output" == "false" ]; then
            # increase wait variable exponentially but only if it is less than max_timeout
            if [ $((wait * 2)) -le $max_timeout ]; then
                wait=$((wait * 2))
            else
                wait=$max_timeout
            fi  

            count=$((count+1))
            if [ $count -ge $retries ]; then
                echo "Branch $branch is not ready after $retries retries. Exiting..."
                return 2
            fi
            echo "Branch $branch is not ready yet. Retrying in $wait seconds..."
            sleep $wait
        elif [ "$output" == "true" ]; then
            echo "Branch $branch is ready for use."
            return 0
        else
            echo "Branch $branch in unknown status: $raw_output"
            return 3
        fi
    done
}