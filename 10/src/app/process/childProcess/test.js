;[1, 2, 3, 4, 5].forEach((element) => {
  console.log(element)
})
process.on('message', (message) => {
  console.log(message)
  process.send('welcome')
})
