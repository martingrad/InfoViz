function map(){

    var zoom = d3.behavior.zoom()
        .scaleExtent([0.3, 10])
        .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width  = mapDiv.width(),
        height = mapDiv.height();

    // initialize color scale
    var fill = d3.scale.log()
        .domain([10, 500])
        .range(["brown", "steelblue"]);

    var countryColorScale = d3.scale.category20();
    
    // initialize tooltip
    // add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var projection = d3.geo.satellite()             //obs kontrollera att du är ansluten till internet, då geo.satellite är kopplad till en webadress
        .distance(1.1)
        .scale(8000)
        .rotate([165.00, -125.0, 180.0])
        .center([150, 20])
        .tilt(15)
        //.clipAngle(Math.acos(1 / 1.1) * 180 / Math.PI - 1e-6)             // dafuq is dis? 
        .precision(.1);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("#map").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);

    g = svg.append("g");

    //load data and draw the map
    d3.json("data/map/swe-topo.json",function(error, sweden) {
        var counties = topojson.feature(sweden, sweden.objects.swe_mun).features;
        draw(counties, sp1.getData());       
    });

    var colorScale;
    var incomeMap = {};
    var selectedObject;

    function draw(countries, data)
    {
        var colorMappingVariable = "inkomst";
        var chosenYear = "2002";
        var colorMappingValues = [];
        
        for(var i = 0; i < data.length; ++i){
            colorMappingValues.push(data[i][colorMappingVariable]);
            incomeMap[data[i]["region"]] = data[i][colorMappingVariable];
        }

        var country = g.selectAll(".country").data(countries);
        var id = g.selectAll(".country").data(countries);
        
        //initialize color scale
        colorScale = d3.scale.linear()
          .domain([d3.min(colorMappingValues), d3.max(colorMappingValues)])
          .range(["steelblue", "deeppink"]);
    
        country.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("title", function(d) { return d.properties.name; })
            //country color
            .style("fill", function(d, i) {
                    return colorScale(incomeMap[d.properties.name]);
                })
            //tooltip
            .on("mousemove", function(d, i) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
    
                tooltip.html(d.properties.name)
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            //selection
            .on("click", function(d) {
                if(d != selectedObject){            // if the clicked object is not the same as the one clicked previously -> select it
                    selectedObject = d;
                    selFeature(d);
                }
                else{                               // if it is -> deselect it
                    selectedObject = null;
                    clearSelection();
                }
            });
    }
    
    //zoom and panning method
    function move() {
        var t = d3.event.translate;
        var s = d3.event.scale;    

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }
    
    // function to select region from other components
    this.selectCountry = function(value){
        d3.select("#map").selectAll("path").style("opacity", function(d){if(d.properties.name != value) return 0.7;});
        /*
        // Opacity gradient to help make map appear tilted into the screen
        d3.select("#map").selectAll("path").style("fill", function(d){
            var coordinateY = d.geometry.coordinates[0][0][1]           // arbitrarily chosen coordinate point with which to determine alpha value
            if(d.geometry.type == "MultiPolygon")                       // if the type is 'multipolygon', a point needs to be extracted in an additional step
                coordinateY = coordinateY[1];
            // fulhack var det här! manuell normalisering... icke bra!
            var alpha = 1 - (coordinateY - 55) / 20;

            if(d.properties.name == value){
                //return "rgba(" + [225, 20, 125, alpha] + ")";
                return "rgb(" + [225, 20, 125] + ")";
            }
            else{   //TODO apply alpha on colormapped value...
                return colorScale(incomeMap[d.properties.name]);
            }
             
        });*/
    };

    this.deselectCountry = function() {
        console.log("deselectCountry");
        d3.select("#map").selectAll("path").style("opacity", function(d){ return 1.0;});
        d3.select("#map").selectAll("path").style("fill", function(d){ return colorScale(incomeMap[d.properties.name]);});
    }

    //method for selecting features of other components
    function selFeature(value){
        console.log("Should be spinning now!");
        console.log("Time for an exquisite selection!");
        map.selectCountry(value.properties.name);
        sp1.selectDot(value.properties.name);
        pc1.selectLine(value.properties.name);
        donut.selectPie(value.properties.name);
    }

    function clearSelection() {
        d3.select("#map").selectAll("path").style("opacity", function(d){ return 1.0;});
        d3.select("#map").selectAll("path").style("fill", function(d){ return colorScale(incomeMap[d.properties.name]);});
        pc1.deselectLine();
    }
}
