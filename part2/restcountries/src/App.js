import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryList from './components/CountryList'

const Filter = (props) => (
  <div>
    Filter country
    <input onChange={props.handleFilter} value={props.filterValue} />
  </div>
)

const App = () => {
  const [countries, setCountries] = useState([])
  const [filterList, setFilterList] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        const data = response.data
        const filteredData = data.map((country) => {
          return {
            name: country.name.common,
            capital: country.capital,
            languages: country.languages,
            area: country.area,
            population: country.population,
            flagUrl: country.flags.png,
            countryCode: country.cca2,
          }
        })

        setCountries(filteredData)
      })
      .catch((error) => {
        console.log('Something went wrong', error)
      })
  }, [])

  useEffect(() => {
    const filterArray = countries.filter((country) =>
      country.name.toLowerCase().includes(filter.toLowerCase())
    )
    setFilterList(filterArray)
  }, [filter, countries])

  if (!countries) {
    return
  }

  const handleChange = (event) => {
    setFilter(event.target.value)
  }

  const handleShow = (country) => {
    setFilterList(country)
  }

  return (
    <div>
      <Filter handleFilter={handleChange} filterValue={filter} />
      <CountryList countries={filterList} handleShow={handleShow} />
    </div>
  )
}

export default App
