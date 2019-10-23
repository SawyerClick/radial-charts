import * as d3 from 'd3'

const margin = { top: 20, left: 0, right: 0, bottom: 0 }

const height = 330 - margin.top - margin.bottom
const width = 275 - margin.left - margin.right

d3.csv(require('/data/nba.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  
}
