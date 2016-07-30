var doc = document;

//--- Helper functions --- //
function log(m){
    console.log(m);
}
function get(id){
    return doc.getElementById(id);
}
function put(id, content){
    doc.getElementById(id).innerHTML = content;
}
function clr(id){
    doc.getElementById(id).innerHTML = '';
}

function vis(id, state){
    var el = get(id);
    if(state === 1){
        el.hidden = false;
    } else {
        el.hidden = true;
    }
}
// ----------------------- //

var rankObj = {
    // Master obj
    reportFrequency: 4,
    freqCounter: 0,
    voteCounter: 0,
    imgObjArr: [],
    record: [],
    imgArr: ['bag.jpg', 'banana.jpg', 'boots.jpg', 'chair.jpg', 'cthulhu.jpg', 'dragon.jpg', 'pen.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.jpg', 'unicorn.jpg', 'usb.jpg', 'water_can.jpg', 'wine_glass.jpg'],
    helperTxt: [
        'A rolling suitcase that looks like R2D2.',
        'A tool that slices bananas in one push.',
        'Open-toed rain boots.',
        'A chair with a convex seat.',
        'A toy of the Eldritch lord Cthulhu. Bow down before his evil toy likeness!',
        'A delicious can of dragon meat. No Pete\'s were harmed in the making of this product.',
        'Pen caps with plastic utensils attached.',
        'Pizza scissors.',
        'A shark sleeping bag.',
        'Baby onesie with sweeper attached. Put that baby to work!',
        'Canned unicorn.',
        'A tentacle usb drive.',
        'Perpetual watering machine.',
        'Wineglass build for sniffing or gulping or something.'
    ],
    init: function(){
        for(var i=0; i<rankObj.imgArr.length; i++){
            // load new objs to array
            var newObj = new ImgObj(rankObj.imgArr[i], i, rankObj.helperTxt[i]);
            rankObj.imgObjArr.push(newObj);
        }
        doc.addEventListener('click', function(e){
            if(e.target.tagName === 'IMG'){
                var votedObj = rankObj.imgObjArr[e.target.dataset.num];
                votedObj.votes++;
                log("Votes for " + votedObj.name + ": " + votedObj.votes);
                rankObj.increment();
                log("Vote Total: " + rankObj.voteCounter);
                rankObj.posBias[e.target.dataset.pos]++;
                rankObj.getShowImgs();
            }
        });
        get('btn_showTotals').addEventListener('click', function(){
            vis('voteTotals', 1);
            vis('btn_showTotals', 0);
            if((rankObj.voteCounter % rankObj.reportFrequency) === 0){
                rankObj.genReport();
            }
        });
        this.progBar('init');
        this.getShowImgs();
    },
    randomImgs: function(n){
        var arr = [];
        var nums = [];
        while(arr.length < n){
            var numR = Math.floor(Math.random() * 14);
            if(nums.indexOf(numR) === -1){//prevent duplicates
                if(this.record.indexOf(numR) === -1){//prevent repeats
                    nums.push(numR);
                    arr.push(this.imgObjArr[numR]);
                    this.record.push(numR);
                    log('History: ' + rankObj.record);
                } else if(this.record.length >= this.imgArr.length){
                    nums.push(numR);
                    arr.push(this.imgObjArr[numR]);
                    this.record.push(numR);
                }
            }
        }
        return arr;
    },
    getShowImgs: function(){
        var imgObjs = this.randomImgs(3, true);
        var els = doc.getElementsByTagName('img');
        for(var i=0; i<els.length; i++){
            imgEl = els[i];
            imgEl.src = 'img/med/' + imgObjs[i].name;
            var num = imgObjs[i].num;
            imgEl.dataset.num = num;
            imgEl.alt = imgObjs[i].altTxt;
            this.imgObjArr[num].appearing++;
        }
    },
    increment: function(){
        if(this.freqCounter === 0) {
            this.progBar('reset');
        }
        this.voteCounter ++;
        this.freqCounter++;

        vis('voteTotals', 0);
        if(this.voteCounter % this.reportFrequency){
            vis('btn_showTotals', 0);
            this.progBar('update', this.freqCounter);
        } else {
            vis('btn_showTotals', 1);
            this.progBar('update', this.freqCounter);
            this.freqCounter = 0;
        }
    },
    progBar: function(mode, n){
        var els_bar = doc.getElementsByClassName('prog_section');
        if(mode === 'init'){
            var str = '';

            for(var i=0; i<this.reportFrequency; i++){
                var section_size = 100/this.reportFrequency;
                str += "<div class='prog_section' style='width:" + section_size + "%;'></div>";
            }
            put('progress', str);
        } else if(mode === 'update'){
            for(var j=0; j<n; j++){
                if(els_bar[j].className.indexOf('complete') === -1 ){
                    els_bar[j].className += ' complete';
                }
            }
        } else {//reset
            for(var k=0; k<this.reportFrequency; k++){
                els_bar[k].className = 'prog_section';
            }
        }
    },
    genReport: function(){
      convert(this.imgObjArr);
      var chartProperties = {
    		title:{
    			text: "Popularity of Objects"
    		},
    		data: [
    		{
    			// Change type to "doughnut", "line", "splineArea", etc.
    			type: "column",
    			dataPoints: newArr,
          height: 300
    		}
    		]
    	};
      chart = new CanvasJS.Chart("voteTotals", chartProperties);
      chart.render();
        // var arrSorted = this.imgObjArr.slice();
        // clr('voteTotals');
        //
        // arrSorted = (arrSorted.sort(function(a, b){
        //     return a.votes - b.votes;
        // })).reverse();
        //
        // var str = "<h2>Click Report</h2><table><tr><thead><td>Subject</td><td>Votes</td><td>Percent</td></thead></tr><tbody>";
        // for(var i=0; i<arrSorted.length; i++){
        //     var imgObj = arrSorted[i];
        //     str += "<tr><td>" + imgObj.displayName + "</td>" + "<td>" + imgObj.votes + "</td><td>" + imgObj.calcPercent() + "</td></tr>";
        // }
        // str += "</tbody></table>";
        // str += "<h2>Click Bias</h2>" + this.posBias.report();
        // str += "<h4>Click any image to continue!</h4>";
        //
        // put('voteTotals', str);
        // this.posBias.report();
    },
    posBias: {
        // For tracking positional bias
        pos_L: 0,
        pos_C: 0,
        pos_R: 0,
        report: function(){
            if(window.innerWidth > 600){
                desc_L = "Left";
                desc_C = "Center";
                desc_R = "Right";
            } else {
                desc_L = "Top";
                desc_C = "Middle";
                desc_R = "Bottom";
            }
            var str = "<table id='table_Bias'><thead><th>" + desc_L + "</th><th>" + desc_C + "</th><th>" + desc_R + "</th></thead>";
            str += "<td>" + this.pos_L + "</td><td>" + this.pos_C + "</td><td>" + this.pos_R + "</td>";
            str += "<tbody></tbody></table>";
            return str;
        }
    }
};

var ImgObj = function(name, num, altTxt){
    // Constructor obj
    this.name = name;
    this.displayName = (name.replace('.jpg', '')).replace('_', ' ');
    this.num = num;
    this.votes = 0;
    this.appearing = 0;
    this.altTxt = altTxt;
    this.calcPercent = function(){
        var percent = this.votes/this.appearing;
        if(!percent){ percent = 0;}
        return percent.toFixed(2);
    };
};

rankObj.init();

var newArr = [];

function convert(array) {
  for (var i = 0; i < array.length; i++) {
    var newObj = {
      label: array[i].displayName,
      y: array[i].votes,
    }
    newArr.push(newObj);
  }
}



//report freq changed 2 4
