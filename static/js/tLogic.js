
// cp creates the map with choropleth colored zipcode areas. The code needs to target a div named "map"
// the funciton is invoked by cp(parameter)
// where parameter can be:
// commuteTIme
// valuation
// sqft
// year_built
// the cp call at the bottom of the file sets the initial display data
// still to come are crime and school data and the switch to change color and labels based on which data is being displayed


// f = open('../data/schoolDataFINAL.csv');
// csv_f = csv.reader(f);
// console.log(csv_f);


function cp(geoProp) {

  var container = L.DomUtil.get('map');
  if(container != null){
  container._leaflet_id = null;
  }

  // Creating map object
  var myMap = L.map("map", {
    center: [30.301378,-98.0103974],
    zoomControl: false,
    zoom: 11
  });

  //add zoom control with your options
  L.control.zoom({
    position:'topright'
  }).addTo(myMap);

  // Adding tile layer
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 15,
    id: "mapbox.light",
    accessToken: API_KEY
  }).addTo(myMap);

  // Link to GeoJSON
  var link = "/static/data/EPIC_data_1405.geojson";
  var houseMarkersLink = '../data/houseMarkers.json'

  var geojson;
  console.log(geoProp)
  startColor = "#ffffb2";
  switch (geoProp) {
    case 'commuteTime':
        gpDescriptor = "Commute Time (mins)";
        endColor = 'Indigo';
        break;
    case 'valuation':
        gpDescriptor = "Average Home Value ($)";
        endColor = 'Green';
        break;
    case 'Severity':
        gpDescriptor = "Crime Severity (2016)";
        endColor = 'Crimson';
        break;
    case 'school_rating':
        gpDescriptor = "School Rating";
        endColor = 'Teal'
        break;
    // case 'valuation':
    //     gpDescriptor = "Commute Time (mins)";
    //     endColor = Green;
    //     break;
    // case 'valuation':
    //     gpDescriptor = "Commute Time (mins)";
    //     endColor = Green;
    //     break;
    // case 'valuation':
    //     gpDescriptor = "Commute Time (mins)";
    //     endColor = Green;
}
console.log(gpDescriptor + " " + endColor)

  d3.json(link).then(successHandle);

  function successHandle(data) {
    console.log(data)
    // Create a new choropleth layer
    geojson = L.choropleth(data, {

      // Define what  property in the features to use
      valueProperty: geoProp,

      // Set color scale
      scale: [startColor, endColor],

      // Number of breaks in step range
      steps:8,

      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.5
      },

      // Binding a pop-up to each layer


      
      onEachFeature: function(feature, layer) {
              // Set mouse events to change map styling      
              layer.on({
                // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                mouseover: function(event) {
                  layer = event.target;
                  layer.setStyle({
                    fillOpacity: 0.9
                  });
                },
                // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                mouseout: function(event) {
                  layer = event.target;
                  layer.setStyle({
                    fillOpacity: 0.5
                  });
                },
                // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
                click: function(event) {
                  myMap.fitBounds(event.target.getBounds());
                  console.log(event.sourceTarget.feature.properties.zipcode, geoProp)
                  buildChart(geoProp, event.sourceTarget.feature.properties.zipcode)
                }
              });
              layer.bindPopup('<h2>'+feature.properties.Name+ " - " + feature.properties.zipcode + '</h2>' 
              + "<hr> Sample Count: <strong>" + feature.properties.count + "</strong>"
              + "<h2>Averages</h2><hr>"               
              + "<h4>Home Value: <strong>$" + feature.properties.valuation + "</strong></h4>"
              // + "<h4>Home Value: <strong>$" + (feature.properties.valuation).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</strong></h4>"
              + "<h4>Home Age (years): <strong>" + (2018-feature.properties.year_built) + "</strong></h4>"
              + "<h4>Home Size (sqft): <strong>" + feature.properties.sqft + "</strong></h4>"
              + "<h4>School Rating [1-10]: <strong>" + Math.floor(feature.properties.school_rating) + "</strong></h4>" 
              + "<h4>Commute Time (mins): <strong>" + feature.properties.commuteTime + "</strong></h4>"
              + "<h4>Crime Severity [1-10]: <strong>" + feature.properties.Severity + "</strong></h4>");
            }
    }).addTo(myMap);

    // Set up the legend
    // var legend = L.control({ position: "bottomright" });
    // legend.onAdd = function() {
    //   var div = L.DomUtil.create("div", "info legend");
    //   var limits = geojson.options.limits;
    //   var colors = geojson.options.colors;
    //   var labels = [];

    //   // Add min & max
    //   var legendInfo = "<h1>" + gpDescriptor + "</h1>" +
    //     "<div class=\"labels\">" +
    //       "<div class=\"min\">" + limits[0] + "</div>" +
    //       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    //     "</div>";

    //   div.innerHTML = legendInfo;

    //   limits.forEach(function(limit, index) {
    //     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    //   });

    //   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    //   return div;
    // };

    // // Adding legend to the map
    // legend.addTo(myMap);

    // legend experiment

    console.log (d3.select('#mapkey-box').select('div'));
    d3.select('#mapkey-box').select('div').remove();
    var legendDiv = d3.select('#mapkey-box').append('div').classed("legend", true) ;
    var legendLimits = geojson.options.limits;
    var legendColors = geojson.options.colors;
    var legendLabels = [];
    console.log(legendDiv)

    legendLimits.forEach(function(limit, index) {
      legendLabels.push("<li style=\"background-color: " + legendColors [index] + "\"></li>");
    });

    // Add min & max
    var legendInfo = "<h5>" + gpDescriptor + "</h5>" +
    "<div class=\"labels\">" +
      "<div class=\"min\">" + Math.ceil(legendLimits[0]) + "</div>" +
      "<div class=\"max\">" + Math.ceil(legendLimits[legendLimits.length - 1]) + "</div>" +
    "</div>"+
    "<ul>" + legendLabels.join("") + "</ul>";

    legendDiv.html(legendInfo);

  };

// // creating houseMarker layer
//   d3.json(houseMarkersLink).then(hmsuccessHandle);

//   function hmsuccessHandle(data) {
//     console.log(data)
//     for (var i = 0; i < data.length; i++) {
//       var house = data[i];
//       L.marker(house.location)
//         .bindPopup("<h1>" + house.address + "</h1> <hr> <h3>House Value $" + house.valuation + "</h3>")
//         .addTo(myMap);
//     }
//   }

};

// cp('school_rating');
