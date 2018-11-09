#!/bin/bash -ex

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

dry_run=false
while [[ $# -gt 0 ]]; do
    key="$1"

    case $key in
        --dry-run)
        dry_run=true
        shift
        ;;
        *)
        shift
        ;;
    esac
done

# figure out the version currently in the contract
current_release="$(jq -r .version smart-player-contract.json)"

# assert that this version hasn't been used before
git fetch --tags
git show --name-only "$current_release" 2> /dev/null

if [[ $? -eq 0  ]]; then
  echo "It looks like version=${current_release} has already been cut."
  echo "Be sure to update the version number in smart-player-contract.json, and regenerate code."
  exit 1
fi

if [ "$dry_run" = true ]; then
    echo "Dry run deploy of nf-grapher version ${current_release}"
else
    echo "Deploying nf-grapher version ${current_release}"
fi

# tag
if [ "$dry_run" != true ]; then
    echo "Tagging git commit"
    git tag "$current_release"
    git push --tags
fi

# java deploy
echo "Deploying nf-grapher-java"
pushd java
mvn versions:set -DnewVersion="$current_release" -DgenerateBackupPoms=false

if [ "$dry_run" != true ]; then
    mvn clean deploy
fi
popd

# typescript deploy
echo "Deploying nf-grapher-typescript"
pushd js
npm version --no-git-tag-version -f "$current_release"

if [ "$dry_run" != true ]; then
    npm publish
fi
popd

# python deploy
echo "Deploying nf-grapher-python"
pushd python
python setup.py sdist

if [ "$dry_run" != true ]; then
    python setup.py sdist upload -r local
fi
popd

if [ "$dry_run" = true ]; then
    echo "Changes to your local repo are what would be deployed"
else
    echo "Successfully deployed! Ignore any changes to your local checkout"
fi
