import json


loc_data=[]
with open('ch_loc.json') as file:
    loc_data=json.loads(file.read())

crds={'n':[],'r':[]}
for i in loc_data:
    crds['n'].append(i['n_crd'])
    crds['r'].append(i['r_crd'])


with open('heatmap.json','w') as file:
    file.write(json.dumps(crds))
