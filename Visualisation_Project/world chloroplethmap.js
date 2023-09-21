//this gives you a popup window when you hover over an area and the color becomes solid 
// Creating the map object
let myMap = L.map("map", {
    center: [0, 0],
    zoom: 2
  });
  
  // Adding the tile layer (base layer)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Use this link to get the GeoJSON data.
  let link = "http://127.0.0.1:5000/api/v1.0/world_smoking_stats_2000";
  
  // The function that will determine the colour of a neighbourhood based on the borough that it belongs to
  function chooseColor(percentageTotal) {
    return percentageTotal < 1 ? "blue":
           percentageTotal < 3 ? "green":
           percentageTotal < 5 ? "yellow":
           percentageTotal < 10 ? "orange":
           "red";
  }
  
  // Getting our GeoJSON data
d3.json(link).then(function (data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        // Styling each feature (in this case, a country)
        style: function (feature) {
            return {
                color: "white",
                // Call the chooseColor() function to decide which color to color our country. (The color is based on the smoking percentage.)
                fillColor: chooseColor(feature.properties["Percentage Total"]),
                fillOpacity: 0.5,
                weight: 1.5
            };
        },
      
      // Binding a popup to each layer
            onEachFeature: function(feature, layer) {
              layer.bindPopup("<strong>" + feature.properties.CountryName + "</strong><br /><br />Percentage of population that are smokers: " +
                feature.properties["Percentage Total"] + "<br /><br />Percentage of smokers that are male: $" + feature.properties["Percentage Males"] +
                "<br /><br />Percentage of smokers that are female: $" + feature.properties["Percentage Females"]);
            }
          }).addTo(myMap);
         // Adding a legend to the map
        let legend = L.control({ position: 'bottomright' });
        legend.onAdd = function (map) {
            let div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 3, 5, 10],
            labels = [],
            from, to;

        for (let i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];
            
            labels.push(
                '<i style="background:' + chooseColor(from + 0.5) + '"></i> ' +
                from + (to ? '&ndash;' + to : '+'));
        }

        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(myMap);
});






