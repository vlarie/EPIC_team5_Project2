function buildCharts() {
    d3.json('/jsonifiedData/').then(successHandle).catch(errorHandle)
    function errorHandle(error) {
    console.log("Unable to retrieve data")
    throw error
    }  

    function successHandle(response) {
    console.log(response)
    response.forEach(function(data) {
        data.alat = +data.alat;
        data.alon = +data.alon;
        data.address = data.address;
        data.zipcode = +data.zipcode;
        console.log(alat, alon, address, zipcode);
    });   
    }
}

buildCharts();