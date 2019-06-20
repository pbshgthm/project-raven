
var Data = {

	raw : [],
	init : function(raw){
		this.raw=raw;
	},

	toGeojson : function(crds,typ="Point"){
      	geo={};
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
    	crds=[]
    	for(var i=0;i<this.raw.length;i++){
    		crds.push(this.raw[i][src[0]][src[1]]['crd'])
    	}
    	return this.toGeojson(crds)
    },

    getLines : function(src,dst){
    	src=src.split('_')
    	dst=dst.split('_')

    	crds=[]
    	for(var i=0;i<this.raw.length;i++){
    		crds.push([this.raw[i][src[0]][src[1]]['crd'],this.raw[i][dst[0]][dst[1]]['crd']])
    	}
    	return this.toGeojson(crds,"LineString")
    },

    ageDist : function(){
    	var age=[]
    	for(var i=0;i<this.raw.length;i++){
    		age.push(this.raw[i]['age'])
    	}
    	return age.sort(function(a,b){return a-b});
    }	

}