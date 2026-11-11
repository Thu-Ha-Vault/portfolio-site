#!/bin/bash
# One-time setup: create the two public repos on GitHub account lucynguyen777, push, and turn on GitHub Pages.
# Run in Terminal:  bash ~/Desktop/Sky/portfolio-site/scripts/publish-github.sh
set -e
ACCOUNT=lucynguyen777
gh auth switch -u "$ACCOUNT"
push() { git -c credential.helper= -c "credential.helper=!gh auth git-credential" push -u origin main; }

echo "== cyclistic-case-study"
cd ~/Desktop/Sky/cyclistic-case-study
gh repo view "$ACCOUNT/cyclistic-case-study" >/dev/null 2>&1 || \
  gh repo create "$ACCOUNT/cyclistic-case-study" --public --description "Google Data Analytics capstone: how casual riders and annual members use a bike-share differently (6.13M rides, DuckDB + Python)"
git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$ACCOUNT/cyclistic-case-study.git"
push

echo "== portfolio-site"
cd ~/Desktop/Sky/portfolio-site
gh repo view "$ACCOUNT/portfolio-site" >/dev/null 2>&1 || \
  gh repo create "$ACCOUNT/portfolio-site" --public --description "Personal site: projects and a knowledge blog synced from an Obsidian vault (thuha.ceovanta.com)"
git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$ACCOUNT/portfolio-site.git"
push
gh api -X POST "repos/$ACCOUNT/portfolio-site/pages" -f build_type=workflow >/dev/null 2>&1 || true
gh api -X PUT "repos/$ACCOUNT/portfolio-site/pages" -f cname=thuha.ceovanta.com -f build_type=workflow
gh workflow run deploy.yml -R "$ACCOUNT/portfolio-site" || true

gh auth switch -u nguyentthuha1702   # back to the account used by the Sky_Vault repo
echo "Done. Build progress: https://github.com/$ACCOUNT/portfolio-site/actions"
