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


    filterPoints: function(age, time, indst, loc,line=false) {
        var indst_r_list = ["Garment", "Hotel/Dhaba", "Footwear", "Handicraft", "Jute/Plastic/Rexin/Cloth Bags",
            "Cosmetic", "Domestic Servant", "Automobile/Transport", "Metal", "Retail Shop/Office",
            "Electrical & Electronics", "Leather", "_others", ""
        ]
        indst = indst.map(x => indst_r_list[x])
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

            var _ind = this.raw[i]['indst']

            if (indst.indexOf(_ind) == -1 && indst != '_others') {
                continue;
            }

            if(line){
                
            }
            else{
            var crd = this.raw[i][loc + '_v_crd'].split(',')
            if (crd[0] == "") continue;

            crds.push(crd)
            }

        }
        return this.toGeojson(crds)
    },

    age_dist: function() {
        var age = Array(21).fill(0)
        var start_age = Array(21).fill(0)
        for (var i = 0; i < this.raw.length; i++) {
            age[this.raw[i]['age']] += 1;
            start_age[this.raw[i]['start_age']] += 1;
        }
        age.shift()
        start_age.shift()
        return [age, start_age];
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
            ['Jute/Plastic/Rexin/Cloth Bags', 'Cosmetic', 'Domestic Servant', 'Electrical & Electronics', 'Leather', 'Handicraft', 'Carpet Industry',
                'Toy Making Unit', 'Paper Industry', 'Brick Kilns & Roof tiles units', 'Printing', 'Building and Construction', 'Carpentry',
                'Paint Making Unit', 'Lock Making', 'Sculpture Making Unit', 'Curtain Making Unit', 'Suitcase Making', 'Cracker Industry',
                'Umbrela Making Factory'
            ]
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
                indCat[i][j] = [ind_dict[indCat[i][j]], indCat[i][j]]
            indCat[i].sort(function(a, b) { return b - a })
        }

        return indCat
    },

    industryLoc: function(indst) {
        var raid_loc = {}
        var native_loc = {}
        var wage={}



        for (var i = 0; i < this.raw.length; i++) {

            if (indst != this.raw[i]['indst']) continue;

            var r_crd = this.raw[i]['raid_v_area']
            if (r_crd in raid_loc)
                raid_loc[r_crd] += 1
            else
                raid_loc[r_crd] = 1

            var n_crd = this.raw[i]['native_v_area']
            if (n_crd in native_loc)
                native_loc[n_crd] += 1
            else
                native_loc[n_crd] = 1

            var wg = Data.raw[i]['wage_week']
            if (wg != -1)
                wg = Math.round(wg / 50) * 50

            if (wg in wage) wage[wg] += 1
            else wage[wg] = 1

        }


        raid_loc = Object.entries(raid_loc)
        raid_loc.sort(function(a, b) { return b[1] - a[1] })
        native_loc = Object.entries(native_loc)
        native_loc.sort(function(a, b) { return b[1] - a[1] })


        wage = Object.entries(wage)
        wage.sort(function(a, b) { return a[0] - b[0] })


        var wage_list = Array(40).fill(0).map((x,i)=>[0,50*i])
        for (var i = 1; i < wage.length; i++) {

            if (wage[i][0] < 0) continue
            var inc = wage[i][0] / 50;
            if (inc > 39) inc = 39
            wage_list[inc][0] += wage[i][1]
            wage_list[inc][1] = wage[i][0]
        }




        return { 'raid': raid_loc, 'native': native_loc, "wage":wage_list }
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

    amountDist: function() {
        var income = {};
        var paramt = {};
        var wage = {};

        var inc_dict = {};
        var par_dict = {};
        var wag_dict = {};

        for (var i = 0; i < Data.raw.length; i++) {


            var inc = Data.raw[i]['income']
            if (inc != -1)
                inc = Math.round(inc / 5000) * 5000
            if (inc in income) {
                income[inc][0] += 1
                income[inc][1] += 1 / 3
                income[inc][2] += 1 / 6
            } else {
                income[inc] = [1, 1, 1]
            }

            if (inc != -1) {
                var ind = inc / 5000;
                if (ind > 39) ind = 39;

                var k = ind + '-1';
                if (k in inc_dict) inc_dict[k] += 1;
                else inc_dict[k] = 1


                var k = ind + '-2';
                if (k in inc_dict) inc_dict[k] += 1;
                else inc_dict[k] = 1


                var k = ind + '-3';
                if (k in inc_dict) inc_dict[k] += 1;
                else inc_dict[k] = 1


                var k = ind + '-4';
                if (k in inc_dict) inc_dict[k] += 1;
                else inc_dict[k] = 1

            }


            var par = Data.raw[i]['paramt']
            if (par == "") {
                var paypar = Data.raw[i]['paypar']
                if (paypar == 'no')
                    par = -1
                else
                    par = -2
            } else {
                par = parseInt((par))
                par = Math.round(par / 1000) * 1000
            }
            if (par in paramt) {
                paramt[par][0] += 1
                paramt[par][1] += 1 / 3
                paramt[par][2] += 1 / 6
            } else {
                paramt[par] = [1, 1, 1]
            }

            ///////////////////
            if (par >= 0) {
                var ind = par / 1000;
                if (ind > 39) ind = 39;

                if (paypar == "loan") {
                    var k = ind + '-1';
                    if (k in par_dict) par_dict[k] += 1;
                    else par_dict[k] = 1

                    var k = ind + '-2';
                    if (k in par_dict) par_dict[k] += 1;
                    else par_dict[k] = 1

                    var k = ind + '-3';
                    if (k in par_dict) par_dict[k] += 1;
                    else par_dict[k] = 1

                    var k = ind + '-4';
                    if (k in par_dict) par_dict[k] += 1;
                    else par_dict[k] = 1
                }

                if (paypar == "advance") {
                    var k = ind + '-1';
                    if (k in par_dict) par_dict[k] += 1;
                    else par_dict[k] = 1

                    var k = ind + '-2';
                    if (k in par_dict) par_dict[k] += 1;
                    else par_dict[k] = 1

                    var k = ind + '-3';
                    if (k in par_dict) par_dict[k] += 1;
                    else par_dict[k] = 1
                }

                if (paypar == "loan&advance") {
                    var k = ind + '-1';
                    if (k in par_dict) par_dict[k] += 1;
                    else par_dict[k] = 1

                    var k = ind + '-2';
                    if (k in par_dict) par_dict[k] += 1;
                    else par_dict[k] = 1

                }




            }

            ////////////////


            var wg = Data.raw[i]['wage_week']
            var wtype = Data.raw[i]['wage_type']
            if (wg != -1)
                wg = Math.round(wg / 50) * 50

            if (wg in wage) {
                wage[wg][0] += 1
                wage[wg][1] += 1 / 3
                wage[wg][2] += 1 / 6
            } else {
                wage[wg] = [1, 1, 1]
            }

            ////////////////
            if (wg >= 0) {
                var ind = wg / 50;
                if (ind > 39) ind = 39;

                if (wtype == "m") {
                    var k = ind + '-1';
                    if (k in wag_dict) wag_dict[k] += 1;
                    else wag_dict[k] = 1

                    var k = ind + '-2';
                    if (k in wag_dict) wag_dict[k] += 1;
                    else wag_dict[k] = 1

                    var k = ind + '-3';
                    if (k in wag_dict) wag_dict[k] += 1;
                    else wag_dict[k] = 1

                    var k = ind + '-4';
                    if (k in wag_dict) wag_dict[k] += 1;
                    else wag_dict[k] = 1
                }
                if (wtype == "w") {
                    var k = ind + '-1';
                    if (k in wag_dict) wag_dict[k] += 1;
                    else wag_dict[k] = 1

                    var k = ind + '-2';
                    if (k in wag_dict) wag_dict[k] += 1;
                    else wag_dict[k] = 1

                    var k = ind + '-3';
                    if (k in wag_dict) wag_dict[k] += 1;
                    else wag_dict[k] = 1
                }
                if (wtype == "d") {
                    var k = ind + '-1';
                    if (k in wag_dict) wag_dict[k] += 1;
                    else wag_dict[k] = 1

                    var k = ind + '-2';
                    if (k in wag_dict) wag_dict[k] += 1;
                    else wag_dict[k] = 1
                }
                if (wtype == "o") {
                    var k = ind + '-1';
                    if (k in wag_dict) wag_dict[k] += 1;
                    else wag_dict[k] = 1
                }

            }

            ///////////////

        }

        income = Object.entries(income)
        income = income.map(x => [x[0], x[1][0], Math.round(x[1][1]), Math.round(x[1][2])])
        income.sort(function(a, b) { return a[0] - b[0] })

        paramt = Object.entries(paramt)
        paramt = paramt.map(x => [x[0], x[1][0], Math.round(x[1][1]), Math.round(x[1][2])])
        paramt.sort(function(a, b) { return a[0] - b[0] })

        wage = Object.entries(wage)
        wage = wage.map(x => [x[0], x[1][0], Math.round(x[1][1]), Math.round(x[1][2])])
        wage.sort(function(a, b) { return a[0] - b[0] })


        inc_dict = Object.entries(inc_dict)
        inc_dict = inc_dict.map(x => [parseInt(x[0].split('-')[0]),
            parseInt(x[0].split('-')[1]),
            x[1],
            parseInt(x[0].split('-')[0]) * 5000
        ])
        inc_dict = inc_dict.sort(function(a, b) { return a[0] - b[0] })


        par_dict = Object.entries(par_dict)
        par_dict = par_dict.map(x => [parseInt(x[0].split('-')[0]),
            parseInt(x[0].split('-')[1]),
            x[1],
            parseInt(x[0].split('-')[0]) * 1000
        ])
        par_dict = par_dict.sort(function(a, b) { return a[0] - b[0] })


        wag_dict = Object.entries(wag_dict)
        wag_dict = wag_dict.map(x => [parseInt(x[0].split('-')[0]),
            parseInt(x[0].split('-')[1]),
            x[1],
            parseInt(x[0].split('-')[0]) * 50
        ])
        wag_dict = wag_dict.sort(function(a, b) { return a[0] - b[0] })


        return {
            'income': income,
            'paramt': paramt,
            'wage': wage,
            'income_h': inc_dict,
            'paramt_h': par_dict,
            'wage_h': wag_dict
        }
    },

    amountSelDist: function(sel_amt, sel_val) {

        var income = {};
        var paramt = {};
        var wage = {};

        var amt_dict = {
            'income': 0,
            'paramt': 0,
            'wage': 0
        }

        for (var i = 0; i < Data.raw.length; i++) {


            var inc = Data.raw[i]['income']
            if (inc != -1)
                inc = Math.round(inc / 5000) * 5000
            amt_dict['income'] = inc


            var par = Data.raw[i]['paramt']
            if (par == "") {
                var paypar = Data.raw[i]['paypar']
                if (paypar == 'no')
                    par = -1
                else
                    par = -2
            } else {
                par = parseInt((par))
                par = Math.round(par / 1000) * 1000
            }
            amt_dict['paramt'] = par




            var wg = Data.raw[i]['wage_week']
            if (wg != -1)
                wg = Math.round(wg / 50) * 50
            amt_dict['wage'] = wg



            if (amt_dict[sel_amt] != sel_val)
                continue;


            if (inc in income) {
                income[inc] += 1
            } else {
                income[inc] = 1
            }


            if (par in paramt) {
                paramt[par] += 1
            } else {
                paramt[par] = 1
            }



            if (wg in wage) {
                wage[wg] += 1
            } else {
                wage[wg] = 1
            }

        }

        var sample_list = Array(40).fill(0)
        income = Object.entries(income)
        income.sort(function(a, b) { return a[0] - b[0] })

        paramt = Object.entries(paramt)
        paramt.sort(function(a, b) { return a[0] - b[0] })

        wage = Object.entries(wage)
        wage.sort(function(a, b) { return a[0] - b[0] })


        var income_list = sample_list.map(x => [0, 0])
        for (var i = 1; i < income.length; i++) {
            if (income[i][0] < 0) continue
            var inc = income[i][0] / 5000;
            if (inc > 39) inc = 39
            income_list[inc][0] += income[i][1]
            income_list[inc][1] = income[i][0]
        }


        var paramt_list = sample_list.map(x => [0, 0])

        for (var i = 1; i < paramt.length; i++) {

            if (paramt[i][0] < 0) continue
            var inc = paramt[i][0] / 1000;
            if (inc > 39) inc = 39
            paramt_list[inc][0] += paramt[i][1]
            paramt_list[inc][1] = paramt[i][0]
        }


        var wage_list = sample_list.map(x => [0, 0])
        for (var i = 1; i < wage.length; i++) {

            if (wage[i][0] < 0) continue
            var inc = wage[i][0] / 50;
            if (inc > 39) inc = 39
            wage_list[inc][0] += wage[i][1]
            wage_list[inc][1] = wage[i][0]
        }



        return { 'income': income_list, 'paramt': paramt_list, 'wage': wage_list }

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
        console.log(month_data)
        return month_data

    }


}