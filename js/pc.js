function pc(){

    //
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
        y = {}
        dragging = {};                  //ny
        

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left").tickFormat(d3.format("d")),
        background,
        foreground;

    var svg = d3.select("#pc").append("svg:svg")
        .attr("width", width + margin[1] + margin[3])
        .attr("height", height + margin[0] + margin[2])
        .append("svg:g")
        .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

    var valdata;
    d3.csv("data/Elections/valen.csv", function(error,data1){

        self.data = data1;
        x.domain(dimensions = d3.keys(data1[0]).filter(function(d) {
            return d != "region" && (y[d] = d3.scale.linear()
                .domain(d3.extent(data1, function(p) {
                    return +p[d];     
                }))
                .range([height, 0])
                );
        }));
        draw();

    })
    // Ny parallell koordinat
    // d3.csv("data/databaosen.csv", function(error, data) {
    //     self.data = data;

    //     // Extract the list of dimensions and create a scale for each.
    //     x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
    //         return d != "region" && d!= "befolkning" && d!="arbetslösa" && (y[d] = d3.scale.linear()
    //             .domain(d3.extent(data, function(p) {
    //                 return +p[d];     
    //             }))
    //             .range([height, 0])
    //             );
    //     }));

    //     draw();
    // });

    function draw(){
        // Add grey background lines for context.
        background = svg.append("svg:g")
            .attr("class", "background")
            .selectAll("path")
            // add the data and append the path
            .data(self.data)
            .enter().append("path")
            .attr("d", path)
            .on("mousemove", function(d){})
            .on("mouseout", function(){})
            .on("click", function(d){
                //selFeature(d);
            });

        // Add blue foreground lines for focus.
        foreground = svg.append("svg:g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(self.data)
            .enter().append("path")
            .attr("d", path)
            .style("stroke", function(d,i){
                return "#aa0000";                       //color for the lines in the parallell coordinates
            })
            .on("mousemove", function(d,i){
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
    
                tooltip.html(d["region"])                           //plotta i tooltip namnet på regionerna (OBS, postnummer är med)
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px"); 
            })
            .on("mouseout", function(d){
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("click", function(d){
                //selFeature(d);
            })


        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("svg:g")
            .attr("class", "dimension")
            .attr("transform", function(d) {
                //console.log(x(d));
                return "translate(" + x(d) + ")"; 
            })
            .call(d3.behavior.drag()
                .origin(function(d) { 
                    return {x: x(d)}; 
                })
                .on("dragstart", function(d) {
                    dragging[d] = x(d);
                    background.attr("visibility", "hidden");
                })
                .on("drag", function(d) {
                    dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                    foreground.attr("d", path);
                    dimensions.sort(function(a, b) { 
                        return position(a) - position(b); 
                    });
                    x.domain(dimensions);
                    g.attr("transform", function(d) { 
                        return "translate(" + position(d) + ")"; 
                    }) 
                })
                .on("dragend", function(d) {
                    delete dragging[d];
                    transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                    transition(foreground).attr("d", path);
                    background
                        .attr("d", path)
                        .transition()
                        .delay(500)
                        .duration(0)
                        .attr("visibility", null);
                })
            );


        // Add an axis and title.
        g.append("svg:g")
            .attr("class", "axis")
            .each(function(d) { 
                d3.select(this).call(axis.scale(y[d]));     // utritning av axeln
            })
            .append("svg:text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function(d) { 
                if(d == "inkomst")
                    return "Inkomst (tkr/år)";
                if(d == "år")
                    return "År";
                if(d == "arbetslöshet")
                    return "Arbetslöshet (%)";
                console.log(d);
                return d; 
            })
            .style("cursor", "pointer")                 // hand, funkar för mac, Martin kolla ifall funkar på windows.
            //.style("cursor" ,"-webkit-grabbing")           // funkar för mac, Martin se ifall du får en knuten hand av denna!!! (btw ska ej ligga här i slutändan)
            //.style("cursor", "url(https://mail.google.com/mail/images/2/closedhand.cur) 8 8, move;");       // knuten hand, denna verkar funka för mac också, kolla ifall den funkar på windows.

        // Add and store a brush for each axis.
        g.append("svg:g")
            .attr("class", "brush")
            .each(function(d) {
                d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);

    };

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { 
            return [position(p), y[p](d[p])]; 
        }));
    }

    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        var actives = dimensions.filter(function(p) {                       // de axlar som används
                return !y[p].brush.empty(); 
            }),
            extents = actives.map(function(p) {                             // de intervall som är markerade
                return y[p].brush.extent(); 
            });
        foreground.style("display", function(d) {                           // d = alla region-objekt
            return actives.every(function(p, i) {                           // p - namn på aktiv axel, i = index för aktiv axel
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];      // extents[i][0] = nedre gräns, extents[i][1] = övre gräns, d[p] = all data på aktuell axel
            }) ? null : "none";
        });
    }


    //method for selecting the pololyne from other components    
    this.selectLine = function(value){          //skickar med value som är landet
        //     d3.select("#pc").selectAll("path").style("opacity", function(d){if(d["Country"] != value) return 0.1;});
        //     d3.select("#pc").selectAll("path").style("stroke", function(d){ if(d["Country"] == value) return "#ff1111"; else return countryColorScale(d["Country"]);});//function(d){ if(d["Country"] == value) return "#ff1111";});
    };

    this.deselectLine = function(){
        //     d3.select("#pc").selectAll("path").style("opacity", function(d){ return 0.9;});
        //     d3.select("#pc").selectAll("path").style("stroke", function(d){ return countryColorScale(d["Country"]);});
    }
    
    //method for selecting features of other components
    function selFeature(value){
        //     pc1.selectLine(value.Country);
        //     sp1.selectDot(value.Country);
        //     map.selectCountry(value.Country);
    };

}
