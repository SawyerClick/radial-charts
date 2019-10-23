import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }

const height = 450 - margin.top - margin.bottom

const width = 1200 - margin.left - margin.right

const svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const radius = 90
const radiusScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([20, radius])

const angleScale = d3.scaleBand().range([0, Math.PI * 2])

const line = d3
  .radialArea()
  .angle(d => angleScale(d.month_name))
  .innerRadius(d => radiusScale(+d.low_temp))
  .outerRadius(d => radiusScale(+d.high_temp))

const xPositionScale = d3.scalePoint().range([radius, width - radius])

const months = [
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
  'Jan'
]

d3.csv(require('/data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // datapoints.push(datapoints[0])
  const nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)
  // console.log(nested)

  const cities = datapoints.map(d => d.city)
  xPositionScale.domain(cities)

  // const months = nested.map(d => d.month_name)
  angleScale.domain(months)

  svg
    .selectAll('.radial-charts')
    .data(nested)
    .enter()
    .append('g')
    .each(function(d) {
      const container = d3.select(this)
      const datapoints = d.values
      datapoints.push(datapoints[0])
      // console.log(datapoints)

      container
        .append('path')
        .datum(datapoints)
        .attr('d', d => line(d))
        .attr('fill', 'lightpink')
        .attr('fill-opacity', 0.7)
        .attr('stroke', 'none')
        .attr('transform', function() {
          // console.log(d.key)
          return `translate(${xPositionScale(d.key)},${height / 2})`
        })

      container
        .append('text')
        .text(d => d.key)
        .attr('x', d => xPositionScale(d.key))
        .attr('y', height / 2)
        .attr('alignment-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .style('font-size', 16)
        .style('font-weight', 600)
        .attr('fill', 'gray')

      const bands = [20, 40, 60, 80, 100]
      container
        .selectAll('.band')
        .data(bands)
        .enter()
        .append('circle')
        .attr('r', d => radiusScale(d))
        .attr('fill', 'none')
        .attr('stroke', 'lightgray')
        .attr('transform', function() {
          // console.log(d.key)
          return `translate(${xPositionScale(d.key)},${height / 2})`
        })
        .lower()

      const bandsText = [20, 60, 100]
      container
        .selectAll('.amount-chart')
        .data(bandsText)
        .enter()
        .append('text')
        .text(d => d + '°')
        .attr('y', d => -radiusScale(d))
        .attr('dy', -5)
        .attr('alignment-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('transform', function() {
          // console.log(d.key)
          return `translate(${xPositionScale(d.key)},${height / 2})`
        })
    })

  svg
    .append('text')
    .text('Average Monthly Temperatures')
    .attr('alignment-baseline', 'middle')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2)
    .attr('y', 0)
    .style('font-size', 32)
    .style('font-weight', 600)

  svg
    .append('text')
    .text('in cities around the world')
    .attr('alignment-baseline', 'middle')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2)
    .attr('y', 30)
    .style('font-size', 16)
}
