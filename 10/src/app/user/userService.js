class UserService {
  login(username, password) {
    console.log('enter')
    console.log('form information', username, password)
    return true
  }
}
module.exports = new UserService()
