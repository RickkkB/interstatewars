/* hier komt de javascript (en D3!) code */
var HEIGHT = $(window).height() *0.82;
var WIDTH = $(window).innerWidth() * 4;
var MARGIN = 3;

var BarWidth = 20;
var BarMargin = 10;

var warData = [];

var svg = d3.select("#chart")
  .append("svg")
  .attr("height", HEIGHT)
  .attr("width", WIDTH);

var margin = {
    top: 10,
    right: 20,
    bottom: 10,
    left: 50
  },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom,
  padding = 100;
  g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime()
  .rangeRound([0, width]);

var y = d3.scaleLinear()
  .rangeRound([height, 0]);

//  var ryScale = d3.scale.linear()
//        .domain([0,7600])
//        .range([0,20]);
//
//
// console.log(ryScale);

d3.json("../assets/interstatewars.json", function(dataFromFile) {
  warData = dataFromFile;

  warData.forEach(function(d,i) {


    ParseTime = d3.timeParse("%d/%m/%Y");

    d.startDate = ParseTime(d.startDate);
    d.endDate = ParseTime(d.endDate);

       timescale       = d3.scaleLinear()
                          .domain([new Date(1820,1,1), new Date(2004,1,1)])
                          .range([0, WIDTH]);

      formatYear = d3.timeFormat("%Y");
      console.log("-----------------------------")
      console.log(timescale(d.startDate));
      console.log(timescale(d.endDate));

      deathscale      = d3.scalePow().exponent(0.4)
                       .domain([0, 8000])
                       .range([HEIGHT-30, 0]);
    });

  visualize();
})

function visualize() {
  var binding = svg.selectAll("ellipse")
    .data(warData, function(d) {
      return d.warNum
    });


  //ENTER
  binding
    .enter()
    .append("ellipse")
        .style("fill", "black")
        .attr("num", function(d) {
          return d.warNum;
        })
        .attr("rx", function(d) {
          return (timescale(d.endDate))-(timescale(d.startDate));
        })
        .attr("ry", function(d) {
          return (deathscale(0) - deathscale(d.deathsPerDay));
        })
        // .attr("cx", function(d, i) {
        //   return i * BarWidth;
        // })
        .attr("cx", function(d, i) {
          return timescale(d.startDate);
        })
        .attr("cy", HEIGHT)
        .attr("fill-opacity", function(d) {
          var normalizedValue = (d.deathsPerDay) / 1000;
          if ( normalizedValue >= 0.8 ) {
              return 0.8;
          } else {
              return normalizedValue;
          }
        })

  // for (var i = 0; i < warData.length; i++) {
  //   warData[i].StartDate1 = ParseTime(warData[i].StartDate1);
  // }
  // warData.StartDate1 = parseTime(warData.StartDate1);

  y.domain(d3.extent(warData, function(d) {
    return deathscale(d.deathsPerDay);
  }));

  var xAxis = d3.axisTop()
     .scale(timescale);

     // Add the X Axis
     g.append("g")
         .attr("class", "xAxis")
         .attr("transform", "translate(0," + 20 + ")")
         .call(d3.axisTop(timescale)
                 .tickFormat(d3.timeFormat("%Y")))
         .attr("stroke-opacity", "0.2")
         .selectAll("text")
           .style("text-anchor", "middle")
           .attr("fill", "white")

  // g.append("g")
  //   .attr("transform", "translate(0," + height + ")")
  //   .call(d3.axisBottom(x))
  //   .select(".domain")
  //   .remove();
  //
  // svg.append("g")
  //     .attr("class", "axis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(d3.axisBottom(x)
  //             .tickFormat(warData.StartDate1))
  //     .selectAll("text")
  //       .style("text-anchor", "end")
  //       .attr("dx", "-.8em")
  //       .attr("dy", ".15em")
  //       .attr("transform", "rotate(-65)");

var yAxis = d3.axisLeft()
   .scale(deathscale);


  g.append("g")
    .attr("class", "yAxis")
    .attr("transform", "translate(0," + 20 + ")")
    .call(d3.axisLeft(deathscale))
    .attr("stroke-opacity", "0.2")
    .select("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")

  // g.append("path")
  //   .datum(warData)
  //   .attr("fill", "none")
  //   .attr("stroke", "white")
  //   .attr("stroke-linejoin", "round")
  //   .attr("stroke-linecap", "round")
  //   .attr("stroke-width", 1.5)
  //   .attr("d", line);

  //UPDATE
  binding
    .transition()

  binding
    .exit()
    .remove();
}
