import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }

const height = 400 - margin.top - margin.bottom

const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-3c')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const radius = 60
const radiusScale = d3.scaleLinear().range([radius / 2, radius])
const xPositionScale = d3.scalePoint().range([radius, width - radius])
const angleScale = d3.scaleBand().range([0, Math.PI * 2])
const colorScale = d3.scaleLinear().range(['lightblue', 'pink'])
const arc = d3
  .arc()
  .innerRadius(d => radiusScale(+d.low_temp))
  .outerRadius(d => radiusScale(+d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

d3.csv(require('/data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  const temps = datapoints.map(d => +d.high_temp)
  colorScale.domain(d3.extent(temps))
  radiusScale.domain(d3.extent(temps))

  const months = datapoints.map(d => d.month_name)
  angleScale.domain(months)

  const cities = datapoints.map(d => d.city)
  xPositionScale.domain(cities)

  const nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)

  svg
    .selectAll('.pie-chart')
    .data(nested)
    .enter()
    .append('g')
    .each(function(d) {
      // console.log(d)
      const container = d3.select(this)
      const datapoints = d.values
      container
        .selectAll('.polar-bar')
        .data(datapoints)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d) {
          return colorScale(+d.high_temp)
        })
        .attr('stroke', 'none')
        .attr('transform', function(d) {
          console.log()
          return `translate(${xPositionScale(d.city)},${height / 2})`
        })

      container
        .append('text')
        .text(d => d.key)
        .attr('x', d => xPositionScale(d.key))
        .attr('y', height - 50)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .style('font-size', 16)

      container
        .append('circle')
        .attr('cx', d => xPositionScale(d.key))
        .attr('cy', height / 2)
        .attr('r', 3)
        .attr('fill', 'white')

      container
        .append('circle')
        .attr('cx', d => xPositionScale(d.key))
        .attr('cy', height / 2)
        .attr('r', 3)
        .attr('fill', 'gray')
    })
}
