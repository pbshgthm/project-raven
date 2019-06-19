import requests
import json

api_url='https://geocoder.api.here.com/6.2/geocode.json?\
responseattributes=none&locationattributes=none%2Car&gen=9\
&app_id=oauTasEavzggDxpgTOJD&app_code=ssniJWlEDlNtElcjMBgjtw&searchtext='


with open('master_data.json') as file:
    data=json.loads(file.read())


print(len(data))


def extract_loc(place,name):
    
    geo=place['Location']['DisplayPosition']
    crd=(geo['Longitude'],geo['Latitude'])
    meta=(place['MatchLevel'],place['Relevance'])


    add=place['Location']['Address']
    city = add['City'] if 'City' in add else ""

    full_add=city+', '+add['County']+', '+add['State']+', '+add['Country']
    
    return({'name':name,'crd':crd,'add':full_add,'meta':meta})




def fill_blank(name):
    return({'name':name,'crd':[],'add':"",'meta':[]})




child_data=[]




for i in data[:10]:
    child=i
    print(child['id'])

   

    q=child['native']['vil']+', '+child['native']['area']
    req=requests.get(api_url+q).json()['Response']['View']
    if len(req) ==0:
        child['native']['vil']=fill_blank(child['native']['vil'])
    else:
        loc=extract_loc(req[0]["Result"][0],child['native']['vil'])
        child['native']['vil']=loc


    q=child['native']['ps']+', '+child['native']['area']
    req=requests.get(api_url+q).json()['Response']['View']
    if len(req) ==0:
        child['native']['ps']=fill_blank(child['native']['ps'])
    else:
        loc=extract_loc(req[0]["Result"][0],child['native']['ps'])
        child['native']['ps']=loc


    q=child['raid']['vil']+', '+child['raid']['area']
    req=requests.get(api_url+q).json()['Response']['View']
    if len(req) ==0:
        child['raid']['vil']=fill_blank(child['raid']['vil'])
    else:
        loc=extract_loc(req[0]["Result"][0],child['raid']['vil'])
        child['raid']['vil']=loc


    q=child['raid']['ps']+', '+child['raid']['area']
    req=requests.get(api_url+q).json()['Response']['View']
    if len(req) ==0:
        child['raid']['ps']=fill_blank(child['raid']['ps'])
    else:
        loc=extract_loc(req[0]["Result"][0],child['raid']['ps'])
        child['raid']['ps']=loc

    
    

    child_data.append(child)

    with open('compiled.json','w') as file:
        file.write(json.dumps(child_data,indent=4))
