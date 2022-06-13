# if PLANETSCALE_SERVICE_TOKEN is not set, use pscale auth login
if [ -z "$PLANETSCALE_SERVICE_TOKEN" ]; then
    echo "Going to authenticate PlanetScale CLI, please follow the link displayed in your browser and confirm ..."
    pscale auth login
    # if command failed, exit
    if [ $? -ne 0 ]; then
        echo "pscale auth login failed, please try again"
        exit 1
    fi
fi
