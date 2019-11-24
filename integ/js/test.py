import json

a=json.load(open('py_data.json','r'))
k=0
for i in a[1:]:
	if i[19]=="":continue
	if int(i[19])>0:
		k+=1
		print(i[18])


print(k)