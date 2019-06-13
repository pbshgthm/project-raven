import requests
import json

api_url='https://maps.googleapis.com/maps/api/geocode/\
json?key=AIzaSyAmIwy27bpJWGoSLj1ts4MdeIpKVT3qryw&address='


with open('data/clean_master.json') as file:
    data=json.loads(file.read())


print(len(data))





def extract_loc(place):
    geo=place['geometry']
    crd=(geo['location']['lat'],geo['location']['lng'])
    bound=((geo['bounds']['northeast']['lat'],
                             geo['viewport']['northeast']['lng']),
                            (geo['viewport']['southwest']['lat'],
                             geo['viewport']['southwest']['lng']))

    add=place['formatted_address']
    return({'crd':crd,'bound':bound,'add':add})


child_data=[]
for i in data:
    child=i
    print(child['id'])


    nr = requests.get(api_url+child['n_dist']+','+child['n_state']).json()
    if not nr['status'] == "OK":
        print('Native not found : ', child['id'])
        continue
    rr = requests.get(api_url+child['r_dist']+','+child['r_state']).json()
    if not rr['status'] == "OK":
        print('Raid not found : ', child['id'])
        continue


    native=extract_loc(nr['results'][0])
    child['n_crd']=native['crd']
    child['n_bound']=native['bound']
    child['n_add']=native['add']

    raid=extract_loc(rr['results'][0])
    child['r_crd']=raid['crd']
    child['r_bound']=raid['bound']
    child['r_add']=raid['add']

    child_data.append(child)

    with open('ch_loc.json','w') as file:
        file.write(json.dumps(child_data,indent=4))
