#!/bin/bash -ex

if echo $* | grep -e "--systems-go" -q; then
  systems_go=true
else
  systems_go=false
fi

if [ ! -d ".git" ]; then
    echo "expected to be run from the root project directory"
    exit 1
fi

if [ "$(git symbolic-ref HEAD 2> /dev/null)" != "refs/heads/master" ]; then
    echo "expected to be run on the master branch"
    exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
    echo "there are uncommitted changes; expected checkout to be clean"
    exit 1
fi

# figure out the version currently in the contract
current_version="$(jq -r .version smart-player-contract.json)"

echo "Current version in contract: ${current_version}"

# assert that this version hasn't been used before
git fetch --tags
if git show --name-only "$current_version" -- 2> /dev/null; then
  echo "It looks like version=${current_version} has already been cut."
  echo "Bump the version in smart-player-contract.json and run this script again."
  exit 1
fi

# # Regenerate to ensure determinism.
pushd tools/nf-gen-ts
npm run generate:all
popd

# Ensure that all generation is always up to date.
if [[ -n "$(git status --porcelain)" ]]; then
    echo "Code generation produced uncommitted changes. Commit these, merge to master, and run this script again."
    exit 1
fi

# tag
if [ "$systems_go" == true ]; then
    echo "Tagging HEAD and pushing to trigger a publish build."
    echo git tag "$current_version"
    echo git push --tags
fi

echo "Complete."
