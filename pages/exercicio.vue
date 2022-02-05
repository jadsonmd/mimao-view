<template>
  <!-- <v-row align="right"> -->
  <v-card>
    <h1>Exercícios</h1>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-row>
          <v-col align="right">
            <v-btn color="primary" dark @click="buscarExercicio">
              Buscar Exercícios
            </v-btn>
            <v-btn color="secondary" dark v-bind="attrs" v-on="on">
              Cadastrar Exercícios
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Cadastrar Exercício</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row align="center">
              <!-- <v-col class="text-center"> -->
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-model="exercicio.nome"
                  hint="Nome que aparecerá para os usuários do app."
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-select
                  :items="items"
                  v-model="exercicio.finalidade"
                  label="Músculo"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-file-input
                  accept="image/*"
                  label="Imagem do exercício"
                  v-model="exercicio.image"
                  hint="Imagem que represente a execução do exercício."
                ></v-file-input>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Url do treino em vídeo"
                  v-model="exercicio.video"
                  hint="Vídeo que represente a execução do exercício."
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-container fluid>
                  <v-textarea
                    counter
                    label="Descrição do exercício"
                    v-model="exercicio.descricao"
                    hint="Descrição que represente a execução do exercício."
                  ></v-textarea>
                </v-container>
              </v-col>
              <!-- </v-col> -->
            </v-row>
          </v-container>
          <small>*indica que o campo é de preenchimento obrigatório</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="fecharDialog">
            Cancelar
          </v-btn>
          <v-btn color="blue darken-1" text @click="salvarExercicio">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Pesquisar"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="exercicios"
        :search="search"
      ></v-data-table>
    </v-card>
  </v-card>
  <!-- </v-row> -->
</template>
<script>
import axios from "axios";

export default {
  data: () => ({
    search: "",
    headers: [
      {
        text: "Id",
        align: "start",
        value: "id",
      },
      {
        text: "Nome do exercício",
        align: "start",
        value: "nome",
      },
      { text: "Finalidade", align: "center", value: "finalidade" },
    ],
    exercicios: [],
    exercicio: {},
    dialog: false,
    items: [
      "Peito",
      "Costas",
      "Pernas",
      "Glúteo",
      "Panturrilha",
      "Lombar",
      "Braço",
    ],
  }),
  methods: {
    async salvarExercicio() {
      console.log(this.exercicio);

      const response = await axios.post(
        `/exercicio`,
        this.exercicio
      );
      this.exercicio = response.data;
      this.exercicios.push(this.exercicio);
      this.dialog = false;
    },
    async buscarExercicio() {
      const response = await axios.get(`/exercicio`);
      this.exercicios = [...response.data];
    },
    fecharDialog() {
      this.dialog = false;
    },
  },
};
</script>
