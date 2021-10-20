#!/bin/bash
#
# Convert an SVG file to a PDF file by using headless Chrome.
# Ref: https://gist.github.com/s417-lama/84bf66de1096c4587e8187092fb41684

if [ $# -ne 2 ]; then
  echo "Usage: ./svg2pdf.bash input.svg output.pdf" 1>&2
  exit 1
fi

INPUT=$1
OUTPUT=$2

HTML="
<html>
  <head>
    <style>
body {
  margin: 0;
}
    </style>
    <script>
function init() {
  const element = document.getElementById('targetsvg');
  const positionInfo = element.getBoundingClientRect();
  const height = positionInfo.height;
  const width = positionInfo.width;
  const style = document.createElement('style');
  style.innerHTML = \`@page {margin: 0; size: \${width}px \${height}px}\`;
  document.head.appendChild(style);
}
window.onload = init;
    </script>
  </head>
  <body>
    <img id=\"targetsvg\" src=\"${INPUT}\">
  </body>
</html>
"

tmpfilename=$(sha256sum $INPUT | awk '{print $1}')
tmpfile=$(mktemp $tmpfilename.html)
trap "rm -f $tmpfile" EXIT
echo $HTML > $tmpfile

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --headless --disable-gpu --print-to-pdf=$OUTPUT $tmpfile >>render.log 2>&1
rm $INPUT