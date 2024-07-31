export default {
  meEndpoint: '/auth/me',
  loginEndpoint: 'login',
  registerEndpoint: '/register',
  storageTokenKeyName: 'access_token',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
