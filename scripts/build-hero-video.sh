#!/usr/bin/env bash
#
# Turn a source clip into the two hero files a generated brief needs:
#
#   public/brief/<slug>/hero.mp4         muted, seamless loop, ≤ ~2.5 MB
#   public/brief/<slug>/hero-poster.jpg  frame 0 of that loop, ≤ ~200 KB
#
# Usage: scripts/build-hero-video.sh <slug> <input.mp4> [start-seconds] [loop-seconds]
#        HERO_XFADE=2 lengthens the crossfade, HERO_LOOP=pingpong plays the
#        segment forward then back, HERO_WIDTH=1600 trades resolution for
#        the size cap.
#
# Two ways to loop. The default is a crossfade: the last second is faded into
# the first, so clouds keep rolling one way and light keeps moving one way. An
# orbiting camera cannot take that — the dissolve superimposes two angles of
# the same building — so HERO_LOOP=pingpong plays the segment forward and then
# in reverse instead; a slow drift reversing direction reads as the drone
# easing back, while a ghosted stadium reads as a mistake.
# The poster is cut from the encoded loop's first frame on purpose — it is the
# frame the video fades in over, and any other frame shows as a jump.
#
# Then add the entry to src/lib/fit-brief/hero-media.ts; the script prints the
# average colour of frame 0 as a starting point for `ground`.

set -euo pipefail

slug=${1:?usage: build-hero-video.sh <slug> <input.mp4> [start] [duration]}
input=${2:?usage: build-hero-video.sh <slug> <input.mp4> [start] [duration]}
start=${3:-0}
duration=${4:-10}
xfade=${HERO_XFADE:-1}
loop=${HERO_LOOP:-xfade}
width=${HERO_WIDTH:-1920}
fps=24
cap_bytes=$((2500 * 1024))

out_dir="public/brief/$slug"
mkdir -p "$out_dir"
video="$out_dir/hero.mp4"
poster="$out_dir/hero-poster.jpg"

src_len=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$input")
[ "${HERO_LOOP:-xfade}" = pingpong ] && xfade=0
need=$(python3 -c "print($start + $duration + $xfade)")
if python3 -c "import sys; sys.exit(0 if $src_len < $need else 1)"; then
  echo "input is ${src_len}s; need start + duration + ${xfade}s crossfade = ${need}s" >&2
  exit 1
fi

# One graph: normalise fps and size, then cut head / middle / tail and stitch
# middle + (tail faded into head). Output length is exactly $duration.
mid_start=$(python3 -c "print($start + $xfade)")
mid_end=$(python3 -c "print($start + $duration)")
tail_end=$(python3 -c "print($start + $duration + $xfade)")
head_end=$(python3 -c "print($start + $xfade)")

if [ "$loop" = pingpong ]; then
  # Forward, then the same frames backwards minus both end frames, so no frame
  # is held twice at the turn or across the loop point. Length is 2 × duration.
  frames=$(python3 -c "print(int(round($duration * $fps)))")
  filter="[0:v]fps=$fps,scale=$width:-2:flags=lanczos,trim=start=$start:end=$mid_end,setpts=PTS-STARTPTS,split[f][g];"
  filter+="[g]reverse,trim=start_frame=1:end_frame=$((frames - 1)),setpts=PTS-STARTPTS[r];"
  filter+="[f][r]concat=n=2:v=1:a=0[v]"
else
  filter="[0:v]fps=$fps,scale=$width:-2:flags=lanczos,split=3[a][b][c];"
  filter+="[a]trim=start=$mid_start:end=$mid_end,setpts=PTS-STARTPTS[mid];"
  filter+="[b]trim=start=$mid_end:end=$tail_end,setpts=PTS-STARTPTS[tail];"
  filter+="[c]trim=start=$start:end=$head_end,setpts=PTS-STARTPTS[head];"
  filter+="[tail][head]xfade=transition=fade:duration=$xfade:offset=0[loop];"
  filter+="[mid][loop]concat=n=2:v=1:a=0[v]"
fi

encode() {
  ffmpeg -v error -y -i "$input" -filter_complex "$filter" -map "[v]" \
    -an -c:v libx264 -preset slow -crf "$1" -profile:v high -pix_fmt yuv420p \
    -movflags +faststart "$video"
}

# Step the quantiser up until the clip fits the cap; 27 is where /fifa sits.
for crf in 27 29 31 33 35; do
  encode "$crf"
  size=$(stat -f %z "$video")
  if [ "$size" -le "$cap_bytes" ]; then break; fi
done
if [ "$size" -gt "$cap_bytes" ]; then
  echo "still $size bytes at crf $crf — rerun with HERO_WIDTH=1600 or a shorter loop" >&2
  exit 1
fi

ffmpeg -v error -y -i "$video" -frames:v 1 -q:v 6 "$poster"

# Average colour of frame 0 — a 1×1 area-scale is the mean of every pixel.
avg=$(ffmpeg -v error -i "$video" -frames:v 1 -vf scale=1:1:flags=area -f rawvideo -pix_fmt rgb24 - | xxd -p)

echo "video   $video  ($(( size / 1024 )) KB, crf $crf, $(ffprobe -v error -select_streams v -show_entries stream=width,height,r_frame_rate:format=duration -of csv=p=0 "$video" | tr '\n' ' '))"
echo "poster  $poster  ($(( $(stat -f %z "$poster") / 1024 )) KB)"
echo "frame-0 average colour: #$avg   (ground is usually a darker cousin of this)"
