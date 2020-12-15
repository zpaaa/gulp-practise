console.log('index')
console.log('index')
console.log('index')
console.log('index222')
const a = 1
const b = () => {
  console.log(a)
}
const c = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('FUCK')
    }, 100)
  })
}
c().then(res => {
  console.log(res)
})
class Test {
  constructor() {
    console.log('HHH')
  }
}
const TestInstance = new Test()