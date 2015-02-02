TEST_DIR="/home/develenv/projects/owd_test_cases/tests"

export SUITE_NUMBER
export TIME_INTERVAL=15;
CSV_FILE="coverage.csv"

get_length(){
	#Get the number of suites we have in the repository
	SUITE_NUMBER=0
	for dir in $dir_arr;
	do
		((SUITE_NUMBER++))
	done
}

check_csv_length(){
	#
	# This method ensures the CSV file has room enough for adding 
	# the new results. If there's no room, it deletes the results of 
	# the first day.
	#
	
	csv_length=`cat $CSV_FILE | wc -l`
	max_lines=`echo "$SUITE_NUMBER * $TIME_INTERVAL + 1" | bc`
	csv_gap=`echo "$csv_length + $SUITE_NUMBER" | bc` 
	
	if [ "$max_lines" -gt "$csv_length" ]
    then
    	# THERE'S STILL ROOM TO ADD THE NEW RESULTS"
    	fill_csv
    else
    	# NO ROOM TO ADD THE NEW RESULTS"
    	lines_to_keep=`echo "$max_lines - 1 - $SUITE_NUMBER" | bc`

		echo "SUITE,TESTS,DATE" > aux.csv    	
    	tail --lines $lines_to_keep $CSV_FILE >> aux.csv
    	mv aux.csv $CSV_FILE
    	fill_csv
    fi
}

fill_csv(){
	#
	# Dumps the current number of tests into the CSV file
	#
	for dir in $dir_arr;
	do
		num=`ls ${TEST_DIR}/${dir}/ | grep "^test_.*.py$" | wc -l`
		printf "%s,%s,%s\n" $dir $num $(date '+%d/%m') | tee -a $CSV_FILE
	done
}

#
# MAIN PROGRAM
#

#
# Get all the folders inside TEST_DIR
#
dir_arr=`ls -l $TEST_DIR | grep "^d"  | awk '{print $9}'`

#
# Erases irrelevant dirs
#
dir_arr=${dir_arr[@]/OTHER_FEATURES/}
dir_arr=${dir_arr[@]/_mock_data/}
dir_arr=${dir_arr[@]/_resources/}

#
# Do the thing
#
if [ ! -f $CSV_FILE ]
then
	printf "SUITE,TESTS,DATE\n" | tee -a $CSV_FILE
	fill_csv
else
	get_length
	check_csv_length
fi
