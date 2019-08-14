var Data = {

    raw: [],
    init: function(raw_csv) {
        var key = raw_csv[0]
        var data = []
        for (var i = 1; i < raw_csv.length; i++) {
            var c_d = {}
            for (var j = 0; j < raw_csv[i].length; j++)
                c_d[key[j]] = raw_csv[i][j]
            data.push(c_d)
        }
        this.raw = data;
    },

    toGeojson: function(crds, typ = "Point") {
        var geo = {};
        geo['type'] = 'FeatureCollection';
        geo['features'] = [];
        for (var i = 0; i < crds.length; i++) {
            if (crds[i].length == 0) continue;
            if (crds[i][0].length == 0 || crds[i][1].length == 0) continue;
            var c = {
                "type": "Feature",
                "properties": {
                    "val": 1,
                },
                "geometry": {
                    "type": typ,
                    "coordinates": crds[i]
                }
            }
            geo['features'].push(c)
        }
        return geo;
    },

    getMarkers: function(loc, key) {
        var geo = {};
        geo['type'] = 'FeatureCollection';
        geo['features'] = [];


        var clrs = ['#f44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
            '#03A9F4', '#00BCD4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
            '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'
        ]

        for (var i = 0; i < this.raw.length; i++) {
            var crd = this.raw[i][loc + "_v_crd"].split(',');
            if (crd[0] == "") continue;
            var item = this.raw[i][key];
            if (item == "") continue;
            var c = {
                "type": "Feature",
                "properties": {
                    "val": 1,
                    "item": item,
                    'clr': clrs[item - 1]
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": crd
                }
            }
            geo['features'].push(c)
        }
        return geo;

    },
    getPoints: function(src) {
        var crds = []
        for (var i = 0; i < this.raw.length; i++) {
            var crd = this.raw[i][src].split(',')
            if (crd[0] == "") crd = []
            crds.push(crd)
        }
        return this.toGeojson(crds)
    },

    getLines: function(src, dst) {

        var crds = []
        for (var i = 0; i < this.raw.length; i++) {
            var s_crd = this.raw[i][src].split(',')
            if (s_crd[0] == "") s_crd = []

            var d_crd = this.raw[i][dst].split(',')
            if (d_crd[0] == "") d_crd = []
            crds.push([s_crd, d_crd])


        }
        return this.toGeojson(crds, "LineString")
    },


    filterPoints: function(age, time,indst) {
        console.log(indst)
        var indst_r_list=["Garment","Hotel/Dhaba","Footwear","Handicraft","Jute/Plastic/Rexin/Cloth Bags","Cosmetic","Domestic Servant","Automobile/Transport","Metal","Retail Shop/Office","Electrical & Electronics","Leather","_others",""]
        indst=indst.map(x=>indst_r_list[x])
        var crds = []
        for (var i = 0; i < this.raw.length; i++) {
            if (age != this.raw[i]['age']) {
                if (age != 0) continue;
            }

            if (time != -1) {
                var t = this.raw[i]['t_date'].split("/")
                t = (t[2] - 2010) * 12 + (parseInt(t[1]))

                if (t < time[0] || t > time[1]) continue
                if (isNaN(t)) continue;
                

            }

            var _ind=this.raw[i]['indst']
            //console.log(_ind,indst)
            if(indst.indexOf(_ind)==-1&&indst!='_others'){
                continue;
            }
            //console.log('sel',_ind)
            var crd = this.raw[i]['native_v_crd'].split(',')
            if (crd[0] == "") continue;

            crds.push(crd)
        }
        return this.toGeojson(crds)
    },

    age_dist: function() {
        var age = Array(21).fill(0)
        var tot = 0;
        for (var i = 0; i < this.raw.length; i++) {
            age[this.raw[i]['age']] += 1;
            tot += 1
        }
        age.shift()
        return age;
    },

    traffickDate: function() {

        var traf_m = {}
        for (var i = 0; i < this.raw.length; i++) {
            var m = this.raw[i]['t_date'].split('/')
            m = (m[2] - 2010) * 6 + parseInt(parseInt(m[1]) / 2)
            if (isNaN(m)) continue
            //if(m<0)continue
            if (m in traf_m) traf_m[m] += 1
            else traf_m[m] = 1
        }

        traf_m = Object.entries(traf_m).map(x => [parseInt(x[0]), x[1]])

        return traf_m.sort(function(a, b) { return a[0] - b[0] })

    },

    traffickDur: function() {
        var dur = []
        for (var i = 0; i < this.raw.length; i++) {
            var t = this.raw[i]['t_date'].split("/")
            var r = this.raw[i]['r_date'].split("/")
            t = (t[2] - 2000) * 12 + parseInt(t[1])
            r = (r[2] - 2000) * 12 + parseInt(r[1])
            if (isNaN(t) || isNaN(r)) continue;
            dur.push([t, r])
        }
        return dur.sort(function(a, b) { return a[0] - b[0] });

    },

    raidDist: function() {
        var r_data = {};
        for (var i = 0; i < this.raw.length; i++) {
            var r_date = this.raw[i]['r_date']
            var r_place = this.raw[i]['raid_v_name']
            if (r_date == "") continue;
            if (r_place == "") continue;
            var _key = r_date + '--' + r_place;
            if (_key in r_data) r_data[_key] += 1
            else r_data[_key] = 1
        }
        var r_list = Object.entries(r_data);
        var r_freq = Array(170).fill(0).sort()
        for (var i = 0; i < r_list.length; i++) {
            var r_d = r_list[i][0].split('/')
            var m = (parseInt(r_d[2]) - 2005) * 12 + parseInt(r_d[1])
            if (parseInt(r_d[2]) < 2005) continue
            if (r_freq[m] == 0)
                r_freq[m] = [r_list[i][1]]
            else
                r_freq[m].push(r_list[i][1])
        }
        r_freq = r_freq.map(x => x == 0 ? [] : x)
        return r_freq;
    },

    originDist: function() {
        var s_data = {};
        for (var i = 0; i < this.raw.length; i++) {
            var s_val = this.raw[i]['since']
            var r_date = this.raw[i]['r_date']
            var n_place = this.raw[i]['native']['vil']['name']
            var r_place = this.raw[i]['raid']['vil']['name']
            if (s_val == -1) continue;
            if (r_place == "") continue;
            if (n_place == "") continue;
            if (r_place == "") continue;

            var _key = s_val + r_date + n_place + r_place;
            if (_key in s_data) s_data[_key] += 1
            else s_data[_key] = 1
        }
        return s_data;
    },

    industryDist: function() {
        var indCat = [
            ['Garment', 'Footwear', 'Jewellery'],
            ['Automobile/Transport', 'Metal', 'Retail Shop/Office', 'Odd Jobs', 'Stone Quarry', 'Factory', 'Plastic and Nylon units'],
            ['Hotel/Dhaba', 'Bakery', 'Abattoirs/Slaughter Houses', 'Flour Mill', 'Agriculture', 'Dairy Products', 'Tobacco & Chewing Tobacco'],
            ['Jute/Plastic/Rexin/Cloth Bags', 'Cosmetic', 'Domestic Servant', 'Electrical & Electronics', 'Leather', 'Handicraft', 'Carpet Industry', 'Toy Making Unit', 'Paper Industry', 'Brick Kilns & Roof tiles units', 'Printing', 'Building and Construction', 'Carpentry', 'Paint Making Unit', 'Lock Making', 'Sculpture Making Unit', 'Curtain Making Unit', 'Suitcase Making', 'Cracker Industry', 'Umbrela Making Factory']
        ]
        var ind_dict = {}
        for (var i = 0; i < this.raw.length; i++) {
            var ind = this.raw[i]['indst'];
            if (ind == "") continue;

            if (ind in ind_dict)
                ind_dict[ind] += 1;
            else
                ind_dict[ind] = 1;
        }
        for (var i = 0; i < indCat.length; i++) {
            for (var j = 0; j < indCat[i].length; j++)
                indCat[i][j] = ind_dict[indCat[i][j]]
            indCat[i].sort(function(a, b) { return b - a })
        }

        return indCat;
    },

    parPay: function() {
        var paypar = {};
        var p_c = 0;
        var a_c = 0;
        for (var i = 0; i < Data.raw.length; i++) {
            var pay = Data.raw[i]['paypar'];
            var amt = Data.raw[i]['paramt'];
            if (amt != "") {
                if (pay == "") continue;
                var k = amt + '-' + pay;
                if (k in paypar) paypar[k] += 1
                else paypar[k] = 1
            }

        }
        paypar = Object.entries(paypar);
        return paypar

    },

    getDict: function(item) {
        var gen_dict = {}
        for (var i = 0; i < this.raw.length; i++) {
            if (this.raw[i][item] in gen_dict)
                gen_dict[this.raw[i][item]] += 1;
            else
                gen_dict[this.raw[i][item]] = 1;
        }

        return Object.entries(gen_dict).sort(function(a, b) { return b[1] - a[1] });
    },

    subPlot: function(filter, val, key) {
        var dist = {}
        for (var i = 0; i < this.raw.length; i++) {
            var f = this.raw[i][filter];

            if (filter == "t_date") {
                f = f.split("/")
                f = (f[2] - 2010) * 6 + parseInt(parseInt(f[1]) / 2)
            }

            if (f != val) continue;
            var k = this.raw[i][key];
            if (k == "") continue;
            if (key.slice(-3) == "add")
                k = k.split(',')[2].substring(1)

            if (k in dist) {
                dist[k] += 1;
            } else {
                dist[k] = 1;
            }
        }

        dist = Object.entries(dist);
        dist.sort(function(a, b) { return b[1] - a[1] })
        return dist;
    },

    r_month_data: function(curr_month) {
        var month_data = []
        var r_data = {}
        for (var i = 0; i < this.raw.length; i++) {

            f = this.raw[i]['r_date']
            f = f.split("/")
            f = (f[2] - 2005) * 12 + parseInt(f[1])
            if (f != curr_month) continue


            var r_date = this.raw[i]['r_date']
            var r_place = this.raw[i]['raid_v_name'] + '&' + this.raw[i]['raid_v_add']
            var r_indst = this.raw[i]['indst']
            if (r_date == "") continue;
            if (r_place == "") continue;
            var _key = r_date + '--' + r_place;
            if (_key in r_data) {
                if (r_indst in r_data[_key])
                    r_data[_key][r_indst] += 1
                else
                    r_data[_key][r_indst] = 1
            } else r_data[_key] = { r_indst: 1 }

        }
        month_data = Object.entries(r_data)
        month_data = month_data.map(x => x[0].split('--').concat(x[1]))
        month_data.sort(function(a, b) { return parseInt(a[0].split('/')[0]) - parseInt(b[0].split('/')[0]) })
        month_data = month_data.map(x => x.slice(0, 2).concat([Object.entries(x[2])]))
        return month_data

    }


}