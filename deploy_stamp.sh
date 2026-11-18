#!/bin/sh
# stamp every page with the current build and write build.txt (run before each push)
T=$(date +%s)
echo $T > build.txt
for f in $(grep -rl "review_shim.js" --include=*.html . | grep -v "^./old"); do
  if grep -q 'name="gbb-build"' "$f"; then sed -i "s/<meta name=\"gbb-build\" content=\"[0-9]*\">/<meta name=\"gbb-build\" content=\"$T\">/" "$f";
  else sed -i "s#<script src=\"\(\.\./\)\{0,1\}review_shim.js#<meta name=\"gbb-build\" content=\"$T\"><script src=\"\1review_shim.js#" "$f"; fi
done
