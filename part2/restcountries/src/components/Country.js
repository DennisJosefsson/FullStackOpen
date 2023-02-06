import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const apiKey = process.env.REACT_APP_API_KEY
  const capitalLocationString = `http://api.openweathermap.org/geo/1.0/direct?q=${country.capital},${country.countryCode}&appid=${apiKey}`
  useEffect(() => {
    axios.get(capitalLocationString).then((response) => {
      const location = response.data
      const latLon = { lat: location[0].lat, lon: location[0].lon }
      const latLonString = `https://api.openweathermap.org/data/2.5/weather?lat=${latLon.lat}&lon=${latLon.lon}&units=metric&appid=${apiKey}`
      axios
        .get(latLonString)
        .then((response) => {
          setWeather(response.data)
        })
        .catch((error) => {
          console.log('Error', error)
        })
    })
  }, [apiKey, capitalLocationString])

  if (!weather) {
    return
  }

  const languageList = Object.values(country.languages)
  const languages = languageList.map((language, index) => (
    <li key={index}>{language}</li>
  ))
  const weatherUrl = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  return (
    <div>
      <h1>{country.name}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area} km2</p>
      <p>Population: {country.population}</p>
      <b>Languages:</b>
      <ul>{languages}</ul>
      <img src={country.flagUrl} alt="Country flag" />
      <h3>
        Weather in {country.capital}, {country.name}
      </h3>
      <p>Temperature {weather.main.temp} celcius</p>
      <p>Wind {weather.wind.speed} m/s</p>
      <p>{weather.weather[0].description}</p>
      <img src={weatherUrl} alt="Weather Icon" />
    </div>
  )
}

export default Country
