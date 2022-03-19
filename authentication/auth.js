import auth0 from 'auth0-js';
import Vue from 'vue';

let URL;
if (location.href.indexOf('localhost:3000') > -1) {
  URL = 'http://localhost:3000';
} else {
  URL = 'https://teatimesuplementos.com';
}

const domain = process.env.AUTH0_DOMAIN_URL;
const audience = process.env.AUTH0_AUDIENCE_URL;
const clientID = process.env.AUTH0_CLIENT_ID;
const realm = process.env.AUTH0_REALM;

// exchange the object with your own from the setup step above.
const webAuth = new auth0.WebAuth({
  domain,
  clientID,
  // make sure this line is contains the port: 8080
  redirectUri: `${URL}/callback`,
  // we will use the api/v2/ to access the user information as payload
  audience,
  responseType: 'token id_token',
  scope: 'openid profile', // define the scopes you want to use
});

const auth = new Vue({
  computed: {
    token: {
      get() {
        return localStorage.getItem('id_token');
      },
      set(id_token) {
        localStorage.setItem('id_token', id_token);
      },
    },
    accessToken: {
      get() {
        return localStorage.getItem('access_token');
      },
      set(accessToken) {
        localStorage.setItem('access_token', accessToken);
      },
    },
    expiresAt: {
      get() {
        return localStorage.getItem('expires_at');
      },
      set(expiresIn) {
        const expiresAt = JSON.stringify(expiresIn * 1000 + new Date().getTime());
        localStorage.setItem('expires_at', expiresAt);
      },
    },
    vuexExpiresAt: {
      get() {
        return sessionStorage.getItem('vuex_expires_at');
      },
      set(expiresIn) {
        const expiresAt = JSON.stringify(expiresIn * 1000 + new Date().getTime());
        sessionStorage.setItem('vuex_expires_at', expiresAt);
      },
    },
    user: {
      get() {
        return JSON.parse(localStorage.getItem('user'));
      },
      set(user) {
        localStorage.setItem('user', JSON.stringify(user));
      },
    },
  },
  methods: {
    newLogin(username, password, cb) {
      webAuth.client.login(
        {
          realm,
          username,
          password,
          audience,
          scope: 'openid profile',
        }, (err, result) => {
          cb(err, result);
          if (err) return;
          this.handleAuthentication(err, result);
        },
      );
    },

    forgotPassword(user, cb) {
      return webAuth.changePassword({
        connection: realm,
        email: user
      }, cb);
    },

    signUp(user, password, cb) {
      webAuth.signup({
        connection: realm,
        email: user,
        'password': password
      }, cb);
    },

    callback() {
      webAuth.popup.callback();
    },
    logout() {
      return new Promise(async (resolve, reject) => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('user');
        sessionStorage.removeItem('vuex_expires_at')

        webAuth.logout({
          returnTo: URL,
          client_id: clientID,
        });
      });
    },
    isAuthenticated() {
      return new Date().getTime() < this.expiresAt;
    },
    handleAuthentication(err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.expiresAt = authResult.expiresIn;
        this.vuexExpiresAt = 24 * 60;
        this.accessToken = authResult.accessToken;
        this.token = authResult.idToken;
        webAuth.client.userInfo(
          authResult.accessToken,
          (err, user) => {
            this.user = user;
            location.href = location.href.replace(/login.*/, 'home');
          },
        );
      } else if (err) {
        this.logout();
      }
    },
  },
});

export default {
  install(Vue) {
    Vue.prototype.$auth = auth;
  },
};
