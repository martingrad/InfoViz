function donut(){

  var self = this; // for internal d3 functions

  var donutDiv = $("#donut");
  //var testDiv = $("creatingButtons");

  var width  = donutDiv.width(),
      height = donutDiv.height(),
      radius = Math.min(width, height) * 0.6;

  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // ["Moderaterna", "Centerpartiet", "Folkpartiet", "Kristdemokraterna", "Miljöpartiet", "Socialdemokraterna", "Vänsterpartiet", "Sverigedemokraterna", "övriga partier"];
  var color = d3.scale.ordinal()
      .range(["#1B49DD", "#009933", "#6BB7EC", "#231977", "#83CF39", "#EE2020", "#AF0000", "#DDDD00", "gray"]);

  var pie = d3.layout.pie()
      .value(function(d,i){return d;})
      .sort(null);

  var welcomeMessage = "a";

  var arc = d3.svg.arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius - 50);

  var svg = d3.select("#donut").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  self.data = [];
  self.headers = d3.keys(dataz[0]).filter(function(d){
    return d != "region" && d!= "befolkning" && d!="arbetslösa" && d!="år" && d!="arbetslöshet" && d!="inkomst";
  });

  for(var i = 0; i < dataz.length; i++)
  {
    if(dataz[i]["år"] == "2010"){     //default year 2010
      self.data.push(dataz[i]);
    }
  }

  //document.getElementById('creatingButtons').innerHTML = createButtons(self.data);
  self.region = "Välj kommun";          //default region
  //showInformation(self.region);
  showDefaultInformation();



  /* ======== Private functions ======== */
  /* =================================== */

  function showDefaultInformation(){
    var extraText = svg.selectAll(".extraText")
      .data(welcomeMessage)
      .enter()
      .append("g")
      .attr("class","extraText");

    extraText.append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("font", "bold 18px Arial")
      .attr("class", "inside")
      .text(function(d){return "Välkommen till denna underbara sida.";});

    
  }

  function showInformation(region)
  {
    svg.selectAll('.arc').remove();
    svg.selectAll(".extraText").remove();
    svg.selectAll(".legend").remove();

    self.region = region;

    var tempData = [];
    var parties = [];
    
    for(var i = 0; i < self.data.length; i++){
      if(self.data[i]["region"] == region){
        tempData.push(self.data[i]);
        for(var j = 0; j<self.headers.length; j++)
        {
          parties.push(self.data[i][self.headers[j]]);
        }
      }
    }

    var g = svg.selectAll(".arc")
      .data(pie(parties))
      .enter().append("g")
      .attr("class","arc");

    g.append("path")                          // cirkelskivorna
      .attr("fill", function(d, i) { 
        return color(i); 
      })
      .attr("d", arc)
      .on("mousemove", function(d,i)
      {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);

        tooltip.html(self.headers[i] + " " + d.value + "%")                           // plotta i tooltip namnet på regionerna
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 28) + "px"); 
      })
      .on("mouseout", function(d)
      {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    g.append("text")                        // text i pajbiten
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d,i) { 
        return d.value + "%";
      })
      .style("fill",function(d){return "#ffffff"});       // vit text i en paj-bit

    var legendRectSize = 18;
    var legendSpacing = 4;

    // Extra text i mitten av pajen
    console.log(width);
    console.log(height);

    var extraText = svg.selectAll(".extraText")
      .data(tempData)
      .enter()
      .append("g")
      .attr("class","extraText");

    extraText.append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("font", "bold 12px Arial")
      .attr("class", "inside")
      .text(function(d) { return "Valresultat i " + self.region; });

    extraText.append("text")
      .attr("dy", "2em")
      .style("text-anchor", "middle")
      .style("font", "bold 10px Arial")
      .attr("class", "data")
      .text(function(d) { return d["år"]; })
      .style("fill", function(d){return "gray"});

    extraText.append("text")
      //.attr("dy", "4em")
      .attr("transform", "translate(" + width / 3 + "," + height / 2.6 + ")")
      .style("text-anchor", "middle")
      .style("font", "bold 12px Arial")
      .attr("class", "donutInkomst")
      .text(function(d) {  return "Medelinkomst: " + d["inkomst"]; + "tkr/år" });

    extraText.append("text")
      //.attr("dy", "4em")
      .attr("transform", "translate(" + width / 3 + "," + height / 3.0 + ")")
      .style("text-anchor", "middle")
      .style("font", "bold 12px Arial")
      .attr("class", "donutInkomst")
      .text(function(d) {  return "Arbetslöshet: " + Math.round(d["arbetslöshet"] * 100)/100 + "%"; });

    // Adding a color legend for the parties
    var legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing;
        var offset =  height * color.domain().length / 2.0;
        var horz = - radius * 0.075 * legendRectSize;
        var vert = i * height - offset;
      return 'translate(' + horz + ',' + vert + ')';
    });

    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color);

    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function(d,i) { return self.headers[i]; });
  }

  /* ======== Public functions ======== */
  /* ================================== */
  this.deselectPie = function(){
    svg.selectAll('.arc').remove();
    svg.selectAll(".extraText").remove();
    svg.selectAll(".legend").remove();
  };

  this.selectYear = function(value)
  {
    var inputValue = value;
    self.data = [];
    
    for(var i = 0; i < dataz.length; i++)
    {
      if(dataz[i]["år"] == inputValue){
        self.data.push(dataz[i]);
      }
    }
    if(self.region != "Välj kommun")
      showInformation(self.region);
  };

  this.selectPie = function(value)
  {
      showInformation(value);
  };

  this.selectPieFromSelect = function()
  {
    var selectedRegion = $("#selectScatterPlotYAxis option:selected").text();
    if(selectedRegion != "Välj kommun"){
      showInformation(selectedRegion);
      map.selectCountry(selectedRegion);
      pc1.selectLine(selectedRegion);
    }
    else
    {
      self.region = "Välj kommun";
      map.deselectCountry();
      pc1.deselectLine();
      donut.deselectPie();
      showDefaultInformation();
    }
  }
}
