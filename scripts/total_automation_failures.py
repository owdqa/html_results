from CSVParser import *

# This parameter specifies the ROWS of previous data that we have to skip before
# the CSV file starts
ROWS_TO_JUMP = 1

# It is necessary to specify the labels of our CSS so that it can be processed right
labels = ["START_TIME","DATE","TEST_SUITE","TEST_CASES_PASSED",
          "FAILURES","AUTOMATION_FAILURES","UNEX_PASSES","KNOWN_BUGS","EX_PASSES",
          "IGNORED","UNWRITTEN","PERCENT_FAILED","DEVICE","VERSION","BUILD","TEST_DETAILS"]

# CSV file to be processed
file = 'total_csv_file.csv'

# We just have to call to our super parser, stating the file, the labels, and the rows
# to be skipped
parser = CSVParser(file, labels, ROWS_TO_JUMP)

# FILTER PROCESS: This labels are gonna be the ones to the new file
filterLabels = ["DATE","TEST_SUITE","TEST_CASES_PASSED","AUTOMATION_FAILURES","BUID"]
parser.filterColumns(filterLabels)


# parser.filterRows({"BUILD_NUMBER": "==20"})

#WRITE PROCESS: just specify the path to the file. It does not have to exist
parser.write("/tmp/total_automation_failures.csv")

