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
    }
}

buildCharts();