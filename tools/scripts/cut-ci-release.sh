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

# read -p "Next version (must match current version! format: x.x.x): " next_release

# ensure it's roughly a valid version
# node -p 'assert.equal(/^\d+\.\d+\.\d+/.exec(process.argv[1]).length, 1)' "${next_release}" 2> /dev/null

# if [[ $? -ne 0 ]]; then
#   echo "Invalid version number=${next_release}"
#   echo "Version number must be of the form x.x.x, such as 3.4.5 or 2.678.3."
#   exit 1
# fi

# assert that this version hasn't been used before
git fetch --tags
if git show --name-only "$current_version" -- 2> /dev/null; then
  echo "It looks like version=${current_version} has already been cut."
  echo "Bump the version in smart-player-contract.json and run this script again."
  exit 1
fi

# # Set new version
# node -e 'p="./smart-player-contract.json";c=JSON.parse(fs.readFileSync(p));c.version=process.argv[1];fs.writeFileSync(p,JSON.stringify(c, null, "  "))' "${next_release}"

# # Regenerate ?
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
    echo git tag "$next_release"
    echo git push --tags
fi

echo "Complete."
