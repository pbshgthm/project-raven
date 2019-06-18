import json, requests



api_url='https://geocoder.api.here.com/6.2/geocode.json?\
responseattributes=none&locationattributes=none%2Car&gen=9\
&app_id=oauTasEavzggDxpgTOJD&app_code=ssniJWlEDlNtElcjMBgjtw&searchtext='



data=[]
with open ('master.json') as file:
    data=json.loads(file.read())


incomp={'n_v':0,'n_p':0,'n_d':0,'r_v':0,'r_p':0,'r_d':0}



def extract_loc(place):
    geo=place['DisplayPosition']
    crd=(geo['Latitude'],geo['Longitude'])
    add=place['Address']['Label']
    return({'crd':crd,'add':add})


for i in data:
    if not i['n_v_add'] == "":
        if not i['n_v_add'][-5:] == "India":
            data[data.index(i)]['n_v_add']=""
            data[data.index(i)]['n_v_crd']=""

    if not i['n_p_add'] == "":
        if not i['n_p_add'][-5:] == "India":
            data[data.index(i)]['n_p_add']=""
            data[data.index(i)]['n_p_crd']=""

    if not i['n_d_add'] == "":
        if not i['n_d_add'][-5:] == "India":
            data[data.index(i)]['n_d_add']=""
            data[data.index(i)]['n_d_crd']=""


    if not i['r_v_add'] == "":
        if not i['r_v_add'][-5:] == "India":
            data[data.index(i)]['r_v_add']=""
            data[data.index(i)]['r_v_crd']=""

    if not i['r_p_add'] == "":
        if not i['r_p_add'][-5:] == "India":
            data[data.index(i)]['r_p_add']=""
            data[data.index(i)]['r_p_crd']=""

    if not i['r_d_add'] == "":
        if not i['r_d_add'][-5:] == "India":
            data[data.index(i)]['r_d_add']=""
            data[data.index(i)]['r_d_crd']=""







new_data=[]
for i in data:
    print(i["id"])
    child=i
    if i['n_v_crd'] == "":
        print(i['n_vil'])


        nv=requests.get(api_url+i['n_vil']+','+i['n_state']+', India').json()['Response']['View']
        if len(nv) == 0:
            child['n_v_crd']=""
            child['n_v_add']=""
        else:
            n_v=extract_loc(nv[0]["Result"][0]['Location'])
            child['n_v_crd']=n_v['crd']
            child['n_v_add']=n_v['add']

    if i['n_p_crd'] == "":
        print(i['n_ps'])


        np=requests.get(api_url+i['n_ps']+','+i['n_state']+', India').json()['Response']['View']
        if len(np) == 0:
            child['n_p_crd']=""
            child['n_p_add']=""
        else:
            n_p=extract_loc(np[0]["Result"][0]['Location'])
            child['n_p_crd']=n_p['crd']
            child['n_p_add']=n_p['add']

    if i['n_d_crd'] == "":
        print(i['n_dist'])


        nd=requests.get(api_url+i['n_dist']+','+i['n_state']+', India').json()['Response']['View']
        if len(nd) == 0:
            child['n_d_crd']=""
            child['n_d_add']=""
        else:
            n_d=extract_loc(nd[0]["Result"][0]['Location'])
            child['n_d_crd']=n_d['crd']
            child['n_d_add']=n_d['add']





    if i['r_v_crd'] == "":
        print(i['r_vil'])


        rv=requests.get(api_url+i['r_vil']+','+i['r_state']+', India').json()['Response']['View']
        if len(rv) == 0:
            child['r_v_crd']=""
            child['r_v_add']=""
        else:
            r_v=extract_loc(rv[0]["Result"][0]['Location'])
            child['r_v_crd']=r_v['crd']
            child['r_v_add']=r_v['add']

    if i['r_p_crd'] == "":
        print(i['r_ps'])


        rp=requests.get(api_url+i['r_ps']+','+i['r_state']+', India').json()['Response']['View']
        if len(rp) == 0:
            child['r_p_crd']=""
            child['r_p_add']=""
        else:
            r_p=extract_loc(np[0]["Result"][0]['Location'])
            child['r_p_crd']=r_p['crd']
            child['r_p_add']=r_p['add']

    if i['r_d_crd'] == "":
        print(i['r_dist'])


        rd=requests.get(api_url+i['r_dist']+','+i['r_state']+', India').json()['Response']['View']
        if len(rd) == 0:
            child['r_d_crd']=""
            child['r_d_add']=""
        else:
            r_d=extract_loc(rd[0]["Result"][0]['Location'])
            child['r_d_crd']=r_d['crd']
            child['r_d_add']=r_d['add']


    new_data.append(child)
    with open('partial_compile.json','w') as file:
        file.write(json.dumps(new_data,indent=4))
