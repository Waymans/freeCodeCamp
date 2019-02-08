//add hover styles 
document.addEventListener('DOMContentLoaded',function(){
  const educationData = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";
  const countyData = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";
  
  req = new XMLHttpRequest();
  req.open("GET",countyData,true);
  req.send();
  req.onload = function(){
    const jsonC = JSON.parse(req.responseText);
    req2=new XMLHttpRequest();
    req2.open("GET",educationData,true);
    req2.send();
    req2.onload = function(){
      const jsonE = JSON.parse(req2.responseText);

      const m = {top: 20, right: 50, bottom: 20, left: 20};
      const h = 600 - m.top - m.bottom;
      const w = 950 - m.right - m.left;
      
      const county = d => jsonE.filter(x => x.fips === d.id)[0];

      const lowEduc = d3.min(jsonE, d => d.bachelorsOrHigher);
      const highEduc = d3.max(jsonE, d => d.bachelorsOrHigher);

      const colors = d3.scaleSequential()
            .domain([lowEduc, highEduc])
            .interpolator(d3.interpolatePuRd)
      
      const body = d3.select('body')
            .style('text-align', 'center')
            .style('width','90%')
            .style('margin',"20px auto")
            .style('background','darkseagreen')
      
      const title = body.append('h1')
            .attr('id', 'title')
            .style('font-family','Monospace')
            .style('margin-bottom', 0)
            .text('U.S Choropleth Map')
      
      const subtitle = body.append('h3')
            .attr('id', 'description')
            .style('font-family','Monospace')
            .style('margin-top', 0)
            .text('Percentage of 25yo+ with Bachelors Degree or Higher (2010-2014)')
          
      const tooltip = body.append('div')
            .attr('id','tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('justify-content','center')
            .style('padding', '2px')
            .style('width', '200px')
            .style('height', 'auto')
            .style('box-shadow', '3px 3px 10px black')
            .style('pointer-events', 'none')
            .style('background', 'lightsteelblue')
            .style('font-size', '20px')
      
      const container = body.append('div')
            .style('display', 'inline')
            .style('justify-content', 'center')
            .attr('id', 'container')
            .append('div')
            .style('height', h + m.top + m.bottom)
            .style('width', w + m.left + m.right)
            .style('background-color', 'lightseagreen')
            .style('box-shadow', '5px 5px 5px black')
            
      
      const svg = container.append('svg')
            .attr('id', 'map')
            .attr('viewBox', '0 0 ' + (w + m.left + m.right) + ' ' + (h + m.top + m.bottom))
            .attr('preserveAspectRatio', 'xMidYMid meet')
            

      const us = svg.append('g')
            .selectAll("path")
            .data(topojson.feature(jsonC, jsonC.objects.counties).features)
            .enter()
            .append("path") 
            .attr('class','county')
            .attr('data-fips', d => d.id)
            .attr('data-education', d => county(d).bachelorsOrHigher)
            .attr('fill', d => colors(county(d).bachelorsOrHigher))
            .attr('d', d3.geoPath())
            .on('mousemove', d => {
              const browserWidth = document.querySelector( 'html' ).clientWidth;
              const browserHeight = document.querySelector( 'html' ).clientHeight;
              tooltip.html(county(d).area_name + ', ' + 
                           county(d).state + ':<strong>' + ' ' + 
                           county(d).bachelorsOrHigher + '%</strong>')
                     .style('opacity',1)
                     .style('left', d3.event.pageX < browserWidth/2 ? d3.event.pageX + 20 + 'px': d3.event.pageX - 220 + 'px' )
                     .style('top', d3.event.pageY > browserHeight-50 ? d3.event.pageY - 50 + 'px': d3.event.pageY + 'px' )
                     .attr('data-education', county(d).bachelorsOrHigher)
                     
            })
            .on('mouseout', d => tooltip.style('opacity',0))
            

      const legend = svg.selectAll('.legend')
            .data(colors.ticks(6))
            .enter().append('g')
            .attr('id','legend')
            .attr('transform', (d,i) => {
              return "translate(" + (w/1.6 + 40*i) + "," + "20)"})
      
      const labels = [Math.round(lowEduc), Math.round(lowEduc + (highEduc-lowEduc)/5), Math.round(lowEduc + 2*(highEduc-lowEduc)/5), Math.round(lowEduc + 3*(highEduc-lowEduc)/5), Math.round(lowEduc + 4*(highEduc-lowEduc)/5), Math.round(highEduc)]      
      legend.append('rect')
            .attr('height', '20px')
            .attr('width', '40px')
            .style('fill', colors)
      legend.append('text')
            .data(labels)
            .style('font-size', '12px')
            .attr('x', 20)
            .attr('y', -1)
            .attr("dx", "1em")
            .text(d => d + '%')
      
      const states = svg.append('path')
            .data(topojson.feature(jsonC, jsonC.objects.states).features)
           
      states.datum(topojson.mesh(jsonC, jsonC.objects.states), (a, b) => a !== b)
            .attr("d", d3.geoPath())
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("fill", "none")
      
    } 
  }
})