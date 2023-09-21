// Save the URL as a constant variable
const url = "http://127.0.0.1:5000/api/v1.0/socioeconomic_2012";

// Function to read data and create the scatter plot
function createBarChart(selectedFactor) {
  // Use D3 library to read in data from the API
  d3.json(url).then(function (data) {
    console.log(data); // Verify that data is loaded correctly

    // Create a dropdown menu with the socioeconomic factors as options
    let dropdownMenu = d3.select("#selDataset");
    let factors = Object.keys(data[0]).filter((key) => key !== "Country");
    dropdownMenu.selectAll("option").remove(); // Remove existing options
    factors.forEach((factor) => {
      dropdownMenu.append("option").text(factor).property("value", factor);
    });

    // Initialize the plot with the first country's data and the selected factor
    updatePlotly(data[0], selectedFactor);
  });
}

// Function called by DOM changes
function getData() {
  let dropdownMenu = d3.select("#selDataset");
  let selectedFactor = dropdownMenu.property("value");

  // Use D3 to fetch the data
  d3.json(url).then(function (data) {
    // Extract the selected socioeconomic factor values (y-axis)
    let xValues = data.map((entry) => entry["Country"]);
    let y1Values = data.map((entry) => entry[selectedFactor]);
    let y2Values = data.map((entry) => entry["Percentage Total"]);

    // Create the scatterplot data
    let scatterData = [
      {
        x: xValues,
        y: y1Values,
        type: "bar",
        name: selectedFactor,
        marker: { colour: "blue" }
      },
      {
        x: xValues,
        y: y2Values,
        type: "bar",
        name: "Percentage Total",
        marker: { colour: "orange" },
        yaxis: "y2", // Use the secondary y-axis
      },
    ];
    

    // Update the plot with the new data
    updatePlotly(scatterData, selectedFactor);
  });
}

// Initialize the page with a default factor
createBarChart("GDP per capita");

// Event listener for changes to the dropdown
d3.select("#selDataset").on("change", getData);

// Function to update the plot
function updatePlotly(newdata, selectedFactor) {
  // Check if the plot already exists
  if (document.getElementById("bar").data) {
    Plotly.newPlot("bar", newdata);
  } else {
    // If the plot doesn't exist, create it with initial data
    Plotly.plot("bar", newdata, {
      xaxis: { title: "Country" }, // Set the x-axis label
      yaxis: { title: selectedFactor }, // Set the y-axis label
      yaxis2:{
        title: "Percentage of Population who smoke",
        overlaying: "y",
        side: "right",
      }
    });
  }
}