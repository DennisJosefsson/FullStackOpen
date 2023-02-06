import Country from './Country'

const CountryList = ({ countries, handleShow }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (countries.length === 1) {
    return <Country country={countries[0]} />
  } else if (countries.length > 1) {
    const countryList = countries.map((country, index) => (
      <p key={index}>
        {country.name}
        <button onClick={() => handleShow([country])}>Show</button>
      </p>
    ))
    return <div>{countryList}</div>
  }
}

export default CountryList
