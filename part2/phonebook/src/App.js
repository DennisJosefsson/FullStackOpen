import { useState, useEffect } from 'react'
import './style.css'
import personService from './services/phonebook'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return <div className={`${message.status}`}>{message.message}</div>
}

const Filter = (props) => (
  <div>
    Filter shown with
    <input onChange={props.handleFilterChange} value={props.filterValue} />
  </div>
)

const PersonForm = (props) => (
  <div>
    <form onSubmit={props.handleSubmit}>
      <div>
        name:
        <input onChange={props.handleNameChange} value={props.nameValue} />
        number:
        <input onChange={props.handleNumberChange} value={props.numberValue} />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </div>
)

const Persons = ({ people }) => <div>{people}</div>

const Person = ({ person, handleDelete }) => {
  return (
    <p>
      {person.name} {person.number}
      <button onClick={handleDelete}>Delete number</button>
    </p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setNewFilter(event.target.value)
  }

  const submitName = (event) => {
    event.preventDefault()
    const personObject = { name: newName, number: newNumber }

    if (persons.some((person) => person.name === newName)) {
      const foundPerson = persons.find((person) => person.name === newName)
      const id = foundPerson.id
      const changedNumber = { ...foundPerson, number: newNumber }
      if (
        window.confirm(
          `${newName} is already in the phonebook, do you want to change the number?`
        )
      ) {
        personService
          .update(id, changedNumber)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== id ? person : returnedPerson
              )
            )
            setMessage({
              message: `The number of ${returnedPerson.name} was changed`,
              status: 'success',
            })
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch((error) => {
            setMessage({
              message: `${foundPerson.name} is already deleted`,
              status: 'error',
            })
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
      } else {
        setNewName('')
        setNewNumber('')
      }
    } else {
      personService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setMessage({
          message: `${returnedPerson.name} was added`,
          status: 'success',
        })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
    }
  }

  const deletePost = (id) => {
    if (window.confirm('Do you really want to delete the post?')) {
      personService.remove(id).then(() => {
        setMessage({ message: `Post deleted`, status: 'success' })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setPersons(persons.filter((person) => person.id !== id))
      })
    }
  }

  const people = persons
    .filter((person) => {
      return person.name.toLowerCase().includes(newFilter.toLowerCase())
    })
    .map((person) => (
      <Person
        key={person.id}
        person={person}
        handleDelete={() => deletePost(person.id)}
      />
    ))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter handleFilterChange={handleFilter} filterValue={newFilter} />
      <h2>Add new</h2>
      <PersonForm
        handleSubmit={submitName}
        handleNameChange={handleNewName}
        nameValue={newName}
        handleNumberChange={handleNewNumber}
        numberValue={newNumber}
      />

      <h2>Numbers</h2>
      <Persons people={people} />
    </div>
  )
}

export default App
