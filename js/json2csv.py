import json
import csv

data=json.load(open('data.json','r'))


with open('data.csv', 'w') as csvfile:
    spamwriter = csv.writer(csvfile, delimiter=',')
    for i in data:
    	spamwriter.writerow(i)
    