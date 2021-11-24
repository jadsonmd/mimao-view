<template>
  <v-card>
    <h1>Alunos JMD</h1>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-row>
          <v-col align="right">
            <v-btn color="primary" dark @click="buscarAluno">
              Buscar Alunos
            </v-btn>
            <v-btn color="secondary" dark v-bind="attrs" v-on="on">
              Cadastrar Alunos
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Cadastrar Aluno</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row align="center">
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Nome do Aluno"
                  v-model="aluno.nome"
                  hint="Nome do aluno."
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Sobrenome do Aluno"
                  v-model="aluno.sobrenome"
                  hint="Sobrenome do aluno."
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="CPF do Aluno"
                  v-model="aluno.cpf"
                  hint="CPF do aluno."
                  type="number"
                  counter="11"
                  min="11"
                  max="11"
                  :hide-spin-buttons="true"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="CEP do Aluno"
                  v-model="aluno.endereco.cep"
                  hint="CEP do Aluno, ex: 88950000."
                  type="number"
                  counter="8"
                  min="8"
                  max="8"
                  :hide-spin-buttons="true"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Celular do Aluno"
                  v-model="aluno.celular"
                  hint="Celular do aluno com DDD, ex: (48) 9 9999-9999."
                  type="number"
                  counter="11"
                  min="11"
                  max="11"
                  :hide-spin-buttons="true"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Email do Aluno"
                  v-model="aluno.email"
                  hint="Email do aluno."
                  type="email"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-container fluid>
                  <v-textarea
                    counter
                    label="Descrição do aluno"
                    v-model="aluno.descricao"
                    hint="Descrição que represente o aluno."
                  ></v-textarea>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
          <small>*indica que o campo é de preenchimento obrigatório</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="fecharDialog">
            Cancelar
          </v-btn>
          <v-btn color="blue darken-1" text @click="salvarAluno">
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
        :items="alunos"
        :search="search"
      ></v-data-table>
    </v-card>
  </v-card>
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
        text: "Nome",
        align: "start",
        value: "nome",
      },
      { text: "Sobrenome", align: "start", value: "sobrenome" },
      { text: "Celular", align: "start", value: "celular" },
      { text: "Email", align: "start", value: "email" },
    ],
    alunos: [],
    aluno: {
      endereco: {},
    },
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
    async salvarAluno() {
      console.log(this.aluno);

      const response = await axios.post(
        `http://localhost:8080/aluno`,
        this.aluno
      );
      this.aluno = response.data;
      this.alunos.push(this.aluno);
      this.dialog = false;
    },
    async buscarAluno() {
      const response = await axios.get(`http://localhost:8080/aluno`);
      this.alunos = [...response.data];
    },
    fecharDialog() {
      this.dialog = false;
    },
  },
};
</script>
