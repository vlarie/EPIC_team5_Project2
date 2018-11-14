// function used for updating x-scale var upon click on axis label
function xScale(newsData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([
            d3.min(newsData, d => d[chosenXAxis]) * 0.8,
            d3.max(newsData, d => d[chosenXAxis]) * 1.2,
            // d3.max(newsData, d => d[chosenXAxis]) * 1.6
        ])
        .range([0, width]);

    return xLinearScale;
}

// function used for updating x-scale var upon click on axis label
function yScale(newsData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([
            d3.min(newsData, d => d[chosenYAxis]) * 0.6,
            d3.max(newsData, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);

    return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for updating xAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

///////////////  Update circles group with transition to new circles  ///////////////
// function used for updating circles group with a transition to new circles
function renderCircles(circlesLoc, circlesText, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesLoc.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    circlesText.transition()
        .duration(1000)
        .attr("dx", d => newXScale(d[chosenXAxis]))
        .attr("dy", d => newYScale(d[chosenYAxis]) + 5);

    return circlesLoc, circlesText;
}

///////////////  Update circles group with new tooltip  ///////////////
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    if (chosenXAxis === "poverty") {
        var labelX = "Poverty (%)";
    }
    else if (chosenXAxis === "age") {
        var labelX = "Age (Median)";
    }
    else if (chosenXAxis === "income") {
        var labelX = "Household Income (Median)";
    }

    if (chosenYAxis === "obesity") {
        var labelY = "Obese (%)";
    }
    else if (chosenYAxis === "smokes") {
        var labelY = "Smokes (%)";
    }
    else if (chosenYAxis === "healthcare") {
        var labelY = "Lacks Healthcare (%)";
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br> ${labelX}: ${d[chosenXAxis]}<br> ${labelY}: ${d[chosenYAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup
        .on("mouseover", function (data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}
