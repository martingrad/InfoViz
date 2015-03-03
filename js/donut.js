function donut(){

  var self = this; // for internal d3 functions

  var donutDiv = $("#donut");
  var width = 510,
      height = 250,
      radius = Math.min(width, height) / 2;

  //var partier = ["Moderaterna", "Centerpartiet", "Folkpartiet", "Kristdemokraterna", "Miljöpartiet", "Socialdemokraterna", "Vänsterpartiet", "Sverigedemokraterna", "övriga partier"];
  var color = d3.scale.ordinal()
      .range(["#1B49DD", "#009933", "#6BB7EC", "#231977", "#83CF39", "#EE2020", "#AF0000", "#DDDD00", "gray"]);

  // var arc = d3.svg.arc()
  //     .outerRadius(radius - 10)
  //     .innerRadius(radius - 70);

  // var pie = d3.layout.pie()
  //     .sort(null)
  //     .value(function(d,i) { return d[self.headers[i]]; });

  // var svg = d3.select("#donut").append("svg:svg")
  //     .attr("width", width)
  //     .attr("height", height)
  //   .append("g")
  //     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var pie = d3.layout.pie()
      .sort(null);

  var arc = d3.svg.arc()
      .innerRadius(radius - 100)
      .outerRadius(radius - 50);

  var svg = d3.select("#donut").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



  // d3.csv("data/Elections/Swedish_Election_2002.csv", function(error, data) {

  //   self.data = data;

    // data.forEach(function(d){
    //   console.log(d.parti);
    // });
    // data.forEach(function(d) {
    //   d.inkomst = +d.inkomst;
    // });

    // var g = svg.selectAll(".arc")
    //     .data(pie(data))
    //   .enter().append("g")
    //     .attr("class", "arc");

    // g.append("path")
    //     .attr("d", arc)
    //     .style("fill", function(d) { return color(d.data["år"]); });

    // g.append("text")
    //     .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
    //     .attr("dy", ".35em")
    //     .style("text-anchor", "middle")
    //     .text(function(d) { return d.data["år"]; });

  // });

  this.selectYear = function(value){
    console.log("Hej jag heter Emma");
    var inputValue = value;
    console.log(value);
    // d3.text("data/databaosen.csv", function(text) {
    //     self.headers = d3.csv.parseRows(text)[0];
    // });



    //d3.csv("data/Elections/Swedish_Election_" + value + ".csv",function(error,data){
    d3.csv("data/databaosen.csv", function(error,data){
      console.log(inputValue);
      self.data = [];
      
      
      self.headers = d3.keys(data[0]).filter(function(d) {
        return d != "region" && d!= "befolkning" && d!="arbetslösa" && d!="år" && d!="arbetslöshet" && d!="inkomst";
      });

      for(var i = 0; i < data.length; i++){
        if(data[i]["år"] == inputValue){
          self.data.push(data[i]);
        }
      }
      // console.log(data[i]["år"]);
      // while(data[i]["år"] == inputValue){
      //     self.data.push(data[i]);
      //     ++i;
      // }
      console.log(self.data);
      donut.showInformation("Stockholm");

    });

    this.showInformation = function(region){
      var tempData = [];
      var parties = [];
      console.log(self.headers);
      
      for(var i = 0; i < self.data.length; i++){
        if(self.data[i]["region"] == region){
          tempData.push(self.data[i]);
          for(var j = 0; j<self.headers.length; j++)
          {
            parties.push(self.data[i][self.headers[j]]);
          }
        }
      }
      console.log(tempData);
      console.log(parties);


//
    

    var path = svg.selectAll("path")
      .data(pie(parties))
      .enter().append("path")
      .attr("fill", function(d, i) { 
        return color(i); 
      })
      .attr("d", arc);

    path.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d,i) { return self.headers[i]; });
//

      // data.forEach(function(d) {
      //   d.inkomst = +d.inkomst;
      // });

    // var g = svg.selectAll(".arc")
    //     .data(pie(parties))
    //     .enter().append("g")
    //     .attr("class", "arc");

    // Får fram svart cirkel
    // var color = d3.scale.ordinal()
    //   .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#d0743c", "#ff8c00"]);

    //  var g = svg.selectAll(".arc")
    //    .data(pie(tempData))
    //    .enter().append("g")
    //      .attr("class", "arc");

    //  g.append("path")
    //      .attr("d", arc)
    //      .style("fill", function(d,i) { return console.log(d.data[self.headers[i]]); color(d.data[self.headers[i]]); });        // ska stå .data för att det ska fungera

    //  g.append("text")
    //      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
    //      .attr("dy", ".35em")
    //      .style("text-anchor", "middle")
    //      .text(function(d) { return d.data[self.headers[i]]; });

    };
    
  };
}