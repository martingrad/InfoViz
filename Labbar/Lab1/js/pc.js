function pc(){

    var self = this; // for internal d3 functions

    var pcDiv = $("#pc");

    var margin = [30, 10, 10, 10],
        width = pcDiv.width() - margin[1] - margin[3],
        height = pcDiv.height() - margin[0] - margin[2];

    
    //initialize color scale
    var countryColorScale = d3.scale.category20();
    
    //initialize tooltip
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var x = d3.scale.ordinal().rangePoints([0, width], 1),      //range between 0 and width, with padding 1
        y = {};
        

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    var svg = d3.select("#pc").append("svg:svg")
        .attr("width", width + margin[1] + margin[3])
        .attr("height", height + margin[0] + margin[2])
        .append("svg:g")
        .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");


    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(data) {

        self.data = data;
        
        // Extract the list of dimensions and create a scale for each.
        // För att läsa endast en liten pluttig rad. Kan detta göras på något annat sätt annars bojkottar vi javascript i framtiden.
        // var headers = [];
        // var BreakException= {};
        // try {
        //     data.forEach(function(row) {
        //         headers = Object.keys(row);
        //         if(true) throw BreakException;
        //     });
        // }
        // catch(e) {
        //     if (e!==BreakException) throw e;
        // }
        // //console.log(headers);

        // console.log(self.data[0][headers[0]]);

        // varje stapel är en variabel
        // varje linje är ett land
        
        // console.log(data[0]);

        x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
            //console.log(d3.keys[4]);
            return d != "Country" && (y[d] = d3.scale.linear()
                .domain(d3.extent(data, function(p) { return +p[d]; }))
                .range([height, 0]));
        }));

        // // Extract the list of dimensions and create a scale for each.
        // x.domain(dimensions = d3.keys(cars[0]).filter(function(d) {
        //     return d != "name" && (y[d] = d3.scale.linear()
        //     .domain(d3.extent(cars, function(p) { return +p[d]; }))
        //     .range([height, 0]));
        // }));


        draw();
    });

    function draw(){
        // Add grey background lines for context.
        background = svg.append("svg:g")
            .attr("class", "background")
            .selectAll("path")
            //add the data and append the path 
            .data(self.data)
            .enter().append("path")
            .attr("d",path)
            .on("mousemove", function(d){})
            .on("mouseout", function(){})
            .on("click",  function(d) {
                selFeature(d);
            })

          //   // Add grey background lines for context.
          // background = svg.append("g")
          //     .attr("class", "background")
          //   .selectAll("path")
          //     .data(cars)
          //   .enter().append("path")
          //     .attr("d", path);

        // Add blue foreground lines for focus.
        foreground = svg.append("svg:g")
            .attr("class", "foreground")
            .selectAll("path")
            //add the data and append the path
            .data(self.data)
            .enter().append("path")
            .attr("d",path)                     //attribute d - path data
            .style("stroke", function(d, i){ return countryColorScale(d["Country"]);})
            .on("mousemove", function(d, i) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
    
                tooltip.html(d["Country"])
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");  
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("click",  function(d) {
                selFeature(d);
            });

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("svg:g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; });
            
        // Add an axis and title.
        g.append("svg:g")
            .attr("class", "axis")
            //add scale
            .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
            .append("svg:text")
            .attr("text-anchor", "middle")
            .attr("y", -9)
            //.text(String);
            .text(function(d) { return d; });

        // Add and store a brush for each axis.
        g.append("svg:g")
            .attr("class", "brush")
            .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        var actives = dimensions.filter(function(p) {return !y[p].brush.empty(); }),    // de axlar som används
            extents = actives.map(function(p) { return y[p].brush.extent(); });         // de intervall som är markerade
        foreground.style("display", function(d) {
                                                                       // d = alla land-objekt
            return actives.every(function(p, i) {                                       // p = namn på aktiv axel,  i = index för aktiv axel
                
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];                  // extents[i][0] = nedre gräns, extents[i][1] = övre gräns
            }) ? null : "none";                                                         // d[p] = all data på aktuell axel
        });
    }

    //method for selecting the pololyne from other components	
    this.selectLine = function(value){          //skickar med value som är landet
        d3.select("#pc").selectAll("path").style("opacity", function(d){if(d["Country"] != value) return 0.1;});
        d3.select("#pc").selectAll("path").style("stroke", function(d){ if(d["Country"] == value) return "#ff1111"; else return countryColorScale(d["Country"]);});//function(d){ if(d["Country"] == value) return "#ff1111";});
    };

    this.deselectLine = function(){
        d3.select("#pc").selectAll("path").style("opacity", function(d){ return 0.9;});
        d3.select("#pc").selectAll("path").style("stroke", function(d){ return countryColorScale(d["Country"]);});
    }
    
    //method for selecting features of other components
    function selFeature(value){
        pc1.selectLine(value.Country);
        sp1.selectDot(value.Country);
        map.selectCountry(value.Country);
    };

}