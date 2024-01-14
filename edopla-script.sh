#!/bin/bash

###################################################################################################
# Bash script to start/stop the edopla docker containers.                                         #
###################################################################################################

# Error statement
RED=$(tput setaf 1)
REG=$(tput sgr0)
error_message="${RED}Invalid input. Please try again.${REG}"

while true; do
    # Ask the user if they want to start or stop Docker containers
    read -p "Do you want to start or stop Docker containers? (start/stop/exit): " choice

    # Starting Docker containers
    if [[ "$choice" == "start" ]]; then
        # Ask the user for the environment variable
        while true; do
            read -p "Enter the environment (dev/prod/test): " ENV
            if [[ "$ENV" == "dev" || "$ENV" == "prod" || "$ENV" == "test" ]]; then
                break
            else
                echo -e "$error_message"
            fi
        done

        # Ask the user for the debug variable
        while true; do
            read -p "Enter the debug mode (true/false): " DEBUG
            if [[ "$DEBUG" == "true" || "$DEBUG" == "false" ]]; then
                break
            else
                echo -e "$error_message"
            fi
        done

        # Launch Docker container with the provided arguments
        ENV=$ENV DEBUG=$DEBUG docker-compose -p edopla up -d
        break

    # Stopping Docker containers
    elif [[ "$choice" == "stop" ]]; then
        ENV="dev" DEBUG="false" docker-compose -p edopla down
        break

    # Exit the script
    elif [[ "$choice" == "exit" ]]; then
        break

    else
        echo -e "$error_message"
    fi
done
