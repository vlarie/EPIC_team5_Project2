var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v9',
  center: [-97.7431,30.2672],
  zoom: 9.75
});

map.on('load', function() {
  // Add a geojson point source.
  // Heatmap layers also work with a vector tile source.
  map.addSource('houses', {
      "type": "geojson",
      "data": "https://raw.githubusercontent.com/vlarie/EPIC_team5_Project2/kTimelapse/data/kZillowYearBuilt.geojson"
  });


map.addLayer({
  id: 'houses-heat',
  type: 'heatmap',
  source: 'houses',
  maxzoom: 15,
  paint: {
      // increase weight as diameter breast height increases
      'heatmap-weight': {
      property: 'dbh',
      type: 'exponential',
      stops: [
          [1, 0],
          [62, 1]
      ]
      },
      // increase intensity as zoom level increases
      'heatmap-intensity': {
      stops: [
          [11, 1],
          [15, 3]
      ]
      },
      // assign color values be applied to points depending on their density
      'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0, 'rgba(236,222,239,0)',
      0.2, 'rgb(208,209,230)',
      0.4, 'rgb(166,189,219)',
      0.6, 'rgb(103,169,207)',
      0.8, 'rgb(28,144,153)'
      ],
      // increase radius as zoom increases
      'heatmap-radius': {
      stops: [
          [11, 15],
          [15, 20]
      ]
      },
      // decrease opacity to transition into the circle layer
      'heatmap-opacity': {
      default: 1,
      stops: [
          [14, 1],
          [15, 0]
      ]
      },
  }
  }, 'waterway-label');

map.addLayer({
  "id": "houses-point",
  "type": "circle",
  "source": "houses",
  minzoom: 13.5,
  "paint": {
      "circle-radius": 5,
      "circle-color": "white",
      // Transition from heatmap to circle layer by zoom level
      "circle-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          7, 0,
          8, 1
      ]
  }
}, 'waterway-label');
});