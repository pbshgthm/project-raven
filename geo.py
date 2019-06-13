import requests
import json

api_url='https://geocoder.api.here.com/6.2/geocode.json?\
responseattributes=none&locationattributes=none%2Car&gen=9\
&app_id=oauTasEavzggDxpgTOJD&app_code=ssniJWlEDlNtElcjMBgjtw&searchtext='


with open('data/clean_master.json') as file:
    data=json.loads(file.read())


print(len(data))



def extract_loc(place):
    #print(place)
    geo=place['DisplayPosition']
    crd=(geo['Latitude'],geo['Longitude'])
    add=place['Address']['Label']
    return({'crd':crd,'add':add})


child_data=[]
for i in data:
    child=i
    print(child['id'])


    '''
    nr = requests.get(api_url+child['n_dist']+','+child['n_state']).json()['Response']['View']
    if len(nr) == 0:
        print('Native not found : ', child['id'])
        continue
    rr = requests.get(api_url+child['r_dist']+','+child['r_state']).json()['Response']['View']
    if len(rr) == 0:
        print('Raid not found : ', child['id'])
        continue


    native=extract_loc(nr[0]["Result"][0]['Location'])
    child['n_crd']=native['crd']
    child['n_add']=native['add']

    raid=extract_loc(rr[0]["Result"][0]['Location'])
    child['r_crd']=raid['crd']
    child['r_add']=raid['add']
    '''

    nv=requests.get(api_url+child['n_vil']+','+child['n_state']).json()['Response']['View']
    if len(nv) == 0:
        child['n_v_crd']=""
        child['n_v_add']=""
    else:
        n_v=extract_loc(nv[0]["Result"][0]['Location'])
        child['n_v_crd']=n_v['crd']
        child['n_v_add']=n_v['add']

    np=requests.get(api_url+child['n_ps']+','+child['n_state']).json()['Response']['View']
    if len(np) == 0:
        child['n_p_crd']=""
        child['n_p_add']=""
    else:
        n_p=extract_loc(np[0]["Result"][0]['Location'])
        child['n_p_crd']=n_p['crd']
        child['n_p_add']=n_p['add']


    rv=requests.get(api_url+child['r_vil']+','+child['r_state']).json()['Response']['View']
    if len(rv) == 0:
        child['r_v_crd']=""
        child['r_v_add']=""
    else:
        r_v=extract_loc(rv[0]["Result"][0]['Location'])
        child['r_v_crd']=r_v['crd']
        child['r_v_add']=r_v['add']

    rp=requests.get(api_url+child['r_ps']+','+child['r_state']).json()['Response']['View']
    if len(rp) == 0:
        child['r_p_crd']=""
        child['r_p_add']=""
    else:
        r_p=extract_loc(rp[0]["Result"][0]['Location'])
        child['r_p_crd']=r_p['crd']
        child['r_p_add']=r_p['add']



    child_data.append(child)

    with open('ch_full_loc.json','w') as file:
        file.write(json.dumps(child_data,indent=4))
