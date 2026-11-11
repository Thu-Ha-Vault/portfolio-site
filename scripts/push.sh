#!/bin/bash
# Push local commits of the website and the Cyclistic repo to GitHub (account lucynguyen777).
# A push to portfolio-site main redeploys thuha.ceovanta.com automatically (GitHub Actions).
# Run in Terminal:  bash ~/Desktop/Sky/portfolio-site/scripts/push.sh
set -e
gh auth switch -u lucynguyen777
trap 'gh auth switch -u nguyentthuha1702' EXIT   # back to the account used by the Sky_Vault repo
for repo in cyclistic-case-study portfolio-site; do
  echo "== $repo"
  git -C ~/Desktop/Sky/$repo -c credential.helper= -c "credential.helper=!gh auth git-credential" push origin main
done
echo "Done. Deploy progress: https://github.com/lucynguyen777/portfolio-site/actions"
