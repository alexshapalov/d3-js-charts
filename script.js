d3.json("chess_players.json").then(function(data) {
  const chessPlayersData = data;

  const width = 300;
  const height = 400;

  const svg = d3.select("#chart-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  // Create scales for x and y axes
  const xScale = d3.scaleBand()
      .domain(chessPlayersData.map(player => player.name))
      .range([0, width])
      .padding(0.1);

  const yScale = d3.scaleLinear()
      .domain([0, d3.max(chessPlayersData, d => d.rating)])
      .range([height, 0]);

  // Create and append the bars
  svg.selectAll(".bar")
      .data(chessPlayersData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.name))
      .attr("y", d => yScale(d.rating))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d.rating))
      .attr("fill", "steelblue")
      .on("mouseover", function (d) {
          // Show tooltip on hover
          d3.select(this)
              .attr("fill", "orange"); // Change bar color on hover
          tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html(`
              Name: ${d.name}<br>
              Rating: ${d.rating}<br>
              Rank: ${d.achievements}<br>
              Country: ${d.country}`)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
          // Hide tooltip on mouseout
          d3.select(this)
              .attr("fill", "steelblue"); // Restore original bar color
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
      });

  svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

  svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale));

  const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  }).catch(function(error) {
    console.error("Error loading data:", error);
});
