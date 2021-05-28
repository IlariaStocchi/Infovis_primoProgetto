var width = 1800;
var height = 900; 

var margin = 200;

var scaleCoordinateX = d3.scaleLinear();
var scaleCoordinateY = d3.scaleLinear();
var scaleWings = d3.scaleLinear();

var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);

var counterVariableWing = 0;

function updateWingScale(dataset){
    let min;
    let max;
    let min_wings = d3.min(dataset, function(element){return element["wings"]});
    let min_val1 = d3.min(dataset, function(element){return element["v1"]});
    let min_val2 = d3.min(dataset, function(element){return element["v2"]});
    let max_wings = d3.max(dataset, function(element){return element["wings"]});
    let max_val1 = d3.max(dataset, function(element){return element["v1"]});
    let max_val2 = d3.max(dataset, function(element){return element["v2"]});
    if(max_wings > max_val1){
        max = max_wings;
    }
    else{
        max = max_val1;
    }
    if(max_val2 > max){
        max = max_val2;
    }
    if(min_wings > min_val1){
        min = min_wings;
    }
    else{
        min = min_val1;
    }
    if(min_val2 > min){
        min = min_val2;
    }
    scaleWings.domain([min, max]).range([0.25,1.2]);
}
function updateScales(dataset){
    scaleCoordinateX.domain([d3.min(dataset, function(element){return element["x"]}), d3.max(dataset, function(element){return element["x"]})]).range([100, width-margin]);
    scaleCoordinateY.domain([d3.min(dataset, function(element){return element["y"]}), d3.max(dataset, function(element){return element["y"]})]).range([100, height-margin]);
    updateWingScale(dataset);
}

function drawLeftWing(data){
    let scaled = scaleWings(data.wings);
    let remainder = counterVariableWing % 3;
    if(remainder == 1){
        scaled = scaleWings(data.v1);
    }
    if(remainder == 2){
        scaled = scaleWings(data.v2);
    }
    
    return "m50,50c0,0 " + (scaled*-33) + "," + (scaled*-106) + " " + (scaled*-62) + "," + (scaled*-75) + "c" + (scaled*-29) + "," + (scaled*30) + " " + (scaled*19) + "," + (scaled*76) + " " + (scaled*19) + "," + (scaled*76) + "c0,0 " + (scaled*-32) + "," + (scaled*46) + " " + (scaled*-18) + "," + (scaled*57) + "c" + (scaled*14) + "," + (scaled*10) + " " + (scaled*60) + "," + (scaled*-55) + " " + (scaled*61) + "," + (scaled*-57);

}

function drawRightWing(data){
 
    let scaled = scaleWings(data.wings);
    let remainder = counterVariableWing % 3;
    if(remainder == 1){
        scaled = scaleWings(data.v1);
    }
    if(remainder == 2){
        scaled = scaleWings(data.v2);
    }
    
    return "m60,50c" + (scaled*1) + "," + (scaled*-3)+ " " + (scaled*-16) + "," + (scaled*-94) + " " + (scaled*53) + "," + (scaled*-80.5) + "c" + (scaled*37) + "," + (scaled*13.5) + " " + (scaled*-13) + "," + (scaled*78.5) + " " + (scaled*-13) + "," + (scaled*78) + "c0,0 " + (scaled*31) + "," + (scaled*52.5) + " " + (scaled*14) + "," + (scaled*61) + "c" + (scaled*-17) + "," + (scaled*8.5) + " " + (scaled*-55) + "," + (scaled*-55.5) + " " + (scaled*-54) + "," + (scaled*-58.5) + "z";
    
}

function changeWingDimension(){
    counterVariableWing++;
    var butterflyContainer = d3.select("svg").selectAll("g").join();
    butterflyContainer.selectAll("path.left_wing").transition().duration(2000).attr("d", drawLeftWing);
    butterflyContainer.selectAll("path.right_wing").transition().duration(2000).attr("d", drawRightWing);
    
}

function draw(dataset){
    var butterflyContainer = d3.select("svg").selectAll("g")
                            .data(dataset)
                            .enter().append("g")
                            .attr("transform", function(data) {return "translate(" + scaleCoordinateX(data.x) + "," + scaleCoordinateY(data.y) + ")" ;});
                            
    butterflyContainer.append("path")
        .attr("class", "left_wing")
        .attr("d", drawLeftWing)
        .attr("fill", "#ffcccc")
        .attr("stroke", "black");
        
    butterflyContainer.append("path")
        .attr("class", "right_wing")
        .attr("d", drawRightWing)
        .attr("fill", "#ffcccc")
        .attr("stroke", "black");
        
    butterflyContainer.append("ellipse")
        .attr("class", "butterfly_body")
        .attr("cy", 50) //+22
        .attr("cx", 54) //+35
        .attr("ry", 23.5) //23.5
        .attr("rx", 6.5) //6.5
        .attr("fill", "#996633")
        .attr("stroke", "black");
        
    d3.selectAll("path.left_wing").on("click", changeWingDimension);
    d3.selectAll("path.right_wing").on("click", changeWingDimension);
    d3.selectAll("ellipse.butterfly_body").on("click", changeWingDimension);
}


d3.json("data/dataset.json")
	.then(function(dataset) {
        datapoints = dataset;
        updateScales(dataset);
        draw(dataset);
    });
