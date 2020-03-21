#!/bin/bash

node $(dirname "$0")/../../../src/scripts/cli_repeat_inventory.js $(cat $(dirname "$0")/project_path.txt)
