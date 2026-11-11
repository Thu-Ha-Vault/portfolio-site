#!/bin/bash
# Rebuild the self-hosted fonts in public/fonts from the Google Fonts sources (SIL OFL 1.1).
# Static instances only, subset to Latin + Vietnamese, no hinting: a page loads ~4 faces of ~20 KB each.
# Needs fonttools + brotli:  python3 -m venv /tmp/fv && /tmp/fv/bin/pip install fonttools brotli
# Usage: FONTTOOLS_BIN=/tmp/fv/bin bash scripts/build-fonts.sh
set -e
BIN=${FONTTOOLS_BIN:?set FONTTOOLS_BIN to the bin folder that has fonttools and pyftsubset}
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/fonts"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
cd "$TMP"
get() { curl -sfL --max-time 120 -o "$2" "https://github.com/google/fonts/raw/main/ofl/$1"; }
get "notoserifdisplay/NotoSerifDisplay%5Bwdth,wght%5D.ttf" nsd.ttf
get "notoserifdisplay/NotoSerifDisplay-Italic%5Bwdth,wght%5D.ttf" nsd-italic.ttf
for w in Regular Medium SemiBold Italic; do get "bevietnampro/BeVietnamPro-$w.ttf" "bvp-$w.ttf"; done

# Latin-1, Latin Extended-A, Vietnamese, punctuation, arrows and a few symbols used in headings.
U="U+0000-00FF,U+0100-017F,U+01A0-01A1,U+01AF-01B0,U+0300-0309,U+0323,U+02C6,U+02DA,U+02DC,U+1EA0-1EF9,U+2010-2027,U+2030-203A,U+20AB-20AC,U+2122,U+2190-2195,U+2212,U+2264-2265"
sub() { "$BIN/pyftsubset" "$1" --unicodes="$U" --no-hinting --flavor=woff2 --output-file="$OUT/$2.woff2" ${3:+"$3"}; }
inst() { "$BIN/fonttools" varLib.instancer "$1" wght="$2" wdth="$3" -o inst.ttf -q && sub inst.ttf "$4"; }

inst nsd.ttf 400 100 noto-serif-display-400
inst nsd.ttf 300 100 noto-serif-display-300
inst nsd.ttf 650 75 noto-serif-display-650-condensed
inst nsd-italic.ttf 400 100 noto-serif-display-italic-400
for w in Regular Medium SemiBold Italic; do sub "bvp-$w.ttf" "be-vietnam-pro-$(echo $w | tr 'A-Z' 'a-z')" --layout-features+=tnum; done
ls -la "$OUT"/*.woff2
