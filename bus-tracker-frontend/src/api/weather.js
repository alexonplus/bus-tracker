const WMO_CODES = {
  0: { label: 'Klart', icon: '☀️' },
  1: { label: 'Mestadels klart', icon: '🌤️' },
  2: { label: 'Delvis mulet', icon: '⛅' },
  3: { label: 'Mulet', icon: '☁️' },
  45: { label: 'Dimma', icon: '🌫️' },
  48: { label: 'Rimfrost', icon: '🌫️' },
  51: { label: 'Duggregn', icon: '🌦️' },
  61: { label: 'Regn', icon: '🌧️' },
  63: { label: 'Kraftigt regn', icon: '🌧️' },
  71: { label: 'Snö', icon: '❄️' },
  80: { label: 'Regnskurar', icon: '🌦️' },
  95: { label: 'Åska', icon: '⛈️' },
}

export async function getWeather() {
  const res = await fetch(
    'https://api.open-meteo.com/v1/forecast?latitude=57.7089&longitude=11.9746&current=temperature_2m,weathercode,windspeed_10m&wind_speed_unit=ms&timezone=Europe%2FStockholm'
  )
  const data = await res.json()
  const code = data.current.weathercode
  return {
    temp: Math.round(data.current.temperature_2m),
    wind: Math.round(data.current.windspeed_10m),
    ...( WMO_CODES[code] || { label: 'Okänt', icon: '🌡️' })
  }
}
