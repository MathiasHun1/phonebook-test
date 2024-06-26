const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('content', function getContent (req) {
  return JSON.stringify(req.body) 
})

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny'))
app.use(morgan(':content'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]


app.get('/', (req, res)=> {
  res.send('<h2>Phonebook database</h2>')
})

app.get('/api/persons', (req, res) => {
  res.send(persons)
})

app.get('/api/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`)  
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if(person) {
    res.send(person)
  } else {
    res.statusMessage = 'No such person in the phonebook'
    res.status(400).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

const genId = () => Math.floor(Math.random() * 10000)

app.post('/api/persons', (req, res) => {
  const body = req.body

  if(!body.name) {
    res.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) {
    res.status(400).json({
      error: 'number missing'
    })
  } else if (persons.find(p => p.name === body.name)) {
    res.status(400).json({
      error: 'name must be unique'
    })
  } else {
    const person = {
      name: body.name,
      number: body.number,
      id: genId()
    }

    persons = persons.concat(person)
    res.json(person)
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})