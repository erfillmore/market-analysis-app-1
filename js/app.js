// XXX show 3 imgs at a time
// XXX rank imgs
// XXX store, calc, display resulting data

// randomly show 3 imgs at app start, side-by-side
// instructional text to click on product most likely to buy
// XXX use eventlistener to track clicks for each img
// XXX log to console the selected product, and its total votes so far
// XXX display next 3 imgs
// XXX show 'See Totals' button after every 15 user votes that shows listing of all objects and their votes
// XXX --- sort the list by vote number
// XXX ------ calc % of votes per appearance for each, show in separate list
// XXX --------- another analysis metric based on num of clicks: BIAS (L C R)
// XXX --------- present all data points in table instead of list

// Choose a custom web font (Links to an external site)
// Choose a custom color palette (Links to an external site)

var doc = document;
var reportFrequency = 3;
var voteCounter = 0;
var imgArr = ['bag.jpg', 'banana.jpg', 'boots.jpg', 'chair.jpg', 'cthulhu.jpg', 'dragon.jpg', 'pen.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.jpg', 'unicorn.jpg', 'usb.jpg', 'water_can.jpg', 'wine_glass.jpg'];

var imgObjArr = [];

var ImgObj = function(name, num){
    this.name = name;
    this.displayName = (name.replace('.jpg', '')).replace('_', ' ');
    this.num = num;
    this.votes = 0;
    this.appearing = 0;
    this.calcPercent = function(){
        var percent = this.votes/this.appearing;
        if(!percent){ percent = 0;}
        return percent.toFixed(2);
    };
};

for(var i=0; i<imgArr.length; i++){
    // load objects to array
    var newObj = new ImgObj(imgArr[i], i);
    imgObjArr.push(newObj);
}

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
//--- Helper functions --- //

// --- Event listeners --- //
doc.addEventListener('click', function(e){
    if(e.target.tagName === 'IMG'){
        var votedObj = imgObjArr[e.target.dataset.num];
        votedObj.votes++;
        log("Votes for " + votedObj.name + ": " + votedObj.votes);
        increment();
        log("Vote Total: " + voteCounter);
        posBias[e.target.dataset.pos]++;
        getShowImgs();
    }
});

get('btn_showTotals').addEventListener('click', function(){
    vis('voteTotals', 1);
    vis('btn_showTotals', 0);
    if((voteCounter % reportFrequency) === 0){
        genReport();
    }
});
// --- Event listeners --- //

function random(n, mode){
    var arr = [];
    var nums = [];
    while(arr.length < n){
        var numR = Math.floor(Math.random() * 14);
        if(nums.indexOf(numR) === -1){
            nums.push(numR);
            if(mode){
                // To return random image objects
                arr.push(imgObjArr[numR]);
            } else {
                // To return just random nums
                arr.push(numR);
            }
            // log(numR);
        }
    }
    return arr;
}

function getShowImgs(){
    var imgObjs = random(3, true);
    var els = doc.getElementsByTagName('img');
    for(var i=0; i<els.length; i++){
        els[i].src = 'img/' + imgObjs[i].name;
        var num = imgObjs[i].num;
        els[i].dataset.num = num;
        imgObjArr[num].appearing++;
    }
}

function increment(){
    voteCounter ++;
    vis('voteTotals', 0);
    if(voteCounter % reportFrequency){
        vis('btn_showTotals', 0);
    } else {
        vis('btn_showTotals', 1);
    }
}

function genReport(){
    var arrSorted = imgObjArr.slice();
    clr('voteTotals');

    arrSorted = (arrSorted.sort(function(a, b){
        return a.votes - b.votes;
    })).reverse();

    var str = "<table><tr><thead><td>Subject</td><td>Votes</td><td>Percent</td></thead></tr><tbody>";
    for(var i=0; i<arrSorted.length; i++){
        var imgObj = arrSorted[i];
        str += "<tr><td>" + imgObj.displayName + "</td>" + "<td>" + imgObj.votes + "</td><td>" + imgObj.calcPercent() + "</td></tr>";
    }
    str += "</tbody></table>";

    put('voteTotals', str);
    posBias.report();
}

var posBias = {
    // Track positional bias
    pos_L: 0,
    pos_C: 0,
    pos_R: 0,
    report: function(){
        log("--- Positional Bias ---");
        log("Left clicks: " + this.pos_L);
        log("Center clicks: " + this.pos_C);
        log("Right clicks: " + this.pos_R);
        log("-----------------------");
    }
};

getShowImgs();
