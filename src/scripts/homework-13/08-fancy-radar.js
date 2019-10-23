import * as d3 from 'd3'
import { getCallsite } from '@jest/source-map'

const margin = { top: 20, left: 0, right: 0, bottom: 0 }
const height = 450 - margin.top - margin.bottom
const width = 400 - margin.left - margin.right

const svg = d3
  .select('#chart-8')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)

const cols = {
  MP: 60,
  PTS: 30,
  FG: 10,
  '3P': 5,
  FT: 10,
  TRB: 15,
  AST: 10,
  STL: 5,
  BLK: 5
}

const radius = 175

const angleScale = d3.scaleBand().range([0, Math.PI * 2])

const radiusScale = d3
  .scaleLinear()
  .domain([0, 1.05])
  .range([0, radius])

const line = d3
  .radialLine()
  .angle(d => angleScale(d.name))
  .radius(d => radiusScale(d.value))

d3.csv(require('/data/nba.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  // const playerOne = datapoints[0]
  // console.log(Object.keys(cols))
  angleScale.domain(Object.keys(cols))

  const avgDict = []
  function getData(data) {
    Object.values(data).forEach(function(x) {
      const player = x
      const playerDict = []
      Object.entries(player).forEach(function(attribute) {
        if (Object.keys(cols).includes(attribute[0])) {
          const attributeName = attribute[0]
          const attributeValue = +attribute[1]
          playerDict.push({
            name: attributeName,
            value: attributeValue / cols[attributeName]
          })
        }
      })
      avgDict.push(playerDict)
    })
  }
  getData(datapoints) // put your data here and you're good to go

  const lebron = avgDict[0]
  lebron.push(lebron[0])
  console.log(lebron) // trimming the data down to just the first player

  const bands = [0.2, 0.4, 0.6, 0.8, 1]
  svg
    .selectAll('.band-circle')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', (d, i) => {
      if (i % 2 === 0) {
        return '#e8e7e5'
      } else {
        return '#f6f6f6'
      }
    })
    .lower()

  svg
    .append('g')
    .attr('mask', 'url(#player-mask)')
    .selectAll('band-circle-colored')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', (d, i) => {
      if (i % 2 === 0) {
        return '#FFB81C'
      } else {
        return '#c94435'
      }
    })
    .attr('fill-opacity', 0.8)
    .lower()

  // console.log(angleScale.domain())
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
    .style('font-size', 18)
    .style('font-weight', 600)
    .style('text-anchor', 'middle')
    .style('fill', 'silver')

  svg
    .append('mask')
    .attr('id', 'player-mask')
    .append('path')
    .datum(lebron)
    .attr('d', line)
    .attr('fill', 'white')

  svg
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 5)

  // create an array of lists with the different band values
  const bandText = []
  Object.entries(cols).forEach(function(d) {
    for (let a = 1; a < 6; a++) {
      bandText.push({ name: d[0], value: (d[1] / 5) * a })
    }
  })

  // nest it by the column name
  const nested = d3
    .nest()
    .key(d => d.name)
    .entries(bandText)

  // runs through each column and print the values
  for (let x = 0; x < nested.length; x++) {
    const datapoints = nested[x].values

    // to check the column name
    // console.log(datapoints[0].name)
    svg
      .selectAll('.labels')
      .data(datapoints)
      .enter()
      .append('text')
      .text(d => d.value)
      .attr('y', function(d) {
        return -radiusScale(d.value / datapoints[4].value)
      })
      .attr('alignment-baseline', 'middle')
      .attr('text-anchor', 'middle')
      .style('font-size', 14)
      .style('font-weight', 400)
      .style('transform', function(d) {
        return `rotate(${angleScale(d.name)}rad)`
      })
  }
}
