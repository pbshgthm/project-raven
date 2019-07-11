import csv

cData=[]
with open('ashram_data.csv') as file:
    row=csv.reader(file)
    for i in row:
        cData.append(i)


cData=cData[1:]

def get_dict(ind,ind2=False):
	g_dict={}
	al=[]
	for i in cData:
		k=i[ind]
		if not k=="":al.append(k)
		if(ind2):k=i[ind]+'-'+i[ind2]
		if k in g_dict:
			g_dict[k]+=1
		else:
			g_dict[k]=1
	g_list=[[x,g_dict[x]] for x in g_dict]
	g_list.sort(key=lambda x:-x[1])
	print(sum([x[1] for x in g_list]))
	#print(al)
	return g_list

a=get_dict(26)
for i in a:
	print(i[0]+' '+str(i[1]))


def get_wage():
	w={
		'No Wage Earned' : [-1,0],
		'Monthly' : [25,1],
		'Weekly' : [6,2],
		'One Time' : [1,3],
		'Daily' : [1,4],
		'':0
	}


	wage=[]
	sin={}
		
	for i in cData:
		ww=w[i[26]]
		if ww==0:continue
		if i[25]=="":i[25]=0
		if ww[1]==3:		
			if i[23]=="":continue
			if i[24]=="":continue
			if i[24]=="Days":
				if i[25]==0:continue
				ww[0]=int(i[25])/(1*int(i[23]))
				
			if i[24]=="Months":
				if i[25]==0:continue
				ww[0]=int(i[25])/(25*int(i[23]))
			if(ww[0]==0):continue	
		
		wage.append([int(6*int(i[25])/ww[0]),ww[1]])
		if(ww[1]==0):wage[-1]=[0,0]
	wage.sort()
	
	w_d={}
	for i in wage:
		k=str(i[0])+'-'+str(i[1])
		if k in w_d:
			w_d[k]+=1
		else:
			w_d[k]=1
	w_l=list(w_d.items())
	for x in w_l:
		print(x)
		print(int(x[0].split('-')[0]))
	w_l.sort(key = lambda x: int(x[0].split('-')[0]))
	print(w_l)
get_wage()
#a=a[1:]
#print(a[:20],sum([x[1] for x in a[:20]]))


