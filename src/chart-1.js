import * as d3 from 'd3'

let margin = { top: 30, left: 30, right: 30, bottom: 30 }
let height = 400 - margin.top - margin.bottom
let width = 780 - margin.left - margin.right

// At the very least you'll need scales, and
// you'll need to read in the file. And you'll need
// and svg, too, probably.

let svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let pie = d3.pie().value(function(d) {
  return d.minutes
})

let radius = 110

let arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

let colorScale = d3.scaleOrdinal().range(['#fde0dd', '#fa9fb5', '#c51b8a'])

let arcLabel = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius + 10)

d3.csv(require('./data/time-breakdown.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  let container = svg.append('g').attr('transform', 'translate(200,200')

  container
    .selectAll('path')
    .data(pie(datapoints))
    .enter()
    .append('path')
    .attr('d', d => arc(d))
    .attr('fill', d => colorScale(d.data.task))

  container
    .selectAll('.pie-text')
    .data(pie(datapoints))
    .enter()
    .append('text')
    .text(d => d.data.task)
    .attr('x', d => {
      return arcLabel.centroid(d)[0]
    })
    .attr('x', d => {
      return arcLabel.centroid(d)[1]
    })
    .attr('transform', function(d) {
      return 'translate(' + arcLabel.centroid(d) + ')'
    })
    .attr('text-anchor', function(d) {
      if (d.startAngle > Math.PI) {
        return 'end'
      } else {
        return 'start'
      }
    })
}
