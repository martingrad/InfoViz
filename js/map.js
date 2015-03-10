function map(){

    var counties;

    var zoom = d3.behavior.zoom()
        .scaleExtent([0.8, 40])
        .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width  = mapDiv.width(),
        height = mapDiv.height();
    
    // initialize tooltip
    // add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var projection = d3.geo.satellite()             //obs kontrollera att du är ansluten till internet, då geo.satellite är kopplad till en webbadress
        .distance(1.1)
        .scale(2800)
        .rotate([165.00, -125.0, 180.0])
        .center([110, 40])
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
        addClusterProperty();
        draw(counties, dataz);
    });

    var colorScale;
    var majorityMap = {};
    var selectedObject;

    /* ======== Private functions ======== */
    /* =================================== */

    function draw(countries, data)
    {
        console.log("drawing!");
        addMajorityProperty(dataz);

        svg.selectAll('path').remove();

        var colorMappingVariable = "inkomst";
        var colorMappingValues = [];

        var country = g.selectAll(".country").data(countries);
        var id = g.selectAll(".country").data(countries);
    
        country.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("title", function(d) { return d.properties.name; })
            .style("fill", function(d)
                {
                    if(colorMode == "clusters")
                    {
                        if(d.properties.cluster != -1)
                        {
                            return globalColorScale(d.properties.cluster);
                        }
                        else
                        {
                            return "ff0000";
                        }
                    }
                    else if(colorMode == "majority")
                    {
                        return colorByMajority(d.properties.majority);
                    }
                })
            //tooltip
            .on("mousemove", function(d)
                {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);

                    tooltip.html(d.properties.name + ", kluster: " + d.properties.cluster)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
            .on("mouseout", function(d)
                {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
            //selection
            .on("click", function(d)
                {
                    $("#selectRegion").val(d.properties.name);
                    //console.log("click!");
                    if(d != selectedObject){            // if the clicked object is not the same as the one clicked previously -> select it
                        selectedObject = d;
                        selFeature(d);
                    }
                    else{                               // if it is -> deselect it
                        $("#selectRegion").val("Sverige");
                        selectedObject = null;
                        clearSelection();
                    }
                }
        );
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

        var bounds, dx, dy, x, y, scale;
        var translate;

        // if a region was selected -> zoom in
        if(region)
        {
            bounds = path.bounds(region);
            dx = bounds[1][0] - bounds[0][0];
            dy = bounds[1][1] - bounds[0][1];
            x = (bounds[0][0] + bounds[1][0]) / 2;
            y = (bounds[0][1] + bounds[1][1]) / 2;
            scale = .1 / Math.max(dx / width, dy / height);
            translate = [width / 2 - scale * x, height / 2 - scale * y];
        }
        // if a region was not selected -> zoom back out
        else
        {
            scale = 1;
            translate = [0, 0];
        }

        g.transition()
            .duration(750)
            //.style("stroke-width", 1.0 / scale + "px")
            .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
    }

    //zoom and panning method
    function move() {
        var t = d3.event.translate;
        var s = d3.event.scale;    

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

    //method for selecting features of other components
    function selFeature(value){
        map.selectCountry(value.properties.name);
        sp1.selectDot(value.properties.name);
        pc1.selectLine(value.properties.cluster);
        donut.selectPie(value.properties.name);
    }

    function clearSelection() {
        map.deselectCountry();
        pc1.deselectLine();
        donut.deselectPie();
        sp1.deselectDot();
    }

    /* ======== Public functions ======== */
    /* ================================== */
    
    // function to select region from other components
    this.selectCountry = function(region){
        d3.select("#map").selectAll("path").style("opacity", function(d){if(d.properties.name != region) return 0.7;});
        d3.select("#map").selectAll("path").style("stroke-width", function(d)
        {
            if(d.properties.name == region){
                selectedObject = d;
                return ".05em";
            }
        });
        d3.select("#map").selectAll("path").style("stroke", function(d){if(d.properties.name == region) return "black";});
        zoomToRegion(region);
        pc1.selectLine(selectedObject.properties["cluster"]);
    };

    this.deselectCountry = function() {
        d3.select("#map").selectAll("path").style("opacity", function(d){ return 1.0;});
        d3.select("#map").selectAll("path").style("fill", function(d, i) {
            if(colorMode == "clusters")
            {
                if(d.properties.cluster != -1)
                {
                    return globalColorScale(d.properties.cluster);
                }
                else
                {
                    return "ff0000";
                }
            }
            else if(colorMode == "majority")
            {
                return colorByMajority(d.properties.majority);
            }
        });
        d3.select("#map").selectAll("path").style("stroke-width", ".01em");     // TODO: .1px är inte riktigt samma som från början
        d3.select("#map").selectAll("path").style("stroke", "white");
        zoomToRegion("asd");
    }    

    this.selectYear = function(value)
    {
        console.log(value);
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
    
    this.selectCluster = function(clusterIndex)
    {
        d3.select("#map").selectAll("path").style("opacity", function(d){if(d.properties.cluster != clusterIndex) return 0.7;});
        d3.select("#map").selectAll("path").style("stroke", function(d){if(d.properties.cluster == clusterIndex) return "black";});
        d3.select("#map").selectAll("path").style("stroke-width", function(d){if(d.properties.cluster == clusterIndex) return "0.1em";});
    }

    function addClusterProperty()
    {
        //console.log("addClusterProperty");
        for(var i = 0; i < counties.length; ++i)
        {
            counties[i].properties["cluster"] = findClusterByRegion(counties[i].properties.name);
        }
    }

    function addMajorityProperty()
    {
        console.log("addMajorityProperty");
        for(var i = 0; i < counties.length; ++i)
        {
            counties[i].properties["majority"] = findMajorityByRegion(counties[i].properties.name);
        }
    }

    function colorByMajority(region)
    {
        switch(region)
        {
            case "Moderaterna":
                return "#1B49DD";
            case "Centerpartiet":
                return "#009933";
            case "Folkpartiet":
                return "#6BB7EC";
            case "Kristdemokraterna":
                return "#231977";
            case "Miljöpartiet":
                return "#83CF39";
            case "Socialdemokraterna":
                return "#EE2020";
            case "Vänsterpartiet":
                return "#AF0000";
            case "Sverigedemokraterna":
                return "#DDDD00"
            case "övriga partier":
                return "gray"
            default:
                return "black";
        }
    }
}
