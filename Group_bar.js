
var margin = {top: 10, right: 120, bottom: 300, left: 30},
width = 1100 - margin.left - margin.right,
height = 800 - margin.top - margin.bottom;

d3.json('Group_bar.json')
.then(data =>{
  const div = d3.select("#chart").append("div")
.attr("class", "tooltip-scatter")
.style("opacity", 0);


var x0  = d3.scaleBand().rangeRound([0, width], .5);
var x1  = d3.scaleBand();
var y   = d3.scaleLinear().rangeRound([height, 0]);

var xAxis = d3.axisBottom().scale(x0)
            .tickValues(data.map(d=>d.key));

var yAxis = d3.axisLeft().scale(y);

const color = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select('#chart').append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var categoriesNames = data.map(function(d) { return d.key; });
var rateNames       = data[0].values.map(function(d) { return d.grpName; });

x0.domain(categoriesNames);
x1.domain(rateNames).rangeRound([0, x0.bandwidth()]);
y.domain([0, d3.max(data, function(key) { return d3.max(key.values, function(d) { return d.grpValue; }); })]);

svg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + height + ")")
.call(xAxis);


svg.append("g")
.attr("class", "y axis")
.style('opacity','0')
.call(yAxis)
.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 6)
.attr("dy", ".71em")
.style("text-anchor", "end")
.style('font-weight','bold')
.style('font-size','16px')
.text("Value");

svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

var slice = svg.selectAll("chart")
.data(data)
.enter().append("g")
.attr("class", "g")
.attr("transform",function(d) { return "translate(" + x0(d.key) + ",0)"; });

slice.selectAll("rect")
.data(function(d) { return d.values; })
.enter().append("rect")
.attr("width", x1.bandwidth())
.attr("x", function(d) { return x1(d.grpName); })
.style("fill", function(d) { return color(d.grpName) })
.attr("y", function(d) { return y(0); })
.attr("height", function(d) { return height - y(0); })

.on('mouseenter', event => {
  div.transition()
    .duration(200)
    .style("opacity", 0.9);
  div.html(event.path[1].__data__.key + "<br/>" + event.path[0].__data__.grpName + "<br/>" + ": " + event.path[0].__data__.grpValue + "<br/>" + "" )
    .style("left", `${event.pageX + 40}px`)
    .style("top", `${event.pageY - 28}px`);

})



.on("mouseleave", event => {
  console.log('mouse left');
  div.transition()
  .duration(500)
  .style("opacity", 0);
});

//mouse leave/enter function here


slice.selectAll("rect")
.transition()
.delay(function (d) {return Math.random()*1000;})
.duration(1200)
.attr("y", function(d) { return y(d.grpValue); })
.attr("height", function(d) { return height - y(d.grpValue); });

//Legend
var legend = svg.selectAll(".legend")
.data(data[0].values.map(function(d) { return d.grpName; }).reverse())
.enter().append("g")
.attr("class", "legend")
.attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
.style("opacity","0");

legend.append("rect")
.attr("x", width +20)
.attr("width", 18)
.attr("height", 18)
.style("fill", function(d) { return color(d); });

legend.append("text")
.attr("x", width +38)
.attr("y", 9)
.attr("dy", ".35em")
.style("text-anchor", "auto")
.text(function(d) {return d; });

legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");

  
})


