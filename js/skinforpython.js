var linefullwidth = 600;
var linefullheight =285;

var linemargin = { top: 20, right: 20, bottom: 40, left: 100};

var linewidth = linefullwidth - linemargin.left - linemargin.right;
var lineheight = linefullheight - linemargin.top - linemargin.bottom;

//Set up date formatting and years
var dateFormat = d3.time.format("%Y");


var linexScale = d3.time.scale()
          .range([ 0, linewidth]);

var lineyScale = d3.scale.linear()
          .range([0, lineheight]);

var linexAxis = d3.svg.axis()
        .scale(linexScale)
        .orient("bottom")
        .ticks(15)
        .tickFormat(function(d) {
          return dateFormat(d);
        });

var lineyAxis = d3.svg.axis()
        .scale(lineyScale)
        .orient("left");


var skinlinetooltip = d3.select("body")
  .append("div")
  .attr("class", "skinlinetooltip");
var firstline = d3.svg.line()
  .x(function(d) {
    return linexScale(dateFormat.parse(d.year));
  })
  .y(function(d) {
    return lineyScale(d.number);
  });

var linesvg = d3.select("#skintrade")
      .append("svg")
      .attr("width", linefullwidth)
      .attr("height", linefullheight)
      .append("g")
      .attr("transform", "translate(" + linemargin.left + "," + linemargin.top + ")");

d3.csv("data/skinforpython.csv", function(myData) {

  // get the min and max of the years in the data, after parsing as dates!
  linexScale.domain(d3.extent(myData, function(d){
      return dateFormat.parse(d.year);
      })
  );

  // the domain is from the max of the emissions to 0 - remember it's reversed.
  lineyScale.domain([ d3.max(myData, function(d) {
      return +d.number;
    }),
    0
  ]);

  console.log("my data", myData);


  linesvg.datum(myData)
    .append("path")
    .attr("class", "lineskin")
    .attr("d", firstline)  // line is a function that will operate on the data array, with x and y.
    .attr("fill", "none")
    .attr("stroke", "rgb(30,99,50)")
    .attr("stroke-width", 3);


  var linecircle = linesvg.selectAll("circle")
                 .data(myData)
                 .enter()
                 .append("circle")


  linecircle.attr("cx",function(d){
    return linexScale(dateFormat.parse(d.year));
  })
    .attr("cy",function(d){
      return lineyScale(d.number);
    })
    .attr("r",3)
    .style("opacity",0)
    .style("fill","white")
    .style("stroke","rgb(30,99,50)")
    .style("stroke-width",3)
    .attr("class", function(d,i){
      return "Year" + d.year;
        });

  linecircle
     .on("mouseover",mouseoverskinline)
     .on("mousemove",mousemoveskinline)
     .on("mouseout",mouseoutskinline);

  linesvg.append("text")
         .attr("class","hoverinfo")
         .attr("transform", "translate(" + (linemargin.left + linewidth / 2) + " ," +
                            (linemargin.bottom/2) + ")")
         .style("text-anchor", "middle")
         .style("fill","rgb(30,99,50)")
         .style("font-style","italic")
         .text("Python Skin Trading Around the World");

   linesvg.append("text")
          .attr("class","hoverinfo")
          .attr("transform", "translate(" + (linemargin.left + linewidth / 2) + " ," +
                             (linemargin.bottom) + ")")
          .style("text-anchor", "middle")
          .style("fill","gray")
          .style("font-style","italic")
          .text("Hover for more information");

  linesvg.append("g")
    .attr("class", "y axis")
    .call(lineyAxis);

  linesvg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + lineheight + ")")
    .call(linexAxis);

  linesvg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - linemargin.left / 1.2) // you may need to adjust this
      .attr("x", 0 - (lineheight / 2)) // you may need to adjust
      .attr("dy", "1em")
      .attr("class","ylabel")
      .style("text-anchor", "middle")
      .text("Amount(Meter)");

    linesvg.append("text")
     .attr("class", "xlabel")
     .attr("transform", "translate(" + (linemargin.left + linewidth / 2) + " ," +
                        (lineheight + linemargin.bottom) + ")")
     .style("text-anchor", "middle")
     .attr("dy", "0px")
     .attr("dx", "-90px")
     .text("Year");


});

function mouseoverskinline(d){
  d3.select(this)
    .transition()
    .duration(50)
    .style("opacity", 1)
    .attr("r", 7);
  skinlinetooltip
    .style("display", null) // this removes the display none setting from it
    .html("<p>Year: " + d.year +
          "<br>Trade Amount: " + d.number + " meters</p>");
}

function mousemoveskinline(d){
  skinlinetooltip
    .style("top", (d3.event.pageY - 10) + "px" )
    .style("left", (d3.event.pageX + 10) + "px");
}

function mouseoutskinline(d){
  d3.select(this)
    .transition()
    .style("opacity", 0)
    .attr("r", 3);
  skinlinetooltip.style("display", "none");
}
