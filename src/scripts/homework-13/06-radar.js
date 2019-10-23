import * as d3 from 'd3'

const margin = { top: 20, left: 0, right: 0, bottom: 0 }
const height = 400 - margin.top - margin.bottom
const width = 400 - margin.left - margin.right

const svg = d3
  .select('#chart-6')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)

const radius = 150
const radiusScale = d3.scaleLinear().range([0, radius])

const angleScale = d3.scaleBand().range([0, Math.PI * 2])

const line = d3
  .radialArea()
  .angle(d => angleScale(d.category))
  .innerRadius(0)
  .outerRadius(d => radiusScale(+d.score))

d3.csv(require('/data/ratings.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])
  // console.log(datapoints)

  const categories = datapoints.map(d => d.category)
  angleScale.domain(categories)

  const maxScore = d3.max(datapoints.map(d => +d.score))
  radiusScale.domain([0, maxScore])

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'lightpink')
    .attr('fill-opacity', 0.4)
    .attr('stroke', 'gray')
    .lower()

  svg
    .selectAll('.polar-line')
    .data(angleScale.domain())
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', -radius)
    .attr('stroke', 'gray')
    .attr('stroke-opacity', 0.7)
    .style('stroke-dasharray', (2, 4))
    .style('transform', function(d) {
      return `rotate(${angleScale(d)}rad)`
    })

  svg
    .selectAll('.outside-label')
    .data(angleScale.domain())
    .enter()
    .append('text')
    .text(d => d)
    .attr('y', -radius)
    .attr('dy', -10)
    .style('transform', function(d) {
      return `rotate(${angleScale(d)}rad)`
    })
    .style('font-size', 14)
    .style('font-weight', 600)
    .style('text-anchor', 'middle')

  const bands = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
  svg
    .selectAll('.band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', 'none')
    .attr('stroke', 'lightgray')
    .lower()
}
