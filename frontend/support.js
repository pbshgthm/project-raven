
var Data = {

	raw : [],
	init : function(raw){
		this.raw=raw;
	},

	toGeojson : function(crds,typ="Point"){
      	var geo={};
      	geo['type']='FeatureCollection';
      	geo['features']=[];
        for(var i=0;i<crds.length;i++){
          if(crds[i].length==0)continue;
          if(crds[i][0].length==0||crds[i][1].length==0)continue;
          var c={
      			"type":"Feature",
      			"properties": {
      					"val" : 1
      				},
      			"geometry":{
      					"type":typ,
      					"coordinates":crds[i]
      				}
      		}
          geo['features'].push(c)
        }
      	return geo;
      },


  getPoints : function(src){
    	src=src.split('_')
    	var crds=[]
    	for(var i=0;i<this.raw.length;i++){
    		crds.push(this.raw[i][src[0]][src[1]]['crd'])
    	}
    	return this.toGeojson(crds)
  },

  getLines : function(src,dst){
    	src=src.split('_')
    	dst=dst.split('_')

    	var crds=[]
    	for(var i=0;i<this.raw.length;i++){
    		crds.push([this.raw[i][src[0]][src[1]]['crd'],this.raw[i][dst[0]][dst[1]]['crd']])
    	}
    	return this.toGeojson(crds,"LineString")
  },

  ageDist : function(){
    	var age=Array(21).fill(0)
      var tot=0;
    	for(var i=0;i<this.raw.length;i++){
    		age[this.raw[i]['age']]+=1;
        tot+=1
    	}
      console.log(tot)
      age.shift()
    	return age;
  },

  traffickDate : function(){
      var date=[];
      var s_freq=[];
      for(var i=0;i<this.raw.length;i++){
        var since=this.raw[i]['since'];
        var r_date=this.raw[i]['r_date'];
        if(since==-1)continue;
        if(r_date=="")continue;

        r_date=r_date.split("/");
        r_date=r_date[1]+"/"+r_date[0]+"/"+r_date[2];
        var rr_date=new Date(r_date)
        rr_date.setDate(rr_date.getDate()+(-1*since))

        var dd = rr_date.getDate();
        var mm = rr_date.getMonth() + 1;
        var y = rr_date.getFullYear();

        var t_date = dd + '/'+ mm + '/'+ y;
        var t_mdate = (y-2009)*12+mm
        
        date.push([r_date,since,r_date]);

        if(y>2009)
        s_freq.push(t_mdate);

      }
      return s_freq;
  },

  industryDist : function(){
      var ind_dict={}
      for(var i=0;i<this.raw.length;i++){
        var ind=this.raw[i]['indst'];
        if(ind=="")continue;
        var task=this.raw[i]['task'];

        if(ind in ind_dict)
          ind_dict[ind]+=1;
        else
          ind_dict[ind]=1;
      }
      ind_list=[];
      for(i in ind_dict){
        ind_list.push([i,ind_dict[i]])
      }


      return ind_list.sort(function (a,b){return b[1]-a[1]});
  }

}




















