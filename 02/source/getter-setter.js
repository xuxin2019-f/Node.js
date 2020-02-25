const kaikeba = {
  info:{name:'kaikeba'},
  get name() {
    return this.info.name
  },
  set name(val){
    console.log('new name is' + val)
    this.info.name = val
  }
}
console.log(kaikeba.name)
kaikeba.name = 'kaikeba123'
console.log(kaikeba.name)
