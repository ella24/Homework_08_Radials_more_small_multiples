import * as d3 from 'd3'

let margin = { top: 30, left: 30, right: 30, bottom: 30 }
let height = 400 - margin.top - margin.bottom
let width = 780 - margin.left - margin.right

let svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let pie = d3
  .pie()
  .value(function(d) {
    return d.minutes
  })
  .sort(null)

let radius = 70

let arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

let colorScale = d3.scaleOrdinal().range(['#fde0dd', '#fa9fb5', '#c51b8a'])

let xPositionScale = d3.scaleBand().range([0, width])

d3.csv(require('./data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  let nested = d3
    .nest()
    .key(function(d) {
      return d.project
    })
    .entries(datapoints)

  let keys = nested.map(d => d.key)
  xPositionScale.domain(keys)

  svg
    .selectAll('.pie-graph')
    .data(nested)
    .enter()
    .each(function(d) {
      let graphX = xPositionScale(d.key) + 90

      let container = d3
        .select(this)
        .append('g')
        .attr('transform', `translate(${graphX},${height / 2})`)

      container
        .selectAll('path')
        .data(pie(d.values))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))

      container
        .datum(d)
        .append('text')
        .text(d.key)
        .attr('y', 90)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('font-weight', 'bold')
    })
}
