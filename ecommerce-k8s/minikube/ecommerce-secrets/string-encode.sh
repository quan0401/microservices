#!/bin/bash
key=$(echo "$1" | sed 's/=.*//g')
value=$(echo "$1" | sed 's/.*=//g')
based64_value=$(echo -n "$value" | base64)
echo "result:"
echo "$based64_value"