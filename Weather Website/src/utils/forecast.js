const request = require("postman-request")

const forecast = (lat, lon, callback) => {

    const url = "http://api.weatherstack.com/current?access_key=ADD_KEY&query="+lat+","+lon+"&units=m"

    request({url, json: true}, (error, {body}) => {
    
        if(error){
    
            callback("Unable to connect")
    
        } else if (body.error) {
    
            callback("Unable to find location")
    
        } else {
    
            var temp = body.current.temperature
            var feel = body.current.feelslike
            var weather = body.current.weather_descriptions[0]
            
            callback(undefined, {Temperature: temp, FeelsLike: feel, weather})

        }
    
    })


}


module.exports = forecast