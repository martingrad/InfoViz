function sp(){

    var self = this; // for internal d3 functions
    var spDiv = $("#sp");
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    var padding = 10;

    //initialize color scale
    var countryColorScale = d3.scale.category20();

    //initialize tooltip
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    self.boolXAxis = false;
    self.boolYAxis = false;    

    // Scale, axis osv.
    // Något är galet

    var x = d3.scale.linear()
        .domain([0,100])
        //.range([0, width]);
        .range([padding, width - padding]);

    var y = d3.scale.linear()
        .domain([0,100])
        //.range([height, 0]);
        .range([height  - padding, padding]);

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

    //  //kanske behöver den
    self.partier = d3.keys(dataz[0]).filter(function(d){
         return d != "region" && d!= "befolkning" && d!="arbetslösa";
    });

    // // Here the different data are chosen for the plot  
    self.selectedObjectOnXAxis = self.partier[2];
    self.selectedObjectOnYAxis = self.partier[5];
        // draw();

    //});

    function draw()
    {
        svg.selectAll(".axis").remove();
        svg.selectAll('.dot').remove();
        

        console.log(self.selectedObjectOnXAxis);
        console.log(self.selectedObjectOnYAxis);
        var xScale;
        var yScale;
        var entry1 = [];
        var entry2 = [];

        

        var chosenYear = "2002";
        var i = 0;
        
        // // Ta ut data för ett år
        self.data = [];
        while(dataz[i]["år"] == chosenYear){
             self.data.push(dataz[i]);
             ++i;
        }
        console.log(self.data);

            
        

        // // console.log(self.data[0][chosenVariableOnYAxis]);
        for(var i = 0; i < self.data.length; ++i){
             entry1.push(self.data[i][self.selectedObjectOnXAxis]);       // data for the x axis
             entry2.push(self.data[i][self.selectedObjectOnYAxis]);       // data for the y axis
         }

        //Mysko att denna inte fungerar
        // xScale = d3.scale.linear()                                      // scale entry1
        //     .domain([0, 100])
        //      //.domain([d3.min(entry1), d3.max(entry1)])
        //     .range([padding, width - padding]);
        //x.domain(d3.extent(entry1, function(d) { return d; })).range();
        //y.domain(d3.extent(entry2, function(d) { return d; })).range();

        // // // //TODO (Fulhack var det här!) fixa automatisk domain! min, max fungerar inte riktigt...
        // yScale = d3.scale.linear()                                      // scale entry2
        // //     .domain([d3.min(entry2), d3.max(entry2)])
        //      .domain([0, 100])
        //      .range([height  - padding, padding]);


    // Här började draw förut!!
        
        // Add x axis and title.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .text(self.selectedObjectOnXAxis)            // plot the name of the chosen dataset
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", 30);

        // Add y axis and title.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .text(self.selectedObjectOnYAxis)            // plot the name of the chosen dataset
            .attr("class", "label")        
            .attr("y", height/2)
            .attr("x", 0)
            .attr("text-anchor", "middle")
            .attr("dy", ".71em");
            
        // Add the scatter dots.
        svg.selectAll(".dot")
            .data(self.data)
            .enter().append("circle")               // create circles
            .attr("class", "dot")
            // Define the x and y coordinate data values for the dots
            .attr("cx", function(d, i) {
                return  x(entry1[i]);           // plot scaled position for x-axis
            })
            .attr("cy", function(d, i) {
                return y(entry2[i]);           // plot scaled position for y-axis
            })
            .attr("r", 5)
            .style("fill", function(d){ return countryColorScale(d["region"]);})
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
                // tooltip.transition()
                // .duration(500)
                // .style("opacity", 0);
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
        // sp1.selectDot(value.Country);
        // pc1.selectLine(value.Country);
        // map.selectCountry(value.Country);
        //console.log(valResultat);
        //console.log(headers);
    }

    function clearScatterPlot(){
        
        svg.selectAll(".axis").remove();
        svg.selectAll('.dot').remove();
    }

    //method to select what should be displayed on the Y-axis
    this.selectYAxis = function()
    {
        var selY = $("#setYAxis option:selected").val();
        self.boolYAxis = true;
        if(selY == "Välj variabel"){
            self.boolYAxis = false;
            clearScatterPlot();
        }
        else{
            if(selY == "Arbetslöshet")
                selY = "arbetslöshet";
            if(selY == "Inkomst")
                selY = "inkomst";
            if(selY == "Övriga partier")
                selY = "övriga partier";
            self.selectedObjectOnYAxis = selY;
        }
            
        if(self.boolYAxis && self.boolXAxis){
            draw();
        }
    };

    //method to select what should be displayed on the Y-axis
    this.selectXAxis = function()
    {
        var selX = $("#setXAxis option:selected").val();
        self.boolXAxis = true;

        if(selX == "Välj variabel"){
            self.boolXAxis = false;
            clearScatterPlot();
        }
        else{
            if(selX == "Arbetslöshet")
                selX = "arbetslöshet";
            if(selX == "Inkomst")
                selX = "inkomst";
            if(selX == "Övriga partier")
                selX = "övriga partier";
            self.selectedObjectOnXAxis = selX;
        }
        if(self.boolYAxis && self.boolXAxis){
            console.log("Hej nu vill jag rita");
            draw();
        }

    };

    // method to select which year is choosen
    this.selectYear = function()
    {
        selectedYear = $("#selectYear option:selected").text();
        console.log("Väljer år " + $("#selectYear option:selected").text());
    };

}

