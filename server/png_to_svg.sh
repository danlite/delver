fullfilename="$1"
filename=$(basename "$fullfilename")
extension="${filename##*.}"
filename="${filename%.*}"
convert $fullfilename -alpha extract -negate -alpha on -transparent white $filename.pnm
potrace $filename.pnm -s -o masks/$filename.svg
rm $filename.pnm
