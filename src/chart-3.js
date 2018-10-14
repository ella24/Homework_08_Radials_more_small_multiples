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

let pie = d3
  .pie()
  .value(1 / 12)
  .sort(null)

let radiusScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([0, 200])

let arc = d3
  .arc()
  .innerRadius()
  .outerRadius(d => radiusScale(d.data.high_temp))

let colorScale = d3
  // different type of scale
  .scaleQuantize()
  .range(['#c51b8a', '#e5f5e0', '#a1d99b', '#31a354', '#feb24c', '#f03b20'])

let arcLabel = d3
  .arc()
  .innerRadius(0)
  .outerRadius(d => radiusScale(d.data.high_temp) + 20)

d3.csv(require('./data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  let container = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  let temps = datapoints.map(d => +d.high_temp)
  colorScale.domain(d3.extent(temps))

  container
    .selectAll('.chart-3-path')
    .data(pie(datapoints))
    .enter()
    .append('path')
    .attr('class', 'chart-3-path')
    .attr('d', d => arc(d))
    .attr('fill', d => colorScale(d.data.high_temp))

  container
    .append('text')
    .text('NYC high temperatures, by month')
    .attr('text-anchor', 'middle')
    .attr('font-size', 20)
    .attr('dy', -150)
    .attr('font-weight', 400)

  container
    .selectAll('.pie-text')
    .data(pie(datapoints))
    .enter()
    .append('text')
    .text(d => d.data.month_name)
    .attr('x', d => {
      return arcLabel.centroid(d)[0]
    })
    .attr('y', d => {
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

  container
    .append('circle')
    .attr('r', 2.5)
    .attr('x', 0)
    .attr('y', 0)
}
