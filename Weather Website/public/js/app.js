const form = document.querySelector("form")
const search = document.querySelector("input")
const one = document.querySelector("#one")
const two = document.querySelector("#two")

form.addEventListener("submit", (event)=>{

    event.preventDefault()
    
    const location = search.value

    one.textContent = "Loading..."
    two.textContent = ""

    fetch("/weather?address=" + location).then((response)=>{

        response.json().then((data)=>{
    
            if(!data.error){

                one.textContent = "Location: " + data.location 
                two.textContent =   "Feels Like: " + data.forecast.FeelsLike + " Temperature: " + data.forecast.Temperature + " " + data.forecast.weather + "."

            }else{

                one.textContent = data.error
                two.textContent = ""
    
                console.log("Impossible to find location")
    
            }
    
        })
    
    })
    

})

