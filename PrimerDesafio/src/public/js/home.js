const socketClient = io()

// //enviar un evento al servidor
// socketClient.emit("mesaggeEvent", "Hola desde el cliente")

// //recibit evento dels servidor

// socketClient.on("eventoIndividual", (dataServer) =>{
//     console.log(`Datos recibidos del servidor: ${dataServer}`)
// })

// socketClient.on("eventoTodosMenosActual", (data) => {
//     console.log(`Datos pata todos ${data}`)
// })

// socketClient.on("eventoParaTodos", (data) => {
//     console.log(data)
// })