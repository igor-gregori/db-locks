const response = await fetch('http://localhost:3000/users')
const result = await response.json()
console.log("🚀 ~ file: consumer.js:5 ~ result:", result)
