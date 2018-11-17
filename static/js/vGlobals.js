///////////  SVG and Chart Group established for html  ///////////

var svgWidth = 320;
var svgHeight = 260;

var margin = {
  top: 5,
  right: 5,
  bottom: 5,
  left: 5
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG wrapper with SVG group to hold chart and shift by left and top margins.
// d3.select('#chart-box').selectAll('svg').remove("g");

var svg = d3.select("#chart-box")
  // .remove("svg")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// // Initial Params
// var chosenXAxis = "";
// var chosenYAxis = "";