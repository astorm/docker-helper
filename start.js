#!/usr/bin/env node
const open = require('open');

const fastify = require('fastify')({
  logger: false
})
const {
  getRunningContainers,
  renderTableForRunningContainers
} = require('./lib/docker')

const {
  view
} = require('./lib/template')

// Declare a route

fastify.get('/', function (request, reply) {
  reply.header('Content-Type', 'text/html').send(
    view({table:renderTableForRunningContainers(getRunningContainers())})
  )
})


fastify.listen(0, function (err, address) {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  console.log(`server listening on ${address}`)
  open(address)
})
