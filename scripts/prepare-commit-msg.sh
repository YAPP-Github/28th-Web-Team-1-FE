#!/bin/bash

commit_msg_file="$1"
commit_source="$2"

branch=$(git rev-parse --abbrev-ref HEAD)

issue=$(echo "$branch" | grep -oE '#[0-9]+')

if [[ -z "$issue" ]]; then
  exit 0
fi

current_msg=$(cat "$commit_msg_file")

if echo "$current_msg" | grep -qE "\($issue\)"; then
  exit 0
fi

first_line=$(echo "$current_msg" | head -1)
rest=$(echo "$current_msg" | tail -n +2)

if echo "$first_line" | grep -qE '\(#[0-9]+\)$'; then
  first_line=$(echo "$first_line" | sed -E 's/\(#[0-9]+\)$//')
fi

echo "${first_line} (${issue})" > "$commit_msg_file"
if [[ -n "$rest" ]]; then
  echo "$rest" >> "$commit_msg_file"
fi
