const response = await fetch("http://localhost:8000");
const body = await response.text();

console.log(response);
console.log(body);
