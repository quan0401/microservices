#!/bin/bash

for file in *.ts; do
    interface_name=$(grep -E "^export\s+interface\s+\w+" "$file" | awk '{print $3}')

    echo "$interface_name"
    echo "$file"
done
