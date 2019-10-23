import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)

const radius = 150
const radiusScale = d3.scaleLinear().range([radius / 2, radius])

const angleScale = d3.scaleBand().range([0, Math.PI * 2])

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(d => radiusScale(+d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

const colorScale = d3.scaleLinear().range(['lightblue', 'pink'])

d3.csv(require('/data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // console.log(datapoints)
  const temps = datapoints.map(d => +d.high_temp)
  colorScale.domain(d3.extent(temps))
  radiusScale.domain(d3.extent(temps))

  const months = datapoints.map(d => d.month_name)
  angleScale.domain(months)

  svg
    .selectAll('.polar-bar')
    .data(datapoints)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d) {
      return colorScale(+d.high_temp)
    })
    .attr('stroke', 'none')

  svg
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 3)
    .attr('fill', 'white')

  svg
    .append('text')
    .text(`NYC high temperatures, by month`)
    .attr('x', 0)
    .attr('y', -120)
    .style('font-size', 22)
    .style('font-weight', 600)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
}
