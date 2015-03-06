function map(){

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = mapDiv.width() - margin.right - margin.left,
        height = mapDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    var fill = d3.scale.log()
        .domain([10, 500])
        .range(["brown", "steelblue"]);

    var countryColorScale = d3.scale.category20();
    
    //initialize tooltip
    // add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var projection = d3.geo.mercator()
        .center([50, 60 ])
        .scale(250);

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    var path = d3.geo.path()
        .projection(projection);

    g = svg.append("g");

    // load data and draw the map
    d3.json("data/world-topo.json", function(error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;

        //console.log(countries.path);
        //load summary data
        //...
        draw(countries, sp1.getData());
        
    });

    function draw(countries, data)
    {
        var country = g.selectAll(".country").data(countries);
        var id = g.selectAll(".country").data(countries);
        
        //initialize a color country object
        //console.log(id);

        var color = "#800026";
        var cc = {Country: country, Color: color};
        //console.log(cc.Color);
    

        country.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("title", function(d) { return d.properties.name; })
            //country color
            .style("fill", function(d) 
                {
                    return countryColorScale(d.properties.name);
                })
                        
            //...
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
            .on("click",  function(d) {
                selFeature(d);
            });
    }

    
    
    //zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;
        

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

    }
    
    // detta är vår funktion, fanns ej med i orginal koden
    this.selectCountry = function(value){
        d3.select("#map").selectAll("path").style("opacity", function(d){if(d.properties.name != value) return 0.3;});
        d3.select("#map").selectAll("path").style("fill", function(d){ if(d.properties.name == value) return "#ff1111"; else return countryColorScale(d.properties.name);});//
    };

    this.deselectCountry = function(){
        d3.select("#map").selectAll("path").style("opacity", function(d){ return 0.9;});
        d3.select("#map").selectAll("path").style("fill", function(d){ return countryColorScale(d.properties.name);});//
    }

    //method for selecting features of other components
    function selFeature(value){
        map.selectCountry(value.properties.name);
        sp1.selectDot(value.properties.name);
        pc1.selectLine(value.properties.name);
    }
}

