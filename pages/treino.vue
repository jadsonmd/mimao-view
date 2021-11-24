<template>
  <v-row align="center">
    <v-spacer></v-spacer>
    <v-col cols="12">
      <v-autocomplete
        v-model="aluno"
        item-text="nome"
        :items="alunos"
        :return-object="true"
        dense
        filled
        label="Escolha o aluno"
      ></v-autocomplete>
    </v-col>

    <v-col cols="12">
      <v-text-field
        label="Nome do treino"
        v-model="historicoTreino.nome"
        hint="Ex: Hipertrofia com foco em Pernas / Perda de Gordura / AVM"
      ></v-text-field>
    </v-col>

    <v-col cols="12" sm="6" md="4">
      <v-menu
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="historicoTreino.dataInicioTreino"
            label="Data inicio do treino"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="historicoTreino.dataInicioTreino"
          @input="menu2 = false"
        ></v-date-picker>
      </v-menu>
    </v-col>

    <v-col cols="12">
      <v-select
        :items="tiposTreinos"
        v-model="historicoTreino.tipo"
        label="Escolha o tipo do treino"
      ></v-select>
    </v-col>

    <v-col cols="12">
      <template>
        <v-expansion-panels>
          <v-expansion-panel
            v-for="(item, i) in this.historicoTreino.treinos"
            :key="i"
          >
            <v-expansion-panel-header>
              Treino - {{ item.tipo }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-chip
                class="ma-2"
                color="primary"
                v-for="(exe, j) in item.exercicios"
                :key="j"
              >
                {{ exe.nome }}
              </v-chip>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </v-col>
    <v-col cols="12">
      <template>
        <v-data-table
          :headers="headers"
          :items="exerciciosDoAluno"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Exercícios do Aluno</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Novo Exercício
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-autocomplete
                            v-model="editedItem"
                            item-text="nome"
                            :return-object="true"
                            :items="exercicios"
                            dense
                            filled
                            label="Escolha o exercício"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="editedItem.biset"
                            label="Biset"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-checkbox
                            v-model="editedItem.pausaDescanso"
                            label="Pausa Descanso"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.serie"
                            label="Série"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.repeticao"
                            label="Repetições"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancelar
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                      Salvar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Você tem certeza que deseja deletar esse
                    exercício?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancelar</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
          <!-- <template v-slot:no-data>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
          </template> -->
        </v-data-table>
        <v-btn color="primary" @click="adicionarTreino"> Adicionar </v-btn>
      </template>
    </v-col>
    <v-col align="right">
      <v-btn color="primary" @click="salvarTreino"> Salvar </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    alunos: [],
    aluno: {},
    exercicios: [],
    exercicio: {},
    historicoTreino: {
      treinos: [],
      dataInicioTreino: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
    },
    tiposTreinos: [
      "Hipertrofia",
      "Força",
      "Funcional",
      "Definição",
      "Cardio",
      "Resistência Muscular",
      "Terapêutico",
      "Desempenho",
      "Recuperação Muscular",
    ],
    tipoTreino: "",
    menu2: false,
    exerciciosDoAluno: [],
    treinos: [],

    headers: [
      {
        text: "Exercício",
        align: "start",
        sortable: false,
        value: "nome",
      },
      {
        text: "Finalidade",
        align: "start",
        sortable: false,
        value: "finalidade",
      },
      { text: "Biset", value: "biset" },
      { text: "Pausa-Descanso", value: "pausaDescanso" },
      { text: "Série", value: "serie" },
      { text: "Repetições", value: "repeticao" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      biset: "",
      pausaDescanso: false,
      serie: "",
      repeticao: "",
    },
    defaultItem: {
      biset: "",
      pausaDescanso: false,
      serie: "",
      repeticao: "",
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Novo Exercício" : "Editar Exercício";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  methods: {
    async findExercicios() {
      const response = await axios.get("http://localhost:8080/exercicio");
      this.exercicios = response.data;
    },

    async findAlunos() {
      const response = await axios.get("http://localhost:8080/aluno");
      this.alunos = response.data;
    },

    // initialize() {},

    editItem(item) {
      this.editedIndex = this.exerciciosDoAluno.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.exerciciosDoAluno.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.exerciciosDoAluno.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(
          this.exerciciosDoAluno[this.editedIndex],
          this.editedItem
        );
      } else {
        this.exerciciosDoAluno.push(this.editedItem);
      }
      this.close();
    },
    adicionarTreino() {
      if (this.exerciciosDoAluno.length !== 0) {
        this.historicoTreino.treinos.push({
          tipo: this.getTipoTreino(),
          exercicios: this.exerciciosDoAluno,
        });
        this.exerciciosDoAluno = [];
      }
    },
    getTipoTreino() {
      if (this.historicoTreino.treinos.length === 0) {
        return "A";
      } else if (this.historicoTreino.treinos.length === 1) {
        return "B";
      } else if (this.historicoTreino.treinos.length === 2) {
        return "C";
      } else if (this.historicoTreino.treinos.length === 3) {
        return "D";
      } else if (this.historicoTreino.treinos.length === 4) {
        return "E";
      } else if (this.historicoTreino.treinos.length === 5) {
        return "F";
      } else if (this.historicoTreino.treinos.length === 6) {
        return "G";
      } else if (this.historicoTreino.treinos.length === 7) {
        return "H";
      } else if (this.historicoTreino.treinos.length === 8) {
        return "I";
      } else if (this.historicoTreino.treinos.length === 9) {
        return "J";
      }
    },

    async salvarTreino() {
      console.log(this.alunos);
      console.log(this.historicoTreino.treinos);

      const response = await axios.post(
        `http://localhost:8080/aluno/historicoTreinoAluno/${this.aluno.id}`,
        this.historicoTreino
      );
      this.aluno = response.data;
    },
  },
  mounted() {
    this.findExercicios();
    this.findAlunos();
  },
};
</script>