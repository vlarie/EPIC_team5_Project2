
// cp creates the map with choropleth colored zipcode areas. The code needs to target a div named "map"
// the funciton is invoked by cp(parameter)
// where parameter can be:
// commuteTIme
// valuation
// sqft
// year_built
// the cp call at the bottom of the file sets the initial display data
// still to come are crime and school data and the switch to change color and labels based on which data is being displayed

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
  var link = "../data/EPIC_data.geojson";

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
        endColor = 'DarkMagenta'
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
      steps: 8,

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
              layer.bindPopup(feature.properties.Name + " <br>" + feature.properties.zipcode + "<br> Sample Count:" + feature.properties.count_x + "<br> Average Home Age:" + (2018-feature.properties.year_built) + "<br> Average Home Size (sqft):" + feature.properties.sqft+ "<br> Average School Rating: $" + feature.properties.School_Rating +  "<br> Average Commute Time (mins):" + feature.properties.commuteTime);
            }
    }).addTo(myMap);

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson.options.limits;
      var colors = geojson.options.colors;
      var labels = [];

      // Add min & max
      var legendInfo = "<h1>" + gpDescriptor + "</h1>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + limits[0] + "</div>" +
          "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";

      div.innerHTML = legendInfo;

      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);

  }

}

// cp('school_rating');
