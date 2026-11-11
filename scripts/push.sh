#!/bin/bash
# Push local commits of the website and the case-study repos to GitHub (account lucynguyen777).
# A repo that does not exist on GitHub yet is created (public) on the first run.
# A push to portfolio-site main redeploys thuha.ceovanta.com automatically (GitHub Actions).
# Run in Terminal:  bash ~/Desktop/Sky/portfolio-site/scripts/push.sh
set -e
ACCOUNT=lucynguyen777
gh auth switch -u "$ACCOUNT"
trap 'gh auth switch -u nguyentthuha1702' EXIT   # back to the account used by the Sky_Vault repo

# local folder | GitHub repo name | description (used only when the repo is created)
REPOS=(
  "cyclistic-case-study|cyclistic-case-study|Google Data Analytics capstone: how casual riders and annual members use a bike-share differently (6.13M rides, DuckDB + Python)"
  "track-b-case-study|dengue-vietnam-case-study|Dengue in Vietnam: when and where the season hits, and whether rain gives early warning (64 provinces, OpenDengue + NASA POWER, Python)"
  "portfolio-site|portfolio-site|Personal site: projects and a knowledge blog synced from an Obsidian vault (thuha.ceovanta.com)"
)
for entry in "${REPOS[@]}"; do
  IFS='|' read -r dir name desc <<< "$entry"
  cd ~/Desktop/Sky/"$dir"
  echo "== $dir → $ACCOUNT/$name"
  gh repo view "$ACCOUNT/$name" >/dev/null 2>&1 || gh repo create "$ACCOUNT/$name" --public --description "$desc"
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$ACCOUNT/$name.git"
  git -c credential.helper= -c "credential.helper=!gh auth git-credential" push -u origin main
done
echo "Done. Deploy progress: https://github.com/$ACCOUNT/portfolio-site/actions"
