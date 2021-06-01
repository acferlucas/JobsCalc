const express = require('express')
const cors = require('cors')

const app = express()

const jobs = []
let contador = 0

app.use(cors())
app.use(express.json())

app.post('/jobs', (request, response) => {
  const { name, value, dedicated_time, total_time } = request.body

  const job = { 
    id: contador,
    name,  
    value, 
    dedicated_time,
    total_time,
    created_at: new Date()
  }

  jobs.push(job)

  contador++

  return response.json(job)
})

app.get('/jobs', (request, response) => response.json(jobs))

app.put('/job/:id', (request, response) => {
  const { id } = request.params
  const { name, value, dedicated_time, total_time } = request.body

  const jobIndex = jobs.findIndex(job => job.id === Number(id))

  if (jobIndex < 0) {
    return response.status(400).json({
      status: 'error',
      message: 'Job not found'
    })
  }

  jobs[jobIndex] = { 
    id: Number(id),
    name, 
    deadline, 
    value,
    dedicated_time, 
    total_time
  }

  return response.json({ 
    id: Number(id),
    name, 
    deadline, 
    value,
    dedicated_time, 
    total_time
  })
})

app.delete('/job/:id', (request, response) => {
  const { id } = request.params

  const jobIndex = jobs.findIndex(job => job.id === Number(id))

  if (jobIndex < 0) {
    return response.status(400).json({
      status: 'error',
      message: 'Job not found'
    })
  }

  jobs.splice(jobIndex, 1)

  return response.status(204).send()
})

app.listen(3333, () => console.log('Server started on port 3333'))