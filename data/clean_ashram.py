import csv

cData=[]
with open('ashram_data.csv') as file:
    row=csv.reader(file)
    for i in row:
        cData.append(i)


cData=cData[1:]

def get_dict(ind,ind2=False):
	g_dict={}
	for i in cData:
		k=i[ind]
		if(ind2):k=i[ind]+'-'+i[ind2]
		if k in g_dict:
			g_dict[k]+=1
		else:
			g_dict[k]=1
	g_list=[[x,g_dict[x]] for x in g_dict]
	g_list.sort(key=lambda x:-x[1])
	print(sum([x[1] for x in g_list]))
	return g_list

a=get_dict(16)
a=a[1:]
print(a[:20],sum([x[1] for x in a[:20]]))


