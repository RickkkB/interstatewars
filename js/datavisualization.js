/* hier komt de javascript (en D3!) code */
var HEIGHT = $(window).height() * 0.80;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 var HEIGHT = $(window).height() * 0.70;
}
var WIDTH = $(window).innerWidth() * 4;
var MARGIN = 3;

var BarWidth = 20;
var BarMargin = 10;

var warData = [];
var showData = [];

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

d3.json("./assets/interstatewars.json", function(dataFromFile) {
  warData = dataFromFile;
  showData = dataFromFile;

  warData.forEach(function(d,i) {

    ParseTime = d3.timeParse("%d/%m/%Y");

    d.startDate = ParseTime(d.startDate);
    d.endDate = ParseTime(d.endDate);

       timescale       = d3.scaleLinear()
                          .domain([new Date(1820,1,1), new Date(2006,1,1)])
                          .range([0, WIDTH]);

      formatYear = d3.timeFormat("%Y");

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
        .attr("stroke", "black")
        .attr("stroke-width", "2px")
        .attr("fill-opacity", function(d) {
          var normalizedValue = (d.deathsPerDay) / 1000;
          if ( normalizedValue >= 0.8 ) {
              return 0.8;
          } else {
              return normalizedValue;
          }
        })
        .attr("stroke-opacity", function(d) {
          var normalizedValue = (d.deathsPerDay) / 1000;
          if ( normalizedValue >= 0.8 ) {
              return 0.8;
          } else {
              return normalizedValue;
          }
        })
        .on("mouseover", function() {
            d3.select(this)
            .transition()
            .attr("stroke", "white")
            .attr("stroke-opacity", "1")
            .attr("stroke-width", "3px");
        })
        .on("mouseout", function(d, i) {
            d3.select(this)
            .transition()
            .attr("stroke", "black")
            .attr("stroke-width", "2px")
            .attr("stroke-opacity", function(d) {
              var normalizedValue = (d.deathsPerDay) / 1000;
              if ( normalizedValue >= 0.8 ) {
                  return 0.8;
              } else {
                  return normalizedValue;
              }
            })
        })
        .on("click", function(d) {
            $(".warInfo").addClass("isOpen")
            $("#specificWarInfo").remove()
            $(".warInfo").append("<div id='specificWarInfo'><h2>" +d.warName + "</h2>" + "<h3>Started at " + d.startMonth + "-" + d.startDay + "-" + d.startYear + " and lasted " + d.days + " days.<p></p>" +"The war has a total of " + d.battleDeaths + " battle deaths, with an average of " + d.deathsPerDay + " fallen soldiers per day." + "</h3></div>");
        });

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

    //D3 Text color fix
    d3.selectAll("text").attr("fill", "white");

  //UPDATE
  binding
    .transition()

  binding
    .exit()
    .remove();

    $(".closeButton").on("click",function(e){
        $(this).parent().toggleClass("isOpen");
        $(this).siblings().remove();
    });
}
