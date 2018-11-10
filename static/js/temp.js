function buildCharts() {
    d3.json('/jsonifiedData/').then(successHandle).catch(errorHandle)
    function errorHandle(error) {
    console.log(error)
    throw error
    }  

    function successHandle(response) {
    console.log(response)
    }   
}

buildCharts()