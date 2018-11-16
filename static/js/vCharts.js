function buildCharts(caseName, chosenZip) {
    d3.json('/jsonifiedData/').then(successHandle).catch(errorHandle)
    function errorHandle(error) {
        console.log("Unable to retrieve data")
        throw error
    }  

    function successHandle(response) {
// @TODO - Remove // console.log(response[0])
        // Zillow and commute data (response[0])
        response[0].forEach(function(data) {
            data.zipcode = +data.zipcode;
            data.valuation = +data.valuation;
            data.commuteTime = +data.commuteTime;
        });   
        // Crime data (response[1])
        response[1].forEach(function(data) {
            data.zipcode = +data.zipcode;
            data.offenseCategory = data.offenseCategory;
            data.Severity = +data.Severity;
        });   
        // School data (response[2])
        response[2].forEach(function(data) {
            data.house_zipcode = +data.house_zipcode;
            data.school_rating = +data.school_rating;
        }); 
         
        //////  RESPONSES GROUPED BY ZIPCODE  //////
        // // Zillow/Commute response
        var ZClist = arrayFromObject(response[0]);
        // // Crime response
        var Clist = arrayFromObject(response[1]);
        // // School response
        var Slist = arrayFromObject(response[2]);


        var data = caseName;
        // var chosenZip = 78722;

        switch(data) {
            // If Valuation
            // 78724 - low  - [43]  //////  USED FOR TESTING  @TODO REMOVE
            // 78746 - high - [24]  //////  USED FOR TESTING  @TODO REMOVE
            case 'valuation':
                console.log("Zestimate case selected");
                // var ZClist = arrayFromObject(response[0]);
                var result = groupBy(ZClist, function(item) {
                    return [item.zipcode];
                }); 
                var zillowCommuteZipGroupIndex = zipGroupIndices(result, "zipcode");
                console.log(zillowCommuteZipGroupIndex);
                var index = zillowCommuteZipGroupIndex[chosenZip];
                var data = result[index].map(d => d.valuation);
                    data.y = "# Houses";
                    data.x = "Valuation (Zestimate)";
                x = d3.scaleLinear()
                    .domain(d3.extent(data))
                    .nice()
                    .range([margin.left, width - margin.right])
                bins = d3.histogram()
                    .domain(x.domain())
                    .thresholds(x.ticks(20))
                (data)
                break

            // If Commute
            // 78703 - low  - [12]
            // 78641 - high - [38]
            case 'commuteTime':
                console.log("Commute case selected");
                // var ZClist = arrayFromObject(response[0]);
                var result = groupBy(ZClist, function(item) {
                    return [item.zipcode];
                });
                var zillowCommuteZipGroupIndex = zipGroupIndices(result, "zipcode");
                console.log(zillowCommuteZipGroupIndex);
                var index = zillowCommuteZipGroupIndex[chosenZip];
                var data = result[index].map(d => d.commuteTime);
                    data.y = "# Houses";
                    data.x = "Commute Time (minutes)";
                x = d3.scaleLinear()
                    .domain(d3.extent(data))
                    .nice()
                    .range([margin.left, width - margin.right])
                bins = d3.histogram()
                    .domain(x.domain())
                    .thresholds(x.ticks(20))
                (data)
                break

            // If Crime
            // 78732 - low - [45]
            // 78744 - high - [8]
            case 'Severity':
                console.log("Crime case selected");
                // var Clist = arrayFromObject(response[1]);
                var result = groupBy(Clist, function(item) {
                    return [item.zipcode];
                });
                var crimeZipGroupIndex = zipGroupIndices(result, "zipcode");
                console.log(crimeZipGroupIndex);
                var index = crimeZipGroupIndex[chosenZip];
                var data = result[index].map(d => d.Severity);
                    data.y = "# Incidents";
                    data.x = "Offense Category";
                // Crime x-scale fixed to Severity range
                x = d3.scaleLinear()
                    .domain([0, 7])
                    .nice()
                    .range([margin.left, width - margin.right])
                bins = d3.histogram()
                    // .domain(x.domain())
                    .thresholds(x.ticks(10))
                (data)
                break

            // If School
            // // 78617 - low - [5]  *** Missing 78701, 78722
            // // 78738 - high - [2]
            case 'school_rating':
                console.log("School case selected");
                // var Slist = arrayFromObject(response[2]);
                var result = groupBy(Slist, function(item) {
                    return [item.house_zipcode];
                });
                var schoolZipGroupIndex = zipGroupIndices(result, "house_zipcode");
                console.log(schoolZipGroupIndex);
                var index = schoolZipGroupIndex[chosenZip];
            //////// Match var zipcode to index of same zipcode in schoolZipGroupIndex
                var data = result[index].map(d => d.school_rating);
                    data.y = "# Houses Zoned";
                    data.x = "School Rating";        
                // School x-scale fixed to school_rating range (0-10)
                x = d3.scaleLinear()
                    .domain([0, 10]) 
                    .nice()
                    .range([margin.left, width - margin.right])
                bins = d3.histogram()
                    // .domain(x.domain())
                    .thresholds(x.ticks(20))
                (data)
                break
        }




        // x = d3.scaleLinear()
        //     // .domain(d3.extent(data))
        //     .domain([0, d3.max(data)]) 
        //     .nice()
        //     .range([margin.left, width - margin.right])

        // bins = d3.histogram()
        //     // .domain(x.domain())
        //     .thresholds(x.ticks(20))
        // (data)

    
        y = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .nice()
            .range([height - margin.bottom, margin.top])

        
        bar = svg.append("g")
            .attr("fill", "steelblue")
            .selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", d => x(d.x0))
            .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("y", d => y(d.length))
            .attr("height", d => y(0) - y(d.length));
        
        xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .call(g => g.append("text")
                .attr("transform", `translate(${(margin.left + width + margin.right) / 2}, ${margin.bottom / 2})`)
                .attr("y", 0)
                .classed("axis-text", true)
                .attr("value", "zipcodeGroup") // value to grab for event listener
                .attr("fill", "#000")
                .attr("font-weight", "bold")
                .attr("text-anchor", "end")
                .text(data.x))

    // var xlabelsGroup = chartGroup.append("g")
    //     .attr("transform", `translate(${width / 2}, ${height + 20})`)
    //     .classed("axis-text", true);

    // var zipcodeLabel = xlabelsGroup.append("text")
    //     .attr("x", 0)
    //     .attr("y", 20)
    //     .attr("value", "zipcode") // value to grab for event listener
    //     .classed("active", true)
    //     .text("In Poverty (%)");

        yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                // .attr("x", 4)
                .attr("x", 0 - (height / 2))
                .attr("y", 0 - (margin.left / 3))
                .classed("axis-text", true)
                .attr("transform", "rotate(-90)")
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data.y))

    // var ylabelsGroup = chartGroup.append("g")
    //     .attr("transform", "rotate(-90)")
    //     .attr("x", 0 - (height / 2))
    //     .attr("y", 0 - margin.left)
    //     .attr("dy", "1em")
    //     .attr("value", "obesity") // value to grab for event listener
    //     .classed("active", true)
    //     .text("In Poverty (%)");

    // var obesityLabel = ylabelsGroup.append("text")
    //     .attr("x", 0 - (height / 2))
    //     .attr("y", -80)
    //     .attr("value", "obesity") // value to grab for event listener
    //     .classed("active", true)
    //     .text("Obese (%)");

        svg.append("g")
            .call(xAxis);
        
        svg.append("g")
            .call(yAxis);


        // d3 = require("d3@5")




    //     var histogram = d3.histogram()
    //         .value(d => d.valuation)
    //         .domain(xLinearScale.domain())
    //         .thresholds(xLinearScale.ticks(10));
    
    //     var bins = histogram(response[0]);





///////////////////////////    CODE BELOW NOT USED    ///////////////////////////
///////////////////  BUT MAY HAVE NEEDED CODE FOR TRANSITIONS  /////////////////


    
    // //////  x/yLinearScale functions can be found in <vFunctions.js>  ///////
    // // Create x- & y-scale function variables
    // // var xLinearScale = xScale(response[0], chosenXAxis);
    // // var yLinearScale = yScale(response[0], chosenYAxis);
    
    // // Create initial axis variables
    // var bottomAxis = d3.axisBottom(xLinearScale);
    // var leftAxis = d3.axisLeft(yLinearScale);


    // // Append x-axis
    // var xAxis = chartGroup.append("g")
    //     .classed("x-axis", true)
    //     .attr("transform", `translate(0, ${height})`)
    //     .call(bottomAxis);

    // // Append y-axis
    // var yAxis = chartGroup.append("g")
    //     .classed("y-axis", true)
    //     .call(leftAxis);

    // chartGroup.selectAll(".bar")
    //     .data(response[0])
    //     .enter()
    //     .append("rect")
    //     .attr("class", "bar")
    //     .attr("x", d => xLinearScale(d.zipcode))
    //     .attr("y", d => yLinearScale(d.valuation))
    //     .attr("width", xLinearScale.bandwidth())
    //     .attr("height", d => height - yLinearScale(d.valuation));
    








    ///////////////////  Group for 3 x-axis labels  ////////////////////
    // var xlabelsGroup = chartGroup.append("g")
    //     .attr("transform", `translate(${width / 2}, ${height + 20})`)
    //     .classed("axis-text", true);

    // var zipcodeLabel = xlabelsGroup.append("text")
    //     .attr("x", 0)
    //     .attr("y", 20)
    //     .attr("value", "zipcode") // value to grab for event listener
    //     .classed("active", true)
    //     .text("In Poverty (%)");

        
        
    // ///////////////////  Group for 3 y-axis labels  ////////////////////
    // var ylabelsGroup = chartGroup.append("g")
    //     .attr("transform", "rotate(-90)")
    //     .attr("x", 0 - (height / 2))
    //     .attr("y", 0 - margin.left)
    //     .attr("dy", "1em")
    //     .attr("value", "obesity") // value to grab for event listener
    //     .classed("active", true)
    //     .text("In Poverty (%)");

    // var obesityLabel = ylabelsGroup.append("text")
    //     .attr("x", 0 - (height / 2))
    //     .attr("y", -80)
    //     .attr("value", "obesity") // value to grab for event listener
    //     .classed("active", true)
    //     .text("Obese (%)");



    // ////////////  Pass selected x-axis to event listener  //////////////
    // xlabelsGroup.selectAll("text")
    //     .on("click", function() {
    //     // Get value of selection
    //     var valueX = d3.select(this).attr("value");
    //     if (valueX !== chosenXAxis) {
    //         // Replaces chosenXAxis with value
    //         chosenXAxis = valueX;
    //         console.log(`The valueX is: ${chosenXAxis}`);

    //     //////  Functions used can be found in <functions.js>  ///////
    //         // Updates x-scale for new data
    //         xLinearScale = xScale(newsData, chosenXAxis);

    //         // Updates x-axis with transition
    //         xAxis = renderXAxes(xLinearScale, xAxis);

    //         // Updates circles with new x values
    //         circlesGroup = renderCircles(circlesLoc, circlesText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

    //         // Updates tooltips with new info
    //         circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    //         // Changes classes to change bold text
    //         // for given x-axis selected
    //     // //////////  Poverty  //////////
    //     //     if (chosenXAxis === "poverty") {
    //     //     povertyLabel
    //     //         .classed("active", true)
    //     //         .classed("inactive", false);
    //     //     ageLabel
    //     //         .classed("active", false)
    //     //         .classed("inactive", true);
    //     //     incomeLabel
    //     //         .classed("active", false)
    //     //         .classed("inactive", true);
    //     //     }
    //     // //////////  Age  //////////
    //     //     else if (chosenXAxis === "age" ) {
    //     //     povertyLabel
    //     //         .classed("active", false)
    //     //         .classed("inactive", true);
    //     //     ageLabel
    //     //         .classed("active", true)
    //     //         .classed("inactive", false);
    //     //     incomeLabel
    //     //         .classed("active", false)
    //     //         .classed("inactive", true);
    //     //     }
    //     // //////////  Income  //////////
    //     //     else if (chosenXAxis === "income" ) {
    //     //     povertyLabel
    //     //         .classed("active", false)
    //     //         .classed("inactive", true);
    //     //     ageLabel
    //     //         .classed("active", false)
    //     //         .classed("inactive", true);
    //     //     incomeLabel
    //     //         .classed("active", true)
    //     //         .classed("inactive", false);
    //     //     }
    //     }
    //     });

    // ////////////  Pass selected y-axis to event listener  //////////////
    // ylabelsGroup.selectAll("text")
    //     .on("click", function() {
    //     // Get value of selection
    //     var valueY = d3.select(this).attr("value");
    //     if (valueY !== chosenYAxis) {
    //         // Replaces chosenYAxis with value
    //         chosenYAxis = valueY;
    //         console.log(`The valueY is: ${chosenYAxis}`);

    //     //////  Functions used can be found in <functions.js>  ///////
    //         // Updates y-scale for new data
    //         yLinearScale = yScale(newsData, chosenYAxis);

    //         // Updates y-axis with transition
    //         yAxis = renderYAxes(yLinearScale, yAxis);

    //         // Updates circles with new y values
    //         circlesGroup = renderCircles(circlesLoc, circlesText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

    //         // Updates tooltips with new info
    //         circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
            
    //         // Changes classes to change bold text
    //         // for given y-axis selected
    //     // //////////  Obesity  //////////
    //     //     if (chosenYAxis === "obesity") {
    //     //     obesityLabel
    //     //         .classed("active", true)
    //     //         .classed("inactive", false);
    //     //     smokesLabel
    //     //         .classed("active", false)
    //     //         .classed("inactive", true);
    //     //     healthcareLabel
    //     //         .classed("active", false)
    //     //         .classed("inactive", true);
    //     //     }
    //     // //////////  Smoking  //////////
    //     //     else if (chosenYAxis === "smokes" ) {
    //     //     obesityLabel
    //     //         .classed("active", false)
    //     //         .classed("inactive", true);
    //     //     smokesLabel
    //     //         .classed("active", true)
    //     //         .classed("inactive", false);
    //     //     healthcareLabel
    //     //         .classed("active", false)
    //     //         .classed("inactive", true);
    //     //     }
    //     // //////////  Healthcare  //////////
    //     //     else if (chosenYAxis === "healthcare" ) {
    //     //     obesityLabel
    //     //         .classed("active", false)
    //     //         .classed("inactive", true);
    //     //     smokesLabel
    //     //         .classed("active", false)
    //     //         .classed("inactive", true);
    //     //     healthcareLabel
    //     //         .classed("active", true)
    //     //         .classed("inactive", false);
    //     //     }
    //     }
    //     });

    // }

    ////////////////////////////////////////////////////////////////////

    }
}

buildCharts();