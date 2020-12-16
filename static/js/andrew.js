let svgWidth = 1000;
let svgHeight = 500;


let margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};


let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group, and shift the group
// rapper creation!
let svg = d3.select('.chart')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

// Append an SVG Group - shift the group
let chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);


let chosenX = 'state';

function xScale(allData, chosenX) {

  let xLinearScale = d3.scaleLinear()
    .domain([d3.min(allData, d => d[chosenX]) * 0.8, 
      d3.max(allData, d => d[chosenX]) * 1.2
    ])
    .range([0, width]);
  
  return xLinearScale;

function renderAxes(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}


const declineUrl = '/api/v1.0/decline'

async function getData() {
  const response = await fetch(declineUrl);
  const data = await response.json();
  // console.log(data);
  years = []
  states = []
  deadoutVals = []
  ccsynVals = []
  pestVals = []
  data.forEach(event => {
    // years.push(event.year);
    // states.push(event.state);
    // deadoutVals.push(event.deadout);
    // ccsynVals.push(event.cc_syn)
    // pestVals.push(event.pesticides)
    console.log(event);
  });
}


getData().catch(err => console.log(err));