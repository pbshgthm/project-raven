var Data = {

    raw: [],
    init: function(raw) {
        this.raw = raw;
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
                    "val": 1
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

    getPoints: function(src) {
        src = src.split('_')
        var crds = []
        for (var i = 0; i < this.raw.length; i++) {
            crds.push(this.raw[i][src[0]][src[1]]['crd'])
        }
        return this.toGeojson(crds)
    },

    getLines: function(src, dst) {
        src = src.split('_')
        dst = dst.split('_')

        var crds = []
        for (var i = 0; i < this.raw.length; i++) {
            crds.push([this.raw[i][src[0]][src[1]]['crd'], this.raw[i][dst[0]][dst[1]]['crd']])
        }
        return this.toGeojson(crds, "LineString")
    },

    ageDist: function() {
        var age = Array(21).fill(0)
        var tot = 0;
        for (var i = 0; i < this.raw.length; i++) {
            age[this.raw[i]['age']] += 1;
            tot += 1
        }
        age.shift()
        return age;
    },

    traffickDate: function(val) {
        var date = [];
        var s_freq = Array(229).fill(0);
        var hist = []
        var r_month = Array(229).fill(0);
        for (var i = 0; i < this.raw.length; i++) {
            var since = this.raw[i]['since'];
            var r_date = this.raw[i]['r_date'];
            if (since == -1) continue;
            if (r_date == "") continue;

            r_date = r_date.split("/");

            r_mdate = Math.floor((parseInt(r_date[2]) - 2000) * 12 + parseInt(r_date[1]))
            r_month[r_mdate] += 1

            r_date = r_date[1] + "/" + r_date[0] + "/" + r_date[2];




            var rr_date = new Date(r_date)
            rr_date.setDate(rr_date.getDate() + (-1 * since))

            var dd = rr_date.getDate();
            var mm = rr_date.getMonth() + 1;
            var y = rr_date.getFullYear();

            var t_date = dd + '/' + mm + '/' + y;
            var t_mdate = Math.floor(((y - 2000) * 12 + mm) / 1)

            date.push([t_mdate, r_mdate]);

            if (y >= 2000) {
                s_freq[t_mdate] += 1
                hist.push(t_mdate);
            }


        }

        if(val=='timeline')return s_freq;
        if(val=='since')return date
        
    },

    raidDist: function() {
        var r_data = {};
        for (var i = 0; i < this.raw.length; i++) {
            var r_date = this.raw[i]['r_date']
            var r_place = this.raw[i]['raid']['vil']['name']
            if (r_date == "") continue;
            if (r_place == "") continue;
            var _key = r_date + '--' + r_place;
            if (_key in r_data) r_data[_key] += 1
            else r_data[_key] = 1
        }
        var r_list = Object.entries(r_data);
        var r_freq = Array(121).fill(0).sort()
        for (var i = 0; i < r_list.length; i++) {
            var r_d = r_list[i][0].split('/')
            var m = (parseInt(r_d[2]) - 2011) * 12 + parseInt(r_d[1])
            if (parseInt(r_d[2]) < 2011) continue
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



}