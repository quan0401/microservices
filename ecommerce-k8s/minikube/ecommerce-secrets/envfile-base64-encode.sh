#!/bin/bash
echo "Enter file path:"
read file_path
while read p; do
  key=$(echo "$p" | sed 's/=.*//g')
  value=$(echo "$p" | sed 's/.*=//g')
  based64_value=$(echo -n "$value" | base64)
  echo "$key: $based64_value"
done <"$file_path"