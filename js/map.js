function map(){

    var counties;

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

    // alternative color scale
    var colorScale2 = d3.scale.category20();
    
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
        counties = topojson.feature(sweden, sweden.objects.swe_mun).features;

        // TODO här borde man först ha lagt till vilket kluster varje region hör till i en ny datavariabel och skicka med den istället,
        // för att undvika att köra dubbelloopar på mouseover... xD
        addClusterProperty();
        draw(counties, dataz);
    });

    var colorScale;
    var incomeMap = {};
    var selectedObject;

    function draw(countries, data)
    {
        svg.selectAll('path').remove();

        //console.log("drawing map!");
        var colorMappingVariable = "inkomst";
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
                    if(d.properties.cluster != -1)
                    {
                        return colorScale2(d.properties.cluster);
                    }
                    else
                    {
                        return "ff0000";
                    }
                })
            //tooltip
            .on("mousemove", function(d, i) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);

                tooltip.html(d.properties.name + ", kluster: " + d.properties.cluster)
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
                //console.log("click!");
                if(d != selectedObject){            // if the clicked object is not the same as the one clicked previously -> select it
                    selectedObject = d;
                    selFeature(d);
                }
                else{                               // if it is -> deselect it
                    selectedObject = null;
                    clearSelection();
                }
            });
        //console.log("har jag ritat om än?");
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
        //console.log("selectCountry()");
        d3.select("#map").selectAll("path").style("opacity", function(d){if(d.properties.name != value) return 0.7;});
        d3.select("#map").selectAll("path").style("stroke-width", function(d){if(d.properties.name == value) return "5px";});
        zoomToRegion(value);
    };

    this.deselectCountry = function() {
        d3.select("#map").selectAll("path").style("opacity", function(d){ return 1.0;});
        d3.select("#map").selectAll("path").style("fill", function(d, i) {
                if(d.properties.cluster != -1)
                {
                    return colorScale2(d.properties.cluster);
                }
                else
                {
                    return "ff0000";
                }
            })
        d3.select("#map").selectAll("path").style("stroke-width", function(d){return ".1px";});     // TODO: .1px är inte riktigt samma som från början
    }

    //method for selecting features of other components
    function selFeature(value){
        map.selectCountry(value.properties.name);
        sp1.selectDot(value.properties.name);
        pc1.selectLine(value.properties.name);
        donut.selectPie(value.properties.name);
    }

    function clearSelection() {
        d3.select("#map").selectAll("path").style("opacity", function(d){ return 1.0;});
        d3.select("#map").selectAll("path").style("fill", function(d, i) {
                    var clusterIndex;
                    for(var j = 0; j < dbscanRes.length; ++j)
                    {
                        clusterIndex = dbscanRes[j].indexOf(dataz[i]);
                        if(clusterIndex != -1)
                        {
                            return colorScale2(j);
                        }
                    }
                    return "ff0000";
                });
        pc1.deselectLine();
        donut.deselectPie();
    }

    active = d3.select(null);

    function zoomToRegion(d) {
        var region;
        for(var i = 0; i < counties.length; ++i){
            if(counties[i].properties.name == d){
                region = counties[i];
                break;
            }
        }

        var bounds = path.bounds(region),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = .1 / Math.max(dx / width, dy / height),
            translate = [width / 2 - scale * x, height / 2 - scale * y];

        g.transition()
            .duration(750)
            .style("stroke-width", 1.5 / scale + "px")
            .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
    }

    this.selectYear = function()
    {
        var newData;
        switch(chosenYear)
        {
            case "2002":
                newData = dataz2002;
                break;
            case "2006":
                newData = dataz2006;
                break;
            case "2010":
                newData = dataz2010;
                break;
            default:
                break;
        }

        addClusterProperty();

        draw(counties, newData);
        if(selectedObject){
            map.selectCountry(selectedObject.properties.name);
        }
    }

    function addClusterProperty()
    {
        //console.log("addClusterProperty");
        for(var i = 0; i < counties.length; ++i)
        {
            counties[i].properties["cluster"] = findClusterByRegion(counties[i].properties.name);
        }
    }
}
