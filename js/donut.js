function donut(){

  var self = this; // for internal d3 functions

  var donutDiv = $("#donut");
  var margin = [0, 0, 0, 0],
      width = donutDiv.width() - margin[1] - margin[3],
      height = donutDiv.height() - margin[0] - margin[2]
      radius = Math.min(width, height) * 0.55;

  // ["Moderaterna", "Centerpartiet", "Folkpartiet", "Kristdemokraterna", "Miljöpartiet", "Socialdemokraterna", "Vänsterpartiet", "Sverigedemokraterna", "övriga partier"];
  var color = d3.scale.ordinal()
      .range(["#1B49DD", "#009933", "#6BB7EC", "#231977", "#83CF39", "#EE2020", "#AF0000", "#DDDD00", "gray"]);

  var pie = d3.layout.pie()
      .value(function(d,i){return d;})
      .sort(null);

  var arc = d3.svg.arc()
      .innerRadius(radius -120)
      .outerRadius(radius - 50);

  var svg = d3.select("#donut").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  self.data = [];
  self.headers = d3.keys(dataz[0]).filter(function(d)
  {
    return d != "region" && d!= "befolkning" && d!="arbetslösa" && d!="år" && d!="arbetslöshet" && d!="inkomst";
  });

  for(var i = 0; i < dataz.length; i++)
  {
    if(dataz[i]["år"] == "2010"){     //default year 2010
      self.data.push(dataz[i]);
    }
  }
  self.region = "Stockholm";          //default region
  showInformation(self.region);


  /* ======== Private functions ======== */
  /* =================================== */

  function showInformation(region)
  {
    svg.selectAll('.arc').remove();

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
      .attr("d", arc);

    g.append("text")                        // text
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d,i) { 
        //return d[i];
        //console.log(self.headers[i]);
        //console.log(d);
        return d.value + "%";
        //return self.headers[i]; 
      })
      .style("fill",function(d){return "#ffffff"});       // vit text i en paj-bit

    var legendRectSize = 18;
    var legendSpacing = 4;

    // Extra text i mitten av pajen
    var extraText = svg.selectAll(".extraText")
      .data(tempData)
      .enter()
      .append("g")
      .attr("class","extraText")
      .attr("transform", function(d)
      {
        // var height1 = legendRectSize + legendSpacing;
        var height1 = 125;
        var offset1 =  -height1; //* color.domain().length / 2;
        var horz1 = -13 * legendRectSize;
        var vert1 = -offset1;
        return 'translate(' + horz1 + ',' + vert1 + ')';
      })

      svg.append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("font", "bold 12px Arial")
      .attr("class", "inside")
      .text(function(d) { return "Valresultat i " + self.region; });

      svg.append("text")
        .attr("dy", "2em")
        .style("text-anchor", "middle")
        .attr("class", "data")
        .text(function(d,i) { return tempData[i]["år"]/*d["år"]*/; });
        // .style("fill", function(d){return "gray"});

    // extraText.append("text")
    //   .attr("x", legendRectSize + legendSpacing)
    //   .attr("y", legendRectSize - legendSpacing)
    //   .text(function(d){ 
    //     console.log(self.region);
    //     return self.region;
    //   })
      // Här är jag!!!!!!!!!!!!

    // Adding a color legend for the parties
    var legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing;
        var offset =  height * color.domain().length / 2;
        var horz = -19 * legendRectSize;
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
    showInformation(self.region);
  };

  this.selectPie = function(value)
  {
    showInformation(value);
  };
}
