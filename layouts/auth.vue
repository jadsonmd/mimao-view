<template>
  <v-app>
    <v-content>
      <v-container>
        <div>
          <v-snackbar
            class="snackBarTxt"
            v-model="snackbar"
            :color="color"
            :top="true"
            :timeout="0"
            :multi-line="true"
          >
            <fa v-if="icon" :icon="icon" color="#099AB1"/>
            <span class="pl-5 primary--text">{{ text }}</span>
            <v-btn
              class="snackBarTxt"
              text
              small
              color="#099AB1"
              @click="snackbar = false"
              >Fechar</v-btn
            >
          </v-snackbar>
          <v-img
            :src="require('@/assets/images/Teatime.png')"
            contain
            height="60"
            class="headerToTop"
          />
          <nuxt />
        </div>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Vue from 'vue';
const EventBus = new Vue();

export default {
  name: "AuthLayout",
  head() {
    return {
      link: [
        { rel: 'stylesheet', href: 'auth.css' }
      ],
    }
  },
  mounted() {
    EventBus.$on("notify", ({ icon, color, text }) => {
      this.color = color;
      this.text = text;
      this.icon = icon;
      this.snackbar = true;
    });
  },
  data() {
    return {
      snackbar: false,
      text: "",
      color: "",
      icon: null
    };
  }
};
</script>
<style scoped>
  .snackBarTxt {
    color: #FB724A;
    caret-color: #FB724A;
  }
</style>

<style>
@import '@/assets/auth.css';
</style>