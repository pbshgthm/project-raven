import csv, json

data=json.load(open('master_data.json'))

ashram=[]
with open('ashram_data.csv') as file:
    row=csv.reader(file)
    for i in row:
        ashram.append(i)


ref=json.load(open('child_key.json'))

ashram=ashram[1:]


ash_data={}

#no wage [0,0]
#monthly [w/4,1]
#weekly  [w,2]
#daily [w*7,3]
#one time [w*since/6,4]
#no info [-1,5]


for i in ashram:
	
	nb=i[11]
	ns=i[12]

	if nb=="":nb=-1
	if ns=="":ns=-1

	w=i[25]
	wx=i[26]

	wage=[-1,5]

	since=i[23]
	since_t=i[24]

	if since=="":since=0
	if since_t=='Months':
		since=int(since*30)
	if since_t=="":
		since=0;
	since=int(since)


	if w=="":
		wage=[-1,'u']

	else:
		w=int(w)

		if wx=='No Wage Earned':
			wage=[0,'n']

		if wx=='Monthly':
			wage=[w/4,'m']

		if wx=='Weekly':
			wage=[w,'w']

		if wx=='Daily':
			wage=[w*6,'d']

		if wx=='One Time':
			if since==0:
				wage=[-1,'u']
			else:
				wage=[int(w/(since/6)),'o']

		#if w>10000:
		#	wage=[-1,'u']


	ss=i[34]

	if ss=='Yes, but dropped out':ss="drop"
	elif ss=='Yes, and Continuing Education':ss="yes"
	elif ss=='No, Never went to school':ss="no"
	else:ss=''

	cl=i[37]
	if cl=="":cl=0

	if not i[0] in ref:
		continue

	since_age=i[30]
	if since_age=='':since_age=0
	since_age=int(since_age)
	if since_age>20:since_age=0
	


	inc=i[56].split('.')[0]
	if inc=='':inc=-1
	inc=int(inc)
	
	ash_data[ref[i[0]]]={
		'bro':nb,
		'sis':ns,
		'wage':wage,
		'school':ss,
		'class':cl,
		'work_s':since_age,
		'income':inc
	}

	


empty={
	'bro':-1,
	'sis':-1,
	'wage':[-1,'u'],
	'school':'',
	'class':0,
	'work_s':0,
	'income':-1

}


fin_data=[]
for i in data:
	if i['id'] in ash_data:
		extra=ash_data[i['id']]
	else:
		extra=empty

	i.update(extra)
	fin_data.append(i)


open('updated_data.json','w').write(json.dumps(fin_data,indent=4))