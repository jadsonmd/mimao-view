<template>
  <div>
    <v-row class="justify-center inputToHeader">
      <v-col cols="12" md="4" sm="12">
        <v-form v-model="valid" @submit="login">
          <v-text-field
            color="#099AB1"
            v-model="user"
            name="user"
            ref="user"
            label="Usuário"
            required
            @click:clear="limparForm"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            color="#099AB1"
            v-model="password"
            name="password"
            ref="password"
            label="Senha"
            required
            :type="show ? 'text' : 'password'"
            :rules="[rules.required, rules.min]"
          ></v-text-field>

          <v-row justify="center">
            <v-col cols="12" md="4" sm="12">
              <v-btn
                id="submit"
                type="submit"
                class="button text-capitalize font-weight-light"
                color="primary"
                dark
                depressed
                @click="login"
              >
                Entrar
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="4" sm="12">
        <nuxt-link
          id="forgotPassword"
          to="/login/forgotPassword"
          class="buttonLink"
        >
          <button class="buttonTransparent">Esqueceu sua Senha?</button>
        </nuxt-link>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Vue from 'vue';
const EventBus = new Vue();

// https://as1.ftcdn.net/v2/jpg/00/81/69/80/1000_F_81698098_sCp417H1sXpi4Ja0ouwtWamwCfW0Nlw5.jpg

export default {
  layout: "auth",
  name: "Login",
  data() {
    return {
      dialog: false,
      valid: null,
      show: false,
      user: null,
      password: null,
      loading: false,
      isPwd: true,
      rules: {
        required: (value) => !!value || "Campo Obrigatório",
        min: (v) => (v && v.length >= 6) || "Minimo de 6 caracteres",
      },
    };
  },
  mounted() {
    if (this.$auth.isAuthenticated())
      location.href = location.href.replace(/login.*/, "home");
  },
  methods: {
    limparForm() {
        this.password = '';
    },
    showNotification(err) {
        console.log(err.code);
        if (err && err.code == 'invalid_grant') {
          EventBus.$emit('notify', {
            text: 'Usuário ou senha incorreta',
            icon: ['fas', 'bullhorn'],
            color: 'white',
          });
        } else {
          console.error('Unknown error', err);
          EventBus.$emit('notify', {
            text: 'Ocorreu um erro, por favor tente novamente mais tarde.',
            icon: ['fas', 'bullhorn'],
            color: 'white',
          });
        }
    },
    login(e) {
        this.$refs.user.validate();
        this.$refs.password.validate();
        e.preventDefault();
        if (this.$refs.user.hasError || this.$refs.password.hasError) {
          return;
        }
        this.$auth.newLogin(this.user, this.password, (err) => {
          if (err && err.code == 'invalid_grant') {
            this.showNotification(err);
          } else if (err) {
            this.showNotification(err);
          }
        });
    },
  },
};
</script>

<style scoped>
.button {
  outline: none;
}
</style>
