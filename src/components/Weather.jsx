import React, { useEffect, useRef, useState } from 'react'
import { Container, Card, Button, Form } from 'react-bootstrap';
import './Weather.css'

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null); //data for weather
    const [background, setBackground] = useState("");  //for background images
    const inputRef = useRef();  //getting input value simply
    const apiKey = import.meta.env.VITE_API_KEY;
    const search = async (city) => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.cod !== 200) {                 //when wrong city is typed
                alert("City not found!");
                return;
            }
            const weatherCondition = data.weather[0].main;   //weather condition

            setWeatherData({
                temp: data.main.temp,
                feels_like: data.main.feels_like,
                humidity: data.main.humidity,
                location: data.name,
                country: data.sys.country,
                gust: data.wind.gust,
                condition: data.weather[0].main
            })

            // background image is set according to the weather condition
            if (weatherCondition === "Clear") {
                setBackground("clear");
            } else if (weatherCondition === "Clouds") {
                setBackground("clouds");
            } else if (weatherCondition === "Rain") {
                setBackground("rain");
            } else if (weatherCondition === "Snow") {
                setBackground("snow");
            } else if (weatherCondition === "Haze") {
                setBackground("haze");
            } else if (weatherCondition === "Mist") {
                setBackground("mist");
            } else {
                setBackground("default");
            }


        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    useEffect(() => {         // initially the page is set on London when opened
        search("London");
    }, []);
    return (
        <div>
            <Container fluid className={`myCon ${background}`}>
                <h1 className="my-4 text-white">How's The Weather</h1>
                <Form className="d-flex" onSubmit={(e) => {
                    e.preventDefault();
                    search(inputRef.current.value);
                    inputRef.current.value = ""
                }}>
                    <Form.Control className='input'
                        type="text"
                        placeholder='Enter City Name'
                        ref={inputRef} />
                    <Button type='submit' variant='info' className="ms-2" >Search</Button>
                </Form>

                {weatherData && (
                    <Card className={`myCard ${weatherData.condition.toLowerCase()}`}>
                        <Card.Body>
                            <Card.Title>
                                <h3>{weatherData.location}, {weatherData.country}</h3>
                            </Card.Title>
                            <Card.Text style={{ fontSize: '3rem', fontWeight: 'bold' }}>
                                {weatherData.temp}°C
                            </Card.Text>
                            <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                {weatherData.condition}
                            </Card.Text>
                            <Card.Text className='textColor'>
                                Feels Like: {weatherData.feels_like}
                            </Card.Text>
                            <Card.Text className='textColor'>
                                Humidity: {weatherData.humidity}%
                            </Card.Text>
                            <Card.Text className='textColor'>
                                Wind Gust: {weatherData.gust || 'N/A'}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                )}
            </Container>
        </div >
    )
}

export default Weather
