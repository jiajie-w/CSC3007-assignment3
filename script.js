let width = 1000, height = 600;
var json_data, csv_data;
// $.ajax({ 
//     type: 'GET', 
//     url: 'https://chi-loong.github.io/CSC3007/assignments/sgmap.json', 
//     dataType: 'json',
//     success: function (data) { 
//         json_data = data;
//     }
// })
// $.ajax({ 
//   type: 'GET', 
//   url: 'https://chi-loong.github.io/CSC3007/assignments/population2021.csv', 
//   success: function (data) { 
//       csv_data = data;
//   }
// })
let svg = d3.select("svg")
    .attr("viewBox", "0 0 " + width + " " + height)

// Load external data
Promise.all([d3.json('https://chi-loong.github.io/CSC3007/assignments/sgmap.json'), d3.csv('https://chi-loong.github.io/CSC3007/assignments/population2021.csv')]).then(data => {
    
console.log(data[0]);
console.log(data[1]);
let pop_data = new Map()
for(let i = 0; i < data[1].length; i++){
    pop_data.set(data[1][i].Subzone.toUpperCase(), data[1][i].Population)
}
console.log(pop_data);

//colorscale, check https://observablehq.com/@d3/color-legend for another way of doing the legend
var colorScale = d3.scaleThreshold()
    .domain([0,200,800, 8000, 16000, 24000, 32000, 40000, 48000, 56000])
    .range(d3.schemeBlues[9]);

var legend = d3.legendColor()
    .labels([0,200,800, 8000, 16000, 24000, 32000, 40000, 48000, 56000])
    .labelFormat(d3.format(".0f"))
    .scale(colorScale)
    .title("Population color scale");

legend = svg.append("g")
    .attr("class","legend")
    .attr("transform", "translate(50,30)")
    .style("font-size","10px")
    .call(legend)


// Map and projection
var projection = d3.geoMercator()
    .center([103.851959, 1.290270])
    .fitExtent([[20, 20], [980, 580]], data[0]);

let geopath = d3.geoPath().projection(projection);

var tooltip=d3.select(".tooltip")

svg.append("g")
    .attr("id", "districts")
    .selectAll("path")
    .data(data[0].features)
    .enter()
    .append("path")
    .attr("stroke", "grey")
    .attr("stroke-width", 0.5)
    .attr("d", geopath)
    .attr("fill", function(d){
        return colorScale(pop_data.get(d.properties.Name))
    })
    .on("mouseover", function(event,d) {
        d3.select(event.currentTarget)
        .transition()
        .duration(300)
        .style("stroke", "red")
        .style("stroke-width", 2)
        .style("opacity", 2)

        d3.select(".tooltip")
        .html('Area: '+d.properties.Name + '<br>' 
                +'Total Population: ' +pop_data.get(d.properties.Name))
        .style("left",(event.pageX)+"px")
        .style("top", (event.pageY)+"px")
        .transition()
        .duration(300)
        .style("opacity", 1)
        .style("position", "absolute")
        .style("background-color","#F8F0E3")
        
    })
    .on("mouseout", function(event, d) {
        d3.select(event.currentTarget)
        .transition()
        .duration(300)
        .style("stroke",  "grey")
        .style("stroke-width", 0.5)

        d3.select(".tooltip")
        .transition()
        .duration(300)
    })

})