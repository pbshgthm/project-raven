import csv, json, datetime



cData=[]
with open('raw/master_data.csv') as file:
    row=csv.reader(file)
    for i in row:
        cData.append(i)






fields=[
'child_id',
'child_name',
'father_name',
'age',
'raid_date',
'raid_location',
'raid_district',
'raid_police_station',
'raid_state',
'rescue_mode',
'native_address',
'native_village',
'native_police_station',
'native_district',
'native_state',
'native_pin',
'country',
'employer_name',
'factory_name',
'factory_address',
'industry',
'task',
'who_got_child_name',
'who_got_child_relation',
'child_employer_relation',
'backwages_amount',
'parents_took_money',
'parents_took_amount',
'child_working_since'
]


who_got_child={
    '1':'employer',
    '2':'middle_man',
    '3':'parents',
    '4':'relatives',
    '5':'self',
    '':''
}

ptm={
        'No, Parents received no Money':'no',
        'Yes, received as Loan && Advance':'loan&advance',
        'Yes, received as Advance':'advance',
        'Yes, received as Loan':'loan',
        'Not Known':'unknown',
        '':''
}



child_data_raw=[]
for i in cData[1:]:
    row={}
    for j in range(len(i)-1):
        row[fields[j]]=i[j]
    row['who_got_child_relation']=who_got_child[row['who_got_child_relation']]
    row['child_working_since']=row['child_working_since']+'_'+i[-1]
    row['parents_took_money']=ptm[row['parents_took_money']]
    child_data_raw.append(row)


#with open('child_data.json','w') as file:
#    file.write(json.dumps(child_data_raw,indent=4))


child_data_raw.sort(key=lambda x: datetime.datetime.strptime(x['raid_date'], '%d/%m/%Y'))
clean_data=[]

emp_list=[]
ch_ind=0
for i in child_data_raw:
    if i['age'] =='':continue
    if int(i['age']) > 19:continue

    ch_ind+=1
    row={}

    row['id']='CH'+str(ch_ind).zfill(6)
    row['age']=int(i['age'])

    row['r_date']=i['raid_date']
    row['r_vil']=i['raid_location']
    row['r_ps']=i['raid_police_station']
    row['r_dist']=i['raid_district']
    row['r_state']=i['raid_state']

    row['n_vil']=i['native_village']
    row['n_ps']=i['native_police_station']
    row['n_dist']=i['native_district']
    row['n_state']=i['native_state']




    if i['employer_name'] == "" :
        print(ch_ind)
        row['emp_ind']=""
    else:
        if not i['employer_name'] in emp_list:
            emp_list.append(i['employer_name'])
        row['emp_ind']='EM'+str(emp_list.index(i['employer_name'])+1).zfill(6)

    row['indst']=i['industry']
    row['task']=i['task']

    row['brought']=i['who_got_child_relation']
    row['emrel']=i['child_employer_relation']
    row['bckwg']=i['backwages_amount']
    row['paypar']=i['parents_took_money']
    row['paramt']=i['parents_took_amount']

    sinceDays=i['child_working_since'].split('_')[0]
    sinceScale=i['child_working_since'].split('_')[1]
    if sinceDays=='':sinceDays=-1

    if sinceScale =='Days':sinceDays=int(sinceDays)
    elif sinceScale =='Months':sinceDays=int(sinceDays)*30
    elif sinceScale =='Years':sinceDays=int(sinceDays)*365
    elif sinceScale =='':sinceDays=-1
    else: print(sinceScale)

    row['since']=sinceDays

    clean_data.append(row)



print(clean_data[0])
print(len(clean_data))


with open('clean_master.json','w') as file:
    file.write(json.dumps(clean_data,indent=4))
