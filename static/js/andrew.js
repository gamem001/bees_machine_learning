
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 760 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;


var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


var x = d3.scaleBand()
  .range([ 0, width ])
  .padding(1);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")


var y = d3.scaleLinear()
  .range([ height, 0]);

var yAxis = svg.append("g")
  .attr("class", "myYaxis")
  
function update(selectedVar) {

  
  d3.json("/api/v1.0/decline", function(data) {

    
    x.domain(data.map(function(d) { return d.state; }))
    xAxis
      .transition()
      .duration(1000)
      .call(d3.axisBottom(x))
    
    .selectAll('text')
      .attr('y',0)
      .attr('x', 10)
      .attr('dy','.35em')
      .attr('transform','rotate(90)')
      .style('text-anchor','start')

    
    y.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    
    var j = svg.selectAll(".myLine")
      .data(data)
    
    j
      .enter()
      .append("line")
      .attr("class", "myLine")
      .merge(j)
      .transition()
      .duration(1000)
        .attr("x1", function(d) { console.log(x(d.state)) ; return x(d.state); })
        .attr("x2", function(d) { return x(d.state); })
        .attr("y1", y(0))
        .attr("y2", function(d) { return y(d[selectedVar]); })
        .attr("stroke", "#010101")


    
    var u = svg.selectAll("circle")
      .data(data)
    
    u
      .enter()
      .append("circle")
      .merge(u)
      .transition()
      .duration(1000)
        .attr("cx", function(d) { return x(d.state); })
        .attr("cy", function(d) { return y(d[selectedVar]); })
        .attr("r", 6)
        .attr("fill", "#FCD615");
  })

}


update('deadout')