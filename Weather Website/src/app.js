//Requires
const path = require("path")
const express = require("express")
const hbs = require("hbs")
const geocode = require("./utils/geocode.js")
const forecast = require("./utils/forecast.js")

//-------------------------------------------------

//Directories
const publicDirectory = path.join(__dirname, "../public")
const viewsDirectory = path.join(__dirname, "../templates/views")
const partialsDirectory = path.join(__dirname, "../templates/partials")

//Start Express
const app = express()
const port = process.env.PORT || 3000

//Setup hbs
app.set("view engine","hbs")
app.set("views", viewsDirectory)
hbs.registerPartials(partialsDirectory)

//Setup standard directory
app.use(express.static(publicDirectory))




//index
app.get("", (req, res)=>{

res.render("index",{

    title:"weather app"
    
})

})


//about
app.get("/about", (req, res)=>{

    res.render("about",{
    
        title:"about"

})
    
})


//help
app.get("/help", (req, res)=>{

    res.render("help",{
    
        title: "help"

    })
    
    })


//weather    
app.get("/weather", (req, res) => {

    if(!req.query.address){

        res.send({
        error:'You must provide Address!'
        })

    }else{


        const address = req.query.address
       
        //geocode
        geocode(address, (error, {latitude, longitude, location} = {}) => {
    
            if(error){
            return  res.send({error: error})
            }
            
            
                forecast(latitude, longitude, (error, data2) => {
            
                if(error){
                res.send({error: error})
                }
                
                res.send({
                location: location,
                forecast: data2
                })
                    
                
            })
        
        })

   
        
       

    }
    

})

//products  
app.get("/products", (req, res) => {

    if(!req.query.search){

        res.send({
        error:'You must provide Search term'
        })

    }else{

        res.send({
        products: []
        })

    }

        
})



//Help articles
app.get("/help/*", (req,res) => {

    res.render("404",{

        message:"No help article found"
        
    })

})



//404
app.get("*", (req,res) => {

    res.render("404",{

        message:"Page not found"
        
    })

})




//Start Server
app.listen(port, () =>{

console.log("Server is UP")

})