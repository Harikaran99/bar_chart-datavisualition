import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 800;
const height = 400;
const padding = 30;
const data = await d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
.then(data => data.data)
const barWidth = width / data.length
console.log(barWidth)


const svg = d3.select("#visholder")
 .append("svg")
 .attr("width", width + 60)
 .attr("height", height + 20)

// yScale min && max 
const yMin = d3.min(data, d => d[1])
const yMax = d3.max(data, d => d[1])

 const yScale = d3.scaleLinear().domain([yMin, yMax]).range([height-padding, padding])
 const yAxis = d3.axisLeft(yScale)
 
 svg.append("g")
 .attr("transform", `translate(60, 0)`)
 .call(yAxis)



