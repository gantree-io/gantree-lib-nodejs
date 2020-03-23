#!/bin/bash

node $(cat $(dirname "$0")/gantree_path.txt)/src/scripts/cli_repeat_inventory.js $(cat $(dirname "$0")/project_path.txt)
