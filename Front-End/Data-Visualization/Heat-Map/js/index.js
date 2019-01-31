document.addEventListener('DOMContentLoaded',function(){      
  const dataset = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  req=new XMLHttpRequest();
  req.open("GET",dataset,true);
  req.send();
  req.onload=function(){
    json=JSON.parse(req.responseText);
    const html = json.monthlyVariance;
    
    const w = 1315;
    const h = 494;
    const padding = 50;

    const labels = ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    let color = d3.scaleSequential()
                  .domain([d3.min(html, (d) => d.variance), d3.max(html, (d) => d.variance)])
                  .interpolator(d3.interpolateInferno);
                        
    const xScale = d3.scaleLinear()
                     .domain([d3.min(html, (d) => d.year), d3.max(html, (d) => d.year)+1])
                     .rangeRound([padding, w-padding]);
    
    const yScale = d3.scaleBand()
                     .domain(months)
                     .rangeRound([h-padding, padding])
                     .paddingInner(.2)
                     .paddingOuter(0)
    
    const body = d3.select('body')
                   .style('text-align','left')
    
    const title = body.append('h1')
                    .append('text')
                    .attr('id','title')
                    .text('Monthly Temperature Variance')
                    .style('margin', '150px')
    
    const subtitle = body.append('h3')
                    .append('text')
                    .attr('id','description')
                    .text('From 1753-2015; Base Temp: 8.66 \u2103')
                    .style('margin', '150px')
    
    const tooltip = body.append('div')
                    .attr('id','tooltip')
                    .attr('class','tooltip')
                    .style('opacity',0)
                      
    const svg = body.append("svg")
                  .attr('viewBox', '-10 -20 ' + (w + 20 + 20) + ' ' + (h + 20 + 20))
                  .attr('preserveAspectRatio', 'xMidYMid meet')
    
               svg.selectAll(".cell") // rect
                  .data(html)
                  .enter()
                  .append("rect")
                  .attr('class', 'cell')
                  .attr("x", (d, i)=> xScale(d.year)+40)
                  .attr('data-year', (d)=> d.year )
                  .attr('data-month', (d)=> d.month-1)
                  .attr('data-temp', (d)=> d.baseTemperature + d.variance)
                  .attr('y',(d,i) => {
                    for (let i=0; i<12; i++) {
                      if (d.month === 12-i) {
                        return i*(h-2*padding)/12+padding
                      }
                    }
                  })
                  .attr('height', (h-2*padding)/12)
                  .attr('width', 5)
                  .attr('fill', (d,i)=> color(d.variance))
                  .on('mousemove', (d, i) => {
                    const browserWidth = document.querySelector( 'html' ).clientWidth;
                    const browserHeight = document.querySelector( 'html' ).clientHeight;
                    tooltip.html('Year: ' + d.year + '<br>' + 'Month: ' + months[d.month-1] + '<br>' + 'Variance: ' + d.variance + "&#8451;" + '<br>' + 'Temp: ' + (8.66 + d.variance).toFixed(3) + "&#8451;")
                      .style('left', d3.event.pageX < browserWidth/2 ? d3.event.pageX + 15 + 'px': d3.event.pageX - 220 + 'px' )
                      .style('top', d3.event.pageY > browserHeight-100 ? d3.event.pageY - 50 + 'px': d3.event.pageY + 'px' )
                      .style('opacity', 1) 
                      .style('font-size','15px')
                      .attr('data-year', d.year)
                      .attr('data-month', d.month-1)
                    //d3.select('.cell').style('fill', 'white')
                  })
                  .on('mouseout', () => {
                    tooltip.style('opacity', 0);
                    //d3.select('.cell').style('fill', (d,i)=> color(d.variance));
                  })
                  .append('title')
                  .attr('class','tick')

    
    const xAxis = d3.axisBottom(xScale)
                    .ticks(10, "f") //gets rid of commas
                    .tickSize(10,1);
    const yAxis = d3.axisLeft(yScale)
                    .tickSize(10,1);
     
    
               svg.append("g")
                  .attr("transform", "translate(40," + (h-padding) + ")")
                  .attr('id','x-axis')
                  .style('font-size','15px')
                  .call(xAxis);
    
               svg.append("g")
                  .attr("transform", "translate(" + (padding+40) + ",0)")
                  .attr('id','y-axis')
                  .style('font-size','15px')
                  .call(yAxis);
    
               svg.append('text')
                  .attr('x', w/2)
                  .attr('y', h-3)
                  .text('Year')
    
               svg.append('text')
                  .attr('x',-300)
                  .attr('y',20)
                  .text('Month')
                  .attr('transform', 'rotate(-90)')
    
    const min = d3.min(html, (d) => d.variance), max = d3.max(html, (d) => d.variance);
    const legendD = [min, (min + 1*(max-min)/9), (min + 2*(max-min)/9), (min + 3*(max-min)/9), (min + 4*(max-min)/9), (min + 5*(max-min)/9), (min + 6*(max-min)/9), (min + 7*(max-min)/9),(min + 8*(max-min)/9), max]
    
    
    const legend = svg.selectAll("legend")
                      .data(legendD)
                      .enter().append("g")
                      .attr("id", "legend")
                      .attr("transform", (d, i)=> {
                        return "translate(" + (i * 30) + ",0)";
                      });

                legend.append("rect")
                      .attr("x", w-600)
                      .attr("width", 30)
                      .attr("height", 20)
                      .style('border', '1px solid black')
                      .style("fill", (d, i)=> color(d));

                legend.append("text")
                      .attr("x", w-590)
                      .attr("y", 10)
                      .attr("dy", "18px")
                      .style("fill", (d, i)=> color(-d))
                      .style('text-shadow','2px 1px 1px black')
                      .text( (d, i)=> {
                        return labels[i]
                      });
    
  };
});