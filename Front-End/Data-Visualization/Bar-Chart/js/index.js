document.addEventListener('DOMContentLoaded',function(){      
  const dataset = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  req=new XMLHttpRequest();
  req.open("GET",dataset,true);
  req.send();
  req.onload=function(){
    json=JSON.parse(req.responseText);
    const html = json.data;
    const m = {top:20, right:20, bottom:20, left:20}
    const w = 1000 -m.left-m.right;
    const h = 500 -m.top-m.bottom;
    const padding = 50;

                        
    const xScale = d3.scaleLinear()
                     .domain([d3.min(html, (d) => d[0].substring(0,4)), (parseFloat(d3.max(html, (d) => d[0].substring(0,4)))+1).toString()])
                     .range([padding, w-padding]);
    
    const yScale = d3.scaleLinear()
                     .domain([0,d3.max(html, (d) => d[1])+2000])
                     .range([h-padding, 10]);
    
    const parser = (e) => {
      if (e >= 1000) {
        return (e/1000).toFixed(4) + ' Trillion'
      } else {
        return e + ' Billion'
      }
    }
    
    const body = d3.select('body')
                   .style('background','#002240')
                   .style('text-align','center') 
    
    const title = body.append('h1')
                    .append('text')
                    .attr('id','title')
                    .attr('class','title')
                    .text('United States Gross Domestic Product')
                    
    
    const tooltip = body.append('div')
                      .attr('id','tooltip')
                      .style('opacity',0)
                      .attr('class','tooltip')
                      .style('pointer-events', 'none')
     
    
    const svg = body.append("svg")
                  .attr('viewBox', '-20 5 ' + (w+m.right) + ' ' + (h))
                  .attr('preserveAspectRatio', 'xMidYMid meet')
    
               svg.selectAll("rect")
                  .data(html)
                  .enter()
                  .append("rect")
                  .attr("x", (d)=> {
                    switch(d[0].slice(5,7)) {
                      case '01':
                        return xScale(d[0].substring(0,4).concat('.', 0));
                        break;
                      case '04':
                        return xScale(d[0].substring(0,4).concat('.', 25));
                        break;
                      case '07':
                        return xScale(d[0].substring(0,4).concat('.', 5));
                        break;
                      case '10':
                        return xScale(d[0].substring(0,4).concat('.', 75));
                        break;
                      default:
                        break;
                    }
                  })
                  .attr('data-date', (d, i) => {
                    return d[0]
                  })
                  .attr('data-gdp', (d, i) => {
                    return d[1]
                  })
                  .attr('y',(d,i) => yScale(d[1]))
                  .attr('height',d=> h-yScale(d[1])-padding)
                  .attr('width', 4)
                  .attr('class', 'bar')
                  .on('mousemove', (d, i) => {
                    const browserWidth = document.querySelector( 'html' ).clientWidth;
                    const browserHeight = document.querySelector( 'html' ).clientHeight;
                    var year, month;
                    year = d[0].substring(0,4);
                    month = d[0].substring(5,7);
                    if (month === '01') {month = 'January'};
                    if (month === '04') {month = 'April'};
                    if (month === '07') {month = 'July'};
                    if (month === '10') {month = 'October'};
                    tooltip.html(month + ', ' + year + '<br>' + '$' + parser(d[1]))
                      .style('left', d3.event.pageX < browserWidth/2 ? d3.event.pageX + 20 + 'px': d3.event.pageX - 220 + 'px' )
                      .style('top', d3.event.pageY > browserHeight-50 ? d3.event.pageY - 50 + 'px': d3.event.pageY - 100 + 'px' )
                      .style('opacity', 1) 
                      .style('font-size','20px')
                      .attr('data-date', d[0])
                  })
                  .on('mouseout', () => {
                    tooltip.style('opacity', 0);       
                  })
                  .append('title')
                  .attr('class','tick')

    
    const xAxis = d3.axisBottom(xScale)
                    .ticks(10, "f"); //gets rid of commas
    const yAxis = d3.axisLeft(yScale);
    
               svg.append("g")
                  .attr("transform", "translate(0," + (h-padding) + ")")
                  .attr('id','x-axis')
                  .attr('class', 'axis')
                  .call(xAxis);
    
               svg.append("g")
                  .attr("transform", "translate(" + padding + ",0)")
                  .attr('id','y-axis')
                  .attr('class', 'axis')
                  .call(yAxis);
    
               svg.append('text')
                  .attr('x', h/2)
                  .attr('y', h-3)
                  .style('fill', 'white')
                  .text('Year')
    
               svg.append('text')
                  .attr('x',-200)
                  .attr('y',80)
                  .text('GDP in Billions')
                  .style('fill', 'white')
                  .attr('transform', 'rotate(-90)')
    
               svg.append('text')
                  .attr('x', h+85)
                  .attr('y', h-3)
                  .style('fill', 'gray')
                  .text('More Info:http://www.bea.gov/national/pdf/nipaguid.pdf')
    
   
  };
});