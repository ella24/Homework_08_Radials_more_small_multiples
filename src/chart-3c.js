import * as d3 from 'd3'

let margin = { top: 30, left: 30, right: 30, bottom: 30 }

let height = 400 - margin.top - margin.bottom

let width = 1080 - margin.left - margin.right

let svg = d3
  .select('#chart-3c')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
  'Blah'
]

let pie = d3
  .pie()
  .value(1 / 12)
  .sort(null)

let radiusScale = d3.scaleLinear().range([0, 90])

let arc = d3
  .arc()
  .innerRadius(d => radiusScale(d.data.low_temp))
  .outerRadius(d => radiusScale(d.data.high_temp))

let colorScale = d3
  // different type of scale
  .scaleQuantize()
  .range(['#e5f5e0', '#a1d99b', '#31a354'])

let xPositionScale = d3.scaleBand().range([0, width])

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  let nested = d3
    .nest()
    .key(function(d) {
      return d.city
    })
    .entries(datapoints)

  // console.log(nested)

  let keys = nested.map(d => d.key)
  xPositionScale.domain(keys)

  let allTemp = datapoints.map(d => +d.high_temp)
  colorScale.domain(d3.extent(allTemp))
  radiusScale.domain([0, d3.max(allTemp)])

  svg
    .selectAll('.chart-3c-graph')
    .data(nested)
    .enter()
    .each(function(d) {
      // distribute it across the x axis.
      let graphX = xPositionScale(d.key) + 90

      let container = d3
        .select(this)
        .append('g')
        .attr('transform', `translate(${graphX},${height / 2})`)

      container
        .selectAll('.chart-3c-path')
        .data(pie(d.values))
        .enter()
        .append('path')
        .attr('class', 'chart-3c-path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.high_temp))

      container
        .append('text')
        .text(d.key)
        .attr('text-anchor', 'middle')
        .attr('font-size', 20)
        .attr('dy', 120)
        .attr('font-weight', 'bold')

      container
        .append('circle')
        .attr('r', 2.5)
        .attr('x', 0)
        .attr('y', 0)
    })
}
