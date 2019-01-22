// Initializing the map with dark theme, centered on Austin
var map = new mapboxgl.Map({
    container: 'kMap',
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [-97.7431,30.2672],
    zoom: 9.55,
});

// Function to create an array with variable start and end
function numberRange (start, end) {
    return new Array(end - start).fill().map((d, i) => i + start);
  };

// Create array for all years
var years = numberRange(1898, 2019);    // [1898, ..., 2018]

// Function to filter map data by year
function filterBy(year) {
    
    var filters = ['<=', 'year_built', year];
    map.setFilter('houses-heat', filters);
    map.setFilter('houses-point', filters);

    document.getElementById('year').textContent = year;

}

// When map loads, run the following map functions
map.on('load', function() {
    
    // Add a geojson point source.
    map.addSource('houses', {
        "type": "geojson",
        "data": "https://raw.githubusercontent.com/vlarie/EPIC_team5_Project2/kTimelapse/data/kZillowYearBuilt.geojson"
    });

    // Add layer for heatmap until z15
    map.addLayer({
        id: 'houses-heat',
        type: 'heatmap',
        source: 'houses',
        maxzoom: 15,
        // filter: ["<=", "year_built", 1900],
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

    // Add layer for circle after zooming in to z13.5
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

    filterBy(1898);

    document.getElementById('slider').addEventListener('input', function(e) {
        var year = parseInt(e.target.value);
        filterBy(year);
    })
});