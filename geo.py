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


    nr = requests.get(api_url+child['n_dist']+','+child['n_state']).json()['Response']['View']
    #print(nr)
    if len(nr) == 0:
        print('Native not found : ', child['id'])
        continue
    rr = requests.get(api_url+child['r_dist']+','+child['r_state']).json()['Response']['View']
    #print(rr)
    if len(rr) == 0:
        print('Raid not found : ', child['id'])
        continue


    native=extract_loc(nr[0]["Result"][0]['Location'])
    child['n_crd']=native['crd']
    child['n_add']=native['add']

    raid=extract_loc(rr[0]["Result"][0]['Location'])
    child['r_crd']=raid['crd']
    child['r_add']=raid['add']

    child_data.append(child)

    with open('ch_loc.json','w') as file:
        file.write(json.dumps(child_data,indent=4))
