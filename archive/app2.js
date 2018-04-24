
var svgWidth = 960;
var svgHeight = 500;

var margin = {top: 20, right: 40, bottom: 60, left: 100};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select('.chart')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var chart = svg.append('g');


d3.csv('data/data_d3.csv', function(err, Data) {
  if (err) throw err;

  Data.forEach(function(data) {
    data.unemploymentPopulation = +data.poverty;
    data.marriedPopulation = +data.healthcare;
  });

  // Create scale functions
  var yLinearScale = d3.scaleLinear().range([height, 0]);

  var xLinearScale = d3.scaleLinear().range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
  xLinearScale.domain([
    2,
    d3.max(Data, function(data) {
      return +data.unemploymentPopulation;
    }),
  ]);
  yLinearScale.domain([
    0,
    d3.max(Data, function(data) {
      return +data.marriedPopulation * 1.2;
    }),
  ]);

  var toolTip = d3
    .tip()
    .attr('class', 'tooltip')
    .offset([80, -60])
    .html(function(data) {
      var stateAbbr = data.stateAbbr;
      var unemploymentPopulation = +data.unemploymentPopulation;
      var marriedPopulation = +data.marriedPopulation;
      return (
        stateAbbr + '<br> Unemployment %: ' + unemploymentPopulation + '<br> Married %: ' + marriedPopulation
      );
    });

  chart.call(toolTip);

  chart
    .selectAll('circle')
    .data(Data)
    .enter()
    .append('circle')
    .attr('cx', function(data, index) {
      return xLinearScale(data.unemploymentPopulation);
    })
    .attr('cy', function(data, index) {
      return yLinearScale(data.marriedPopulation);
    })
    .attr('r', '10')
    .attr('fill', 'red')
    .on('mouseover', function(data) {
      toolTip.show(data);
    })
    // onmouseout event
    .on('mouseout', function(data, index) {
      toolTip.hide(data);
    });

  chart
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append('g').call(leftAxis);

  chart
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left + 40)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .attr('class', 'axisText')
    .text('Married population of each US state (%)');

  // Append x-axis labels
  chart
    .append('text')
    .attr(
      'transform',
      'translate(' + width / 2 + ' ,' + (height + margin.top + 30) + ')',
    )
    .attr('class', 'axisText')
    .text('Unemployment population of each US state (%)');

});











