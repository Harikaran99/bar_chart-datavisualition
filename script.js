import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// declare variables
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
const height = 460 
const width = 900 
const padding = {
    top: 10,
    right: 60,
    bottom: 60,
    left: 50
}


// visualization
const svg = d3.select("#visholder")
              .append("svg")
              .attr("height", height)
              .attr("width", width)

// handle date with quater format
function quaterFormat(value) {
  let date = new Date(value)
  const month = date.getMonth()
  const year = date.getFullYear()
  
  switch(month + 1){
    case 1:
      return `${year} Q1`
    case 4:
      return `${year} Q2`
    case 7:
      return `${year} Q3`
    case 10:
      return `${year} Q4`
  }
}

// d3 manipulation
d3.json(url).then(data =>{
    //Scope veriables
    const dataLength = data.data.length
    let barWidth = width/dataLength
    const yearsChanger = data.data.map(x => new Date(x[0]))
    const gdp = data.data.map(x => x[1])
   
    const tooltip = d3
      .select("#visholder")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0)

    //xMin, xMax && yMin, yMax
    const [xMin, xMax] = d3.extent(yearsChanger)
    const [yMin, yMax] = d3.extent(gdp)

    //scale GDP
    const gtp_Scale = d3.scaleLinear([0,yMax], [0, height - padding.bottom]) 
    const scaledGdp = data.data.map(x => gtp_Scale(x[1]))

    //xScale && yScale
    const xScale = d3.scaleTime([xMin, xMax], [0, width - padding.right])
    const yScale = d3.scaleLinear([0, yMax], [height - padding.bottom, 0])

    //xAxis && yAxis
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    // xAxis in svg
    svg.append("g")
    .attr("transform", `translate(51, ${height - padding.left})`)
    .attr("id", "x-axis")
    .call(xAxis)
    

    //xAxis dataset link in svg
    svg.append("text")
       .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
       .attr("id", "link")
       .attr("class", "sub-text")
       .attr("x", 500)
       .attr("y", height-5)


    // yAxis in svg
    svg.append("g")
    .attr("transform", `translate(${padding.left - 0.5}, ${padding.top})`)
    .attr("id", "y-axis")
    .call(yAxis)

    //yAxis title in svg
    svg.append("text")
       .text("Gross Domestic Product")
       .attr("transform" ,"rotate(-90)")
       .attr("class", "sub-text")
       .attr("x", -200)
       .attr("y", 70)
       

    // bar visuals
    svg.selectAll("rect")
       .data(data.data)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("stroke", "rgb(21, 21, 21)")
       .attr("stroke-width", "1")
       .attr("fill", "blue")
       .attr("width", barWidth)
       .attr("height", (d, i) => scaledGdp[i])
       .attr("x", (d, i) => padding.left + xScale(yearsChanger[i]))
      //  .attr("index", (d, i) => i)
       .attr("data-date", (d, i) => d[0])
       .attr("data-gdp", (d, i) => d[1])
       .attr("y", (d, i) => height - padding.left -  scaledGdp[i])
       //handle mouseover event
       .on("mouseover", (event, d, i) => {
         tooltip.attr("data-date", d[0])
         tooltip.style("opacity", 0.9)
         tooltip.transition().duration(200)
         tooltip.html(`
            <p>${quaterFormat(d[0])}</p>
            <p>$${d[1].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} Billion</p>
            `)
            tooltip.style("left", (event.pageX + 20) + "px")
            tooltip.style("top", (event.pageY - 28) + "px");
       })
       .on("mouseout", (event) => {
         tooltip.transition().duration(200).style("opacity", 0)
       })
         
})
.catch(error => console.log(error))