//working on links and legend
document.addEventListener('DOMContentLoaded',function(){
console.clear()
const urls = [
  {
    title: 'Video Game Sales',
    url: 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json',
    description: 'Top 100 Sold Copies(in Millions) by Platform'
  },{
    title: 'Movie Sales',
    url: 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json',
    description: 'Top 100 Grossed(in Millions) in the Us/Canada by Genre'
  },{
    title: 'Kickstarter Pledges',
    url: 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json',
    description: 'Top 100 Most Pledged(in Millions) Campaigns by Category'
  }
]

  req1 = new XMLHttpRequest()
  req1.open('GET', urls[0].url, true)
  req1.send()
  req1.onload = function() {
    const games = JSON.parse(req1.responseText)
    req2 = new XMLHttpRequest()
    req2.open('GET', urls[1].url, true)
    req2.send()
    req2.onload = function() {
      const videos = JSON.parse(req2.responseText)
      req3 = new XMLHttpRequest()
      req3.open('GET', urls[2].url, true)
      req3.send()
      req3.onload = function() {
        const kicks = JSON.parse(req3.responseText)        
        
const m = {top: 20, right: 50, bottom: 20, left: 20};
const h = 500 - m.top - m.bottom;
const w = 950 - m.right - m.left;            
        
var treemapLayout = d3.treemap()
    .size([w +m.left+m.right, h +m.top+m.bottom])
    .paddingOuter(0);
        
var root = games;
        
function changeMe(e){
  console.log(1)
  root = e
}        
        
var rootNode = d3.hierarchy(root)

rootNode.sum(function(d) {
  return d.value;
});

treemapLayout(rootNode);
        
const body = d3.select('body')
      .style('text-align', 'center')
      .style('width','80%')
      .style('margin','10px auto')

const title = body.append('h1')
      .text(function() {
        if (root === videos) {
          return urls[1].title
        } else if (root === kicks) {
          return urls[2].title
        } else {
          return urls[0].title
        }
      })
      .attr('id','title')
      .style('margin-bottom',0)
      .style('font-family',"'Play', sans-serif")

const subtitle = body.append('h4')
      .text(function() {
        if (root === videos) {
          return urls[1].description
        } else if (root === kicks) {
          return urls[2].description
        } else {
          return urls[0].description
        }
      })
      .attr('id','description')
      .style('margin-top',0)
      .style('font-family',"'Play', sans-serif")

const linkDiv = body.append('div')
      .style('display','flex')
      .style('height','30px')


//some DRY to cleanup
const link1 = linkDiv.append('div')
      .style('width', '33%')
      .append('text')
      .html('<a href="?data=0">')
      .style('color','blue')
      .text('Video Games')
      .on('mouseover', ()=> link1.style('color','black').style('cursor','pointer'))
      .on('mouseout', ()=> link1.style('color','blue'))
      .on('click', function() {
        changeMe(games)
      })

const link2 = linkDiv.append('div')
      .style('width', '33%')
      .append('text')
      .style('color','blue')
      .text('Movies')
      .on('mouseover', ()=> link2.style('color','black').style('cursor','pointer'))
      .on('mouseout', ()=> link2.style('color','blue'))
      .on('click', function() {
        changeMe(videos)
      })

const link3 = linkDiv.append('div')
      .style('width', '33%')
      .append('text')
      .style('color','blue')
      .text('Kickstarters')
      .on('mouseover', ()=> link3.style('color','black').style('cursor','pointer'))
      .on('mouseout', ()=> link3.style('color','blue'))
      .on('click', function() {
        changeMe(kicks)
      })


const tooltip = body.append('div')
      .attr('id','tooltip')
      .style('opacity', 0)
      .style('height','auto')
      .style('width','200px')
      .style('position','absolute')
      .style('justify-content','center')
      .style('background','lightsteelblue')
      .style('font-size','15px')
      .style('padding','5px')
      .style('border-radius','3px')
      .style('pointer-events','none')
      .style('font-family','arial')

const container = body.append('div')
      .style('display', 'inline')
      .append('div')

const svg = container.append('svg')
      .attr('viewBox', '0 0 ' + (w + m.left + m.right) + ' ' + (h + m.top + m.bottom))
      .attr('preserveAspectRatio', 'xMidYMid meet')

const g = svg.append('g')
       
   //array function     
   var arrayNames = [];        
   for (let i=0; i<rootNode.children.length; i++) {
     arrayNames.push(rootNode.children[i].data.name)
   }
         
const colors = d3.scaleSequential()
      .domain([0,rootNode.children.length])
      .interpolator(d3.interpolateRainbow)
        
var tiles = d3.select('svg g')
      .selectAll('g')
      .data(rootNode.leaves())
      .enter()
      .append('g')
      .attr('transform', function(d) {return 'translate(' + [d.x0, d.y0] + ')'})

tiles.append('rect')
      .attr('class','tile')
      .attr('data-name', d=> d.data.name)
      .attr('data-category', d=> d.data.category)
      .attr('data-value', d=> d.data.value)
      .style('stroke','white')
      .style('fill', d => colors(arrayNames.indexOf(d.data.category)))
      .attr('width', function(d) { return d.x1 - d.x0; })
      .attr('height', function(d) { return d.y1 - d.y0; })
      .on('mousemove', function(d) {
        const browserWidth = document.querySelector( 'html' ).clientWidth;
        const browserHeight = document.querySelector( 'html' ).clientHeight;
        tooltip.html('Name: ' + d.data.name + '<br>' +
                     'Category: ' + d.data.category + '<br>' +
                     'Value: ' + d.data.value)
              .style('opacity',.9)
              .style('left', d3.event.pageX < browserWidth/2 ? d3.event.pageX + 20 + 'px': d3.event.pageX - 220 + 'px' )
              .style('top', d3.event.pageY > browserHeight-70 ? d3.event.pageY - 50 + 'px': d3.event.pageY + 'px' )
              .attr('data-value', d.data.value)
      })
      .on('mouseout', function(d) {
        tooltip.style('opacity',0)
      })

tiles.append('text')
      .selectAll('tspan')
      .data(d=> d.data.name.split(' '))
      .enter().append('tspan')
      .attr('x', 4)
      .attr('dy', 14)
      .style('font-family',"'Play', sans-serif")
      .text(function(d) {
        return d;
      })
        
var numbered = []       
for (let i=0; i<arrayNames.length; i++) {
  numbered.push(i)
} 

const legend = body.append('g')
      .selectAll('g')
      //.attr("transform", "translate(0,0)")
      .data(numbered)
      .enter()
      .append('g')
      .attr('id','legend')
      .style('background', 'black')
      .style('padding','3px')
      //.attr('transform', (d,i)=> {
        //return 'translate(' + (w/3 + 20*i) + ',0)'})
    
legend.append('rect')
      //.attr('height','20px')
      //.attr('width','20px')
      .attr('class','legend-item')
      //.style('fill', 'red')//d=> colors(d))
        
legend.append('text')
      .data(arrayNames)
      .style('font-size', '12px')
      .attr('x', 20)
      .attr('y', 0)
      .attr("dx", "1em")
      .text(d => d + ' ')
      .data(numbered)
      .style('color', d=> colors(d))
      }
    }    
  } 
})