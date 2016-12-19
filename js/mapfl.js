
var mapwidth = 550;
    mapheight = 350;
// Not going to lie, there's a ton of trial and error here.
var projection = d3.geo.conicEqualArea()
      .parallels([31,25])
      .rotate([81, 0])
      .center([-2, 27])
      .translate([230,250])
      .scale(2650);
var newdata = {};

var parseDate = d3.time.format("%Y").parse;
var outputDate = d3.time.format("%Y");

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#vis").append("svg")
    .attr("width", mapwidth)
    .attr("height", mapheight);

var maptooltip = d3.select("#maptooltip").attr("class", "maptooltip")
.style("opacity", 0);

var idLookup = d3.map();
//chart tooltip
var ttfh = 160;
var ttfw = 200;

var margin = {top:20, bottom:30,left:40,right:35};

var tth = ttfh - margin.top - margin.bottom;
var ttw = ttfw - margin.left - margin.right;

var xScale = d3.time.scale().range([0,ttw]);
var yScale = d3.scale.linear().range([tth,0]).domain([0,200]);
var yAxis = d3.svg.axis()
   .scale(yScale)
   .orient("left")
   .tickFormat(d3.format(",d"))
   .ticks(2)
  //  .tickValues([0,1,2,10,20,40,200])
   .tickPadding([1])
   .tickSize([0]);

var line = d3.svg.line()
   .x(function(d){
     return xScale(parseDate(d.year));
   })
   .y(function(d){
     return yScale(+d.amount);
   });

var area = d3.svg.area()
   .x(function(d){
     return xScale(parseDate(d.year));
   })
   .y(function(d){
     return yScale(+d.amount);
   });


var tooltipChart = maptooltip
     .append("svg")
     .attr("class","tooltipChart")
     .attr("width",ttfw)
     .attr("height",ttfh)
     .append("g")
     .attr("transform","translate(" + margin.left + "," + margin.top + ")");



// all our data is a binary 1 or 2 for this dataset.
// var colorScale = d3.scale.linear().range(["#fee0d2", "#de2d26"]).domain(["0", "2051"]);

// we use queue because we have 2 data files to load.
queue()
  .defer(d3.json, "data/us_counties_topo.json")
  .defer(d3.csv, "data/python.csv", typeAndSet) // process
  .await(loaded);

function loaded(error, us, data) {

  console.log(data);
  if (error) throw error;

  var states = topojson.feature(us, us.objects.states).features;
  var florida = states.filter(function(d) { return d.id == 12;})[0];
  var counties = topojson.feature(us, us.objects.counties).features;
  var flcounties = counties.filter(function(d) {
    return d.id.toString().match(/^12/); // look for counties starting with 12
  });
  console.log(flcounties);

  var number=[];
  data.forEach(function(d,i){
    number.push(+d.number);
  })
  console.log(number);

  var colorScale = d3.scale.linear()
    .domain([0,70,100,200,2100])
    .range(["#E9FFD2", "rgb(122,200,124)"]).interpolate(d3.interpolateLab);


  console.log('Extent is ', d3.extent(number));
  svg.selectAll("path.state")
    .data(florida)
    .enter().append("path")
      .attr("d", path)
      .attr("class", "state")
      .attr("fill","gray");

  svg.selectAll("path.county")
      .data(flcounties)
    .enter().append("path")
      .attr("d", path)
      .attr("class", "county")
      .attr("fill", function(d,i) {
        var data = idLookup.get(d.id);
        if (data) {
          return colorScale(+data.number);
        } else {
          return "darkgray";
        }
      })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);

      svg.append('image')
      .attr('xlink:href','image/legendformap.png')
      .attr("transform", "translate(" + (linemargin.left-40) + " ," +
                         (linemargin.bottom*4) + ")")
      .attr('class', 'pico')
      .attr('height', '150')
      .attr('width', '150');

  svg.append("text")
     .attr("class","hoverinfo")
     .attr("transform", "translate(" + (linemargin.left + linewidth / 12) + " ," +
                        (linemargin.bottom*6.9) + ")")
     .style("text-anchor", "middle")
     .style("fill","rgb(30,99,50)")
     .style("font-style","italic")
     .text("Number of Burmese Python found");

 svg.append("text")
    .attr("class","hoverinfo")
    .attr("transform", "translate(" + (linemargin.left + linewidth / 12) + " ," +
                       (linemargin.bottom*7.3) + ")")
    .style("text-anchor", "middle")
    .style("fill","rgb(30,99,50)")
    .style("font-style","italic")
    .text("in the South Florida County");


 svg.append("text")
    .attr("class","hoverinfo")
    .attr("transform", "translate(" + (linemargin.left + linewidth / 12) + " ," +
                       (linemargin.bottom*8) + ")")
    .style("text-anchor", "middle")
    .style("fill","gray")
    .style("font-style","italic")
    .text("Hover for more information");


//below is tooltip chart
      var years = d3.keys(data[0]).filter(function(d){
        return d.startsWith("1") || d.startsWith("2");
      });
      console.log(years);

      data.forEach(function(d,i){
        var amountpy = [];
        years.forEach(function(y){
          if(d[y]){
            amountpy.push({
              max: d.max,
              county_code: d["FIPStxt"],
              countyname : d["County_name"],
              year: y,
              amount: +d[y]
            });
          }
        });
        newdata[d["County_name"]] = amountpy;

      });
        console.log(newdata);
        xScale.domain(d3.extent(years, function(d){
         return parseDate(d);
        }));

        yScale.domain([0,d3.max(newdata.OrangeCounty,function(d){
          return +d.amount;
        })]);


      tooltipChart.datum(newdata.OrangeCounty)
      .append("path")
      .attr("class","area")
      .attr("d",area);

      tooltipChart
      .append("g")
      .attr("class","linechart")
      .append("path")
      .attr("class","line")
      .attr("d",line);

      tooltipChart.append("text")
          .attr("x", 0)
          .attr("y", tth + margin.bottom/2)
            .attr("class", "static_year")
          .style("text-anchor", "start")
          .text(function(d) { return outputDate(parseDate(d[0].year)); });

        tooltipChart.append("text")
          .attr("x", ttw)
          .attr("y", tth + margin.bottom/2)
          .attr("class", "static_year")
          .style("text-anchor", "end")
          .text(function(d) { return outputDate(parseDate(d[d.length - 1].year));});
        //
        // tooltipChart.append("text")
        //   .attr("x", ttw + margin.bottom/2)
        //   .attr("y",0)
        //   .attr("class", "static_year")
        //   .style("text-anchor", "end")
        //   .text(function(d){
        //     return d[0].max;
        //
        //   });


        tooltipChart.append("g")
            .call(yAxis)
            .attr("class","y axis")
            .selectAll("text")
            .style("text-anchor","end");


    function mouseover(d) {

        d3.select(this)
          .transition()
          .style("stroke", "steelblue")
          .style("stroke-width", "2");

        d3.select(this).moveToFront();

        var data = idLookup.get(d.id);
        console.log(data);
        // console.log(newdata[data.County_name]);

        maptooltip
          .style("display", null)
          .style("opacity",0.8) // this removes the display none setting from it
          if (data){
         maptooltip.select(".name").text(data.County_name);
         maptooltip.select(".val").text(data.number);


        } else {
        maptooltip.select(".name").text("No data for " + data.County_name);
        maptooltip.select(".val").text("NA");
        }

          yScale.domain([0, d3.max(newdata[data.County_name], function(u){
               return +u.amount;

           })]);
          // console.log(newdata[data.County_name]);
           d3.select(".area")
             .datum(newdata[data.County_name])
             .attr("d",area);

         d3.select(".tooltipChart .line")
             .datum(newdata[data.County_name])
             .attr("d",line);

         d3.select(".tooltipChart .y.axis")
             .call(yAxis);


      }
}

  function typeAndSet(d) {
    // create the lookup hash for the county id in the map (id) and data (fipstxt)
    idLookup.set(+d.FIPStxt, d);
    return d;
  }

  d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };

  function mousemove(d) {
    maptooltip
      .style("top", (d3.event.pageY - 10) + "px" )
      .style("left", (d3.event.pageX + 10) + "px");
    }


  function mouseout(d) {
    d3.select(this)
      .transition()
      .style("stroke", null)
      .style("stroke-width", null);

    maptooltip.style("display", "none");  // this sets it to invisible!
  }
