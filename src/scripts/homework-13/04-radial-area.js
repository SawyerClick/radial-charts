import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)

const radius = 200
const radiusScale = d3
  .scaleLinear()
  .domain([0, 90])
  .range([30, radius])

const angleScale = d3.scaleBand().range([0, Math.PI * 2])

const line = d3
  .radialArea()
  .angle(d => angleScale(d.month_name))
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))

d3.csv(require('/data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])
  // console.log(datapoints)

  const months = datapoints.map(d => d.month_name)
  angleScale.domain(months)
  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'lightpink')
    .attr('fill-opacity', 0.7)
    .attr('stroke', 'none')
    .lower()

  const bands = [20, 30, 40, 50, 60, 70, 80, 90]
  svg
    .selectAll('.band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', 'none')
    .attr('stroke', 'lightgray')
    .lower()

  const bandsText = [30, 50, 70, 90]
  svg
    .selectAll('.amount-chart')
    .data(bandsText)
    .enter()
    .append('text')
    .text(d => d + '°')
    .attr('y', d => -radiusScale(d))
    .attr('dy', -8)
    .attr('alignment-baseline', 'middle')
    .attr('text-anchor', 'middle')
  svg
    .append('text')
    .text('NYC')
    .attr('x', 0)
    .attr('y', 0)
    .attr('alignment-baseline', 'middle')
    .attr('text-anchor', 'middle')
    .style('font-size', 32)
    .style('font-weight', 700)
    .attr('fill', 'gray')
}
