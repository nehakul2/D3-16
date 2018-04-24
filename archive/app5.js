
//When the browser window is resized, responsify() is called
d3.select(window).on('resize',makeResponsive);

makeResponsive();

function makeResponsive(){
var svgArea =d3.select('body').select('svg');
if(!svgArea.empty()) {
    svgArea.remove();
}


// Step 0: Set up our chart
//= ================================

//var svgWidth = 960;
//var svgHeight = 500;
var svgWidth=window.innerWidth;
var svgHeight=window.innerHeight;

var margin = {top: 20, right: 40, bottom: 40, left: 100};
var w = svgWidth - margin.left - margin.right;
var h = svgHeight - margin.top - margin.bottom;


var svg = d3
            .select("body")
            .append("svg")
            .attr("height",svgHeight)
            .attr("width",svgWidth)
            .attr('transform','translate(30,30)');


//Loading Data ...
d3.csv('./data_d3.csv',function(error,healthData){

    if(error) return console.warn(error);

    console.log(healthData);


healthData.forEach(function(data){
    data.Poverty = parseInt(data.Poverty);
    data.Healthcare=parseInt(data.Healthcare);
    data.Abbr = data.stateabbr;
    data.State = data.State;
});

//Tooltips, create tips..
var myToolTip = d3
                .tip()
                .attr('class','tooltip')
                .offset([80,-60])
                .html(function(data){
                       var nameState = data.State;
                       var poverty = data.Poverty;
                       var healthcare = data.Healthcare;
                       return (nameState + '<br>'+'Poverty:'+poverty+'%'+'<br>'+'Healthcare:'+healthcare +'%');
                });

//Tooltip call
svg.append('g')
    .attr('transform','translate(100,-300)')
   .call(myToolTip);

// Define data for the circles
 var elem = svg.selectAll("circle")
               .data(healthData);

//Create and place the blocks
var elemEnter = elem.enter()
                    .append("g")
                    .attr('transform','translate(0,20)');
                

//Create a scale functions
var yScale = d3.scaleLinear()
              .domain([0,d3.max(healthData,function(data){ return +data.Healthcare;})])
              .range([h,0]);

var xScale = d3.scaleLinear()
              .domain([8,d3.max(healthData,function(data){ return data.Poverty;})])
              .range([0,w]);

//Create circle for each data

var circle =  elemEnter.append('circle')
             .attr('cx',function (data,index) {
                 return xScale(data.Poverty);
             })
             .attr('cy', function(data,index){
                 return yScale(data.Healthcare);
             })
             .attr('r','10')
             .attr('stroke','black')
             .attr('stroke-width',1)
             .attr('fill','steelblue')
             .on('click',function(data,index){
                myToolTip.style('opacity',0.9);
                myToolTip.show(data);
             })
             .on('mouseover',function(data,index){
                 myToolTip.show(data);
             })
             .on('mouseout',function(data,index){
                 myToolTip.hide(data);
             })


//Create the text for each circle

 elemEnter.append("text")
            .attr('x',function (data,index) {
                         return xScale(data.Poverty);
                                                })
            .attr('y', function(data,index){
                          return yScale(data.Healthcare);
                                                })
          .attr("dy",".10em")
          .attr("font-size","10px")
          .attr("text-anchor","middle")
          .style("fill","white")
          .text(function(data){return data.Abbr;})


// All x axis related stuff
var bottomAxis = d3.axisBottom(xScale);
 
svg
     .append('g')
     .attr("transform","translate(50,"+(h)+")")
     .call(bottomAxis);

svg 
    .append('g')
    .append('text')
    .attr('transform','translate('+ svgWidth/2+','+ (svgHeight-margin.bottom+15)+')')
    .attr('class','axisText')
    .text("Poverty (%)")

//All y axis related stuff
 var leftAxis = d3.axisLeft(yScale);

 svg
   .append('g')
   .attr("transform","translate(50,0)")
   .attr("stroke","green")
    .call(leftAxis);

svg
   .append('g')
   .append('text')
   .attr('transform','rotate(-90)')
   .attr('y',0-margin.left+margin.right*2)
   .attr('x',0-svgHeight/2)
    .attr('dy','2em')
    .attr('class','axisText')
    .text('Lacks Healthcare(%)');
});

}