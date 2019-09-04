import csv,json
from datetime import datetime, timedelta


data=json.load(open('updated_data.json'))

master=[[
		'id',
		'age',
		'start_age',
		'r_date',
		't_date',
		'dur',
		'raid_v_name',
		'raid_v_add',
		'raid_v_crd',
		'native_v_name',
		'native_v_add',
		'native_v_crd',
		'indst',
		'income',
		'wage_week',
		'wage_type',
		'paypar',
		'paramt',
		'brought',
		'sisters',
		'brothers',
		'school',
		'class'

]
]




for i in data:
	a=[]
	r = datetime.strptime(i['r_date'], "%d/%m/%Y")
	
	if i['since'] == -1:t=""
	else:
		t=r - timedelta(days=i['since'])
		t=t.strftime('%d/%m/%Y')

	a.append(i['id'])
	a.append(i['age'])
	a.append(i['work_s'])

	a.append(i['r_date'])
	a.append(t)
	a.append(i['since'])

	a.append(i['raid']['vil']['name'])
	a.append(i['raid']['vil']['add'])
	a.append(str(i['raid']['vil']['crd'])[1:-1])
	
	a.append(i['native']['vil']['name'])
	a.append(i['native']['vil']['add'])
	a.append(str(i['native']['vil']['crd'])[1:-1])
	
	a.append(i['indst'])
	a.append(i['income'])
	a.append(i['wage'][0])
	a.append(i['wage'][1])
	a.append(i['paypar'])
	a.append(i['paramt'])
	a.append(i['brought'])
	a.append(i['bro'])
	a.append(i['sis'])
	a.append(i['school'])
	a.append(i['class'])
		
	master.append(a)

with open('new.csv', 'w') as csvFile:
    writer = csv.writer(csvFile)
    writer.writerows(master)

csvFile.close()



open('fin_data.json','w').write(json.dumps(master,indent=4))
