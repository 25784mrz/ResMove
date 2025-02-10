file="box_document"
while getopts "f:" opt 
do
	case $opt in
		f ) file=$OPTARG;;
		? ) echo "invalid param"
			usage
			exit 1;;
	esac
done

echo "开始移动资源"
node ./scripts/moveRes/moveRes.ts -f $file
echo "移动资源结束"