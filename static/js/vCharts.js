function buildCharts() {
    d3.json('/jsonifiedData/').then(successHandle).catch(errorHandle)
    function errorHandle(error) {
    console.log("Unable to retrieve data")
    throw error
    }  

    function successHandle(response) {
        console.log(response[0])
        // Zillow and commute data (response[0])
        response[0].forEach(function(data) {
            data.zipcode = +data.zipcode;
            data.valuation = +data.valuation;
            data.value_change = +data.value_change;
            data.value_range_high = +data.value_range_high;
            data.value_range_high = +data.value_range_low;
            data.value_sqft = +data.value_sqft;
            data.year_built = +data.year_built;
            data.commuteTime = +data.commuteTime;
        });   
        // Crime data (response[1])
        response[1].forEach(function(data) {
            data.zipcode = +data.zipcode;
            data.offenseCategory = data.offenseCategory;
            data.offenseDetails = data.offenseDetails;
        });   
        // School data (response[2])
        // response[2].forEach(function(data) {
        //     data.zipcode = +data.zipcode;
        //     data.offenseCategory = data.offenseCategory;
        //     data.offenseDetails = data.offenseDetails;
        // }); 
         
      // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
    
    var xBandScale = d3.scaleBand()
        .domain(response[0].map(d => d.zipcode))
        .range([0, width])
        .padding(0.1);

    // Create a linear scale for the vertical axis.
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(response[0], d => d.valuation)])
        .range([height, 0]);
    
    //////  x/yLinearScale functions can be found in <vFunctions.js>  ///////
    // Create x- & y-scale function variables
    // var xLinearScale = xScale(response[0], chosenXAxis);
    // var yLinearScale = yScale(response[0], chosenYAxis);
    
    // Create initial axis variables
    var bottomAxis = d3.axisBottom(xBandScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append x-axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Append y-axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    chartGroup.selectAll(".bar")
        .data(response[0])
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xBandScale(d.zipcode))
        .attr("y", d => yLinearScale(d.valuation))
        .attr("width", xBandScale.bandwidth())
        .attr("height", d => height - yLinearScale(d.valuation));
    
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