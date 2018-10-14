import * as d3 from 'd3'

let margin = { top: 30, left: 30, right: 30, bottom: 30 }
let height = 400 - margin.top - margin.bottom
let width = 780 - margin.left - margin.right

let svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 200

let radiusScale = d3
  .scaleLinear()
  .domain([0, 90])
  .range([0, radius])

let pie = d3
  .pie()
  .value(1 / 12)
  .sort(null)

let colorScale = d3
  .scaleLinear()
  .domain([0, 90])
  .range(['#a6bddb', '#de2d26'])

let arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(d => radiusScale(d.data.high_temp))

d3.csv(require('./data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  let container = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  container
    .selectAll('.chart')
    .data(pie(datapoints))
    .enter()
    .append('path')
    .attr('class', 'chart')
    .attr('d', d => arc(d))
    .attr('fill', d => colorScale(d.data.high_temp))

  container
    .append('circle')
    .attr('r', 3)
    .attr('cx', 0)
    .attr('cy', 0)

  container
    .append('text')
    .text('NYC high temperatures, by month')
    .attr('text-anchor', 'middle')
    .attr('font-size', 30)
    .attr('y', -170)
    .attr('font-weight', 'bold')
}
