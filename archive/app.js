//When the browser window is resized, responsify() is called
d3.select(window).on('resize',makeResponsive);

makeResponsive();

function makeResponsive(){
var svgArea =d3.select('body').select('svg');
if(!svgArea.empty())
     {
    svgArea.remove();
    }
}

// Define SVG area dimensions
var svgWidth = 1000;
var svgHeight = 700;

// Define the chart"s margins as an object
var margin = {top:30, right:40, bottom:40, left:100};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Select body, append SVG area to it, and set the dimensions
var svg = d3.select(".body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)
  .append("g")
  .attr("transform", 'translate(${margin.left},${margin.top})');



// Append a div to the body to create tooltips, assign it a class
d3.select(".chart").append("div").attr("class","tooltip").style("opacity", 0);  

// Get the data from the csv file.
d3.csv("data/data_d3.csv", function(error, d3data) {
    if (error) return console.warn(error);

    d3data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.state = data.stateabbr;
        data.stateName = data.State;
        console.log(data.poverty,data.healthcare,data.state,data.stateName)
    });

 // Initialize tooltip 
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
         // The html() method allows us to mix JavaScript with HTML in the callback function
        .html(function(data) {
            var stateName = data.stateabbr;
            var poverty = +data.poverty;
            var healthcare = +data.healthcare;
            //console.log("in tool tip ",stateName , poverty,healthcare)
            return ( 
                stateName + "<br> Poverty: " + poverty + "% <br> No Health Coverage: " + healthcare +"%"
            );
        });

//append svg group
svg.append("g")
    .attr('transform','translate(100,-300)')
    .call(myToolTip);
//lets create the toolTip
//chart.call(toolTip);


// define scale  finctions
var xLinearScale = d3.scaleLinear().range([0, width]);
var yLinearScale = d3.scaleLinear().range([height, 0]);


// Create axis functions
var bottomAxis = d3.axisBottom().scale(xLinearScale);
var leftAxis = d3.axisLeft().scale(yLinearScale);



// set the default x-axis
var defaultAxisLabelX = "In Poverty (%)"

//set default to Y axis
var defaultAxisLabelY = "Lack of Health Care Coverage (%)"

// Scale the domain
 xLinearScale.domain([
    2,
    d3.max(d3data, function(data) {
      return +data.poverty;
    }),
  ]);
yLinearScale.domain([
    2,
    d3.max(d3data , function(data){
        return +data.healthcare;
    }),
    ]);

   
// Add the scatterplot
chart.selectAll("circle")
    .data(d3data)
    .enter()
    .append("circle")
    .attr("cx", function(data,index) { 
      return xLinearScale(data.poverty)
     })
    .attr("cy", function(data,index) {
     return yLinearScale(data.healthcare)
   })
    .attr("r", 15)
    .attr("fill", "lightblue")
    .attr("opacity",0.75)
    // display tooltip on click
    .on("mouseenter", function(data) {
        toolTip.show(data);
    })
    // hide tooltip on mouseout
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });



//create state labels

chart.selectAll("text")
    .data(d3data)
    .enter()
    .append("text")
    .text(function(data){
        return(data.stateabbr) 
    })
    .attr("cx", function(data,index) { 
      return xLinearScale(data.poverty)
     })
    .attr("cy", function(data,index) {
     return yLinearScale(data.healthcare)
   })
    .attr("font-size", "12px")
    .attr("text-anchor", "middle")
    // display tooltip on click
    .on("mouseenter", function(data) {
        toolTip.show(data);
    })
    // hide tooltip on mouseout
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });


 // Add the X Axis
    chart.append("g")
        .attr("transform", "translate(0,${height})")
        .call(bottomAxis);

// Aappend a group for Y and then add it
  chart.append("g").call(leftAxis);

// Append x-axis labels
chart
    .append("text")
    .attr("transform", 'translate(${width - 40},${height - 5}))'
    .attr("class", "axis-text")
    .text("In Poverty (%)");

 // Append y-axis label
    chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left + 40)
        .attr("x", 0 - height/1.3)
        .attr("dy","1em")
        .attr("class", "axis-text")
        .text("Lack of Health Care Coverage (%)")

//Now lets add label to each point
chart.append("text")
      .style("text-anchor" ,"middle")
      .style("font-size" , "12px")
      .selectAll("tspan")
      .data(d3data)
      .enter()
      .append("tspan")
            .attr("x", function(data) {
                return xLinearScale(data.poverty - 0);
            })
            .attr("y", function(data) {
                return yLinearScale(data.healthcare - 0.2);
            })
            .text(function(data) {
                return data.state
            });   
 

