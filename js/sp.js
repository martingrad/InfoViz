function sp(){

    var self = this; // for internal d3 functions

    var spDiv = $("#sp");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    var countryColorScale = d3.scale.category20();
    
    //initialize tooltip
    //...
    // These variables are used to chose and store data for the plot
    // in which the headers, is the name of the different columns from the data set
    var entry1 = [];
    var entry2 = [];
    var chosenVariableOnXAxis;
    var chosenVariableOnYAxis;
    var headers = [];

    // Extract the name of the columns
    d3.text("data/databaosen.csv", function(text) {
        headers = d3.csv.parseRows(text)[0];
    });

    var xScale;
    var yScale;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(5);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#sp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // add the tooltip area to the webpage
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
    
    /*d3.csv("data/databaosen.csv", function(error, data){
        console.log(data);
    });*/
    
    //Load data
    d3.csv("data/databaosen.csv", function(error, data) {
        var chosenYear = "2002";
        var i = 0;
        self.data = [];
        while(data[i]["år"] == chosenYear){
            self.data.push(data[i]);
            ++i;
        }
          
        // Here the different data are chosen for the plot  
        chosenVariableOnXAxis = headers[2];
        chosenVariableOnYAxis = headers[3];

        for(var i = 0; i < self.data.length; ++i){
            entry1.push(self.data[i][chosenVariableOnXAxis]);       // data for the x axis
            entry2.push(self.data[i][chosenVariableOnYAxis]);       // data for the y axis
        }

        var padding = 0;
        xScale = d3.scale.linear()                                      // scale entry1
                      .domain([d3.min(entry1), d3.max(entry1)])
                      .range([padding, width - padding]);

        yScale = d3.scale.linear()                                      // scale entry2
                      .domain([d3.min(entry2), d3.max(entry2)])
                      .range([height  - padding, padding]);

        xAxis= d3.svg.axis().scale(xScale).orient("bottom");
        yAxis= d3.svg.axis().scale(yScale).orient("left");

        draw();

    });

    function draw()
    {
        var padding = 10;
        // Add x axis and title.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .text(chosenVariableOnXAxis)            // plot the name of the chosen dataset
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", 30);
            
        // Add y axis and title.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .text(chosenVariableOnYAxis)            // plot the name of the chosen dataset
            .attr("class", "label")        
            .attr("y", height/2)
            .attr("x", 0)
            .attr("text-anchor", "middle")
            //.attr("transform", "rotate(-90)")
            .attr("dy", ".71em");  
            
        // Add the scatter dots.
        svg.selectAll(".dot")
            .data(self.data)
            .enter().append("circle")               // create circles
            .attr("class", "dot")
            // Define the x and y coordinate data values for the dots
            .attr("cx", function(d, i) {
                return xScale(entry1[i]);           // plot scaled position for x-axis
            })
            .attr("cy", function(d, i) {
                return yScale(entry2[i]);           // plot scaled position for y-axis
            })
            .attr("r", 5)
            .style("fill", function(d, i){ return countryColorScale(d["region"]);})
            // tooltip
            .on("mousemove", function(d, i) {
                tooltip.transition()
               .duration(200)
               .style("opacity", .9);
                    tooltip.html(d["region"] + "<br/> (" + entry1[i]
                    + ", " + entry2[i] + ")")
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

    }

    //method for selecting the dot from other components
    this.selectDot = function(value){           // value = land
        d3.select("#sp").selectAll(".dot").style("opacity", function(d){if(d["region"] != value) return 0.1;});
        d3.select("#sp").selectAll(".dot").style("fill", function(d){ if(d["region"] == value) return "#ff1111"; else return countryColorScale(d["region"]);});
    };

    this.deselectDot = function(){
        d3.select("#sp").selectAll(".dot").style("opacity", function(d){ return 0.9;});
        d3.select("#sp").selectAll(".dot").style("fill", function(d){ return countryColorScale(d["region"]);});
    }

    this.getData = function(){
        return self.data;
    };
    
    //method for selecting features of other components
    function selFeature(value){
        sp1.selectDot(value.Country);
        pc1.selectLine(value.Country);
        map.selectCountry(value.Country);
    }

}




