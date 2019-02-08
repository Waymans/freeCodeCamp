document.addEventListener('DOMContentLoaded',function(){      
  const dataset = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  req=new XMLHttpRequest();
  req.open("GET",dataset,true);
  req.send();
  req.onload=function(){
    json=JSON.parse(req.responseText);
    const html = json;
    const m = {top: 20, right: 20, bottom: 20, left: 20};
    const w = 1000;
    const h = 500;
    const padding = 50;
    
    const timeFormat = d3.timeFormat("%M:%S");
    
    html.forEach(function(d) {
      d.Time = new Date(3000, 0, 0, 0, d.Time.substring(0,2), d.Time.substring(3,5));
    });
    
    const body = d3.select('body')
                   .style('text-align', 'center')
                   .style('width','90%')
                   .style('margin','10px auto')
    
    const title = body.append('h1')
                    .text('Doping in Professional Cycling')
                    .style('font-family','monospace')
    
    const tooltip = body.append('div') 
                      .attr('id','tooltip')
                      .style('opacity',0)
                        
    const xScale = d3.scaleLinear()
                     .domain([d3.min(html, (d) => d.Year)-1, d3.max(html, (d) => d.Year)+1])
                     .range([padding, w-padding]);
    
    const yScale = d3.scaleLinear()
                     .domain(d3.extent(html, (d) => d.Time))
                     .range([h-padding, padding]);
    
    
    const svg = body.append("svg")
                  .attr('viewBox', '-20 10 ' + (w + m.left + m.right) + ' ' + (h + m.top + m.bottom))
                  .attr('preserveAspectRatio', 'xMidYMid meet')
    
               svg.selectAll("circle")
                  .data(html)
                  .enter()
                  .append("circle")
                  .attr("cx", (d)=> xScale(d.Year)+10)
                  .attr('data-xvalue', function(d, i) {
                    return d.Year
                  })
                  .attr('data-yvalue', function(d, i) {
                    return d.Time
                  })
                  .attr('cy',(d,i) => yScale(d.Time))
                  .attr('r',5)
                  .attr('class', 'dot')
                  .style('fill', (d) => {
                    if (d.Doping === '') {
                      return 'orange'
                    }
                  })
                  .on('mouseover', (d, i) => {
                    const browserHeight = document.querySelector( 'html' ).clientHeight;
                    tooltip.html('Name: ' + d.Name + '<br>' + 'Nationality: ' + d.Nationality + '<br>' + 'Time: ' + timeFormat(d.Time) + '<br>' + d.Doping)
                      .style("left", d3.event.pageX -30 + 'px')
                      .style("top", d3.event.pageY > browserHeight-100 ? d3.event.pageY - 110 +'px': d3.event.pageY + 10 +'px')
                      .style('opacity', 1) 
                      .style('font-size','15px')
                      .attr('data-year', d.Year)
                  })
                  .on('mouseout', () => {
                    tooltip.style('opacity', 0); 
                  })
                  .append('title')
                  .attr('class','tick')

    
    const xAxis = d3.axisBottom(xScale)
                    .ticks(10, "f"); //gets rid of commas
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(timeFormat);
     
    
               svg.append("g")
                  .attr("transform", "translate(10," + (h-padding) + ")")
                  .attr('id','x-axis')
                  .call(xAxis);
    
               svg.append("g")
                  .attr("transform", "translate(" + (padding + 10) + ",0)")
                  .attr('id','y-axis')
                  .call(yAxis);
    
               svg.append('text')
                  .attr('x', h-150)
                  .attr('y', h-3)
                  .text('Year')
    
               svg.append('text')
                  .attr('x',-300)
                  .attr('y',13)
                  .text('Time in minutes')
                  .attr('transform', 'rotate(-90)')
    
    
    const colors = ['#b0413e', 'orange'];
    const legend = svg.selectAll(".legend")
                      .data(colors)
                      .enter().append("g")
                      .attr("id", "legend")
                      .attr("transform", function(d, i) {
                        return "translate(0," + (h/2 + i * 30) + ")";
                      });

                legend.append("rect")
                      .data(colors)
                      .attr("x", w-250)
                      .attr("width", 20)
                      .attr("height", 20)
                      .style('border', '1px solid black')
                      .style("fill", function(d, i) {
                        return colors[i];
                      });

                legend.append("text")
                      .attr("x", w-220)
                      .attr("y", 9)
                      .attr("dy", "5px")
                      .text(function(d, i) {
                        if (i) {
                          return "No doping allegations";
                        } else {
                          return "Doping allegations";
                        };
                      });
    
  };
});