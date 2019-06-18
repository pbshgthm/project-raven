import json


dist_data=[]
with open('ch_loc.json') as file:
    dist_data=json.loads(file.read())


full_data=[]
with open('ch_full_loc.json') as file:
    full_data=json.loads(file.read())



dist_dict={}
for i in dist_data:
    dist_dict[i['id']]={
                        'n_d_crd':i['n_crd'],
                        'n_d_add':i['n_add'],
                        'r_d_crd':i['r_crd'],
                        'r_d_add':i['r_add']
                        }



for i in full_data:
    #print(full_data.index(i),int(i['id'][2:]))
    if not full_data.index(i) == int(i['id'][2:])-1:print(i['id'])
    if i['id'] in dist_dict:
        d_dict=dist_dict[i['id']]
    else:
        d_dict={
                'n_d_crd':'',
                'n_d_add':'',
                'r_d_crd':'',
                'r_d_add':''
                }
    i.update(d_dict)


print(full_data[0])



with open('master.json','w') as file:
    file.write(json.dumps(full_data,indent=4))

crds={'n_d':[],'r_d':[],'n_p':[],'r_p':[],'n_v':[],'r_v':[]}
for i in full_data:
    crds['n_d'].append(i['n_d_crd'])
    crds['r_d'].append(i['r_d_crd'])

    crds['n_p'].append(i['n_p_crd'])
    crds['r_p'].append(i['r_p_crd'])

    crds['n_v'].append(i['n_v_crd'])
    crds['r_v'].append(i['r_v_crd'])



#with open('heatmap2.json','w') as file:
#    file.write(json.dumps(crds))
