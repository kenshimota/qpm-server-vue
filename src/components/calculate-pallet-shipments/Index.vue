<template>
  <div>
    <div class="columns is-multiline">
      <!-- Form Pallet -->
      <div class="column is-6">
        <form-pallet
          :language="language"
          :pallet-info="palletinfo"
          :setPallet="updatePallet"
        />
      </div>

      <!-- Table Calculate Boxes -->
      <div class="column is-6">
        <table-calculate :language="language" :items="pallets" />
      </div>

      <!-- Input -->
      <div class="column is-6">
        <b-field>
          <b-upload v-model="dropFiles" drag-drop>
            <section class="section">
              <div class="content has-text-centered">
                <p>
                  <b-icon icon="upload" size="is-large"> </b-icon>
                </p>
                <p>Drop your files here or click to upload</p>
              </div>
            </section>
          </b-upload>
        </b-field>
      </div>

      <!-- List Box -->
      <div class="column is-6">
        <list-boxes :boxes="boxes" :language="language" />
      </div>
    </div>
  </div>
</template>

<script>
import readXlsxFile from "read-excel-file";
import language from "../../languages/index";
import { ClientQPM } from "../../utils/qpm.js";
import ListBoxes from "./ListBoxes";
import FormPallet from "./FormPallet";
import TableCalculate from "./TableCalculate";

export default {
  data: () => ({
    dropFiles: null,
    shipment_id: null,
    user: ClientQPM.getCurrentUser(),
    typeFiles: { "application/vnd.ms-excel": true },
    language: language().content,
    boxes: new Array(),
    palletinfo: null,
    pallets: [],
  }),

  components: { ListBoxes, FormPallet, TableCalculate },

  methods: {
    calculateBoxesToPallet: async function() {
      try {
        const { username } = this.user;
        const pallet = this.palletinfo;

        const calcinfo = {
          user_name: username,
          calcmode: "normal",
          pallet_code: pallet.pallet_code,
          pallet_color: pallet.pallet_color,
          pallet_length: pallet.pallet_length,
          pallet_width: pallet.pallet_width,
          pallet_height: pallet.pallet_height,
          pallet_weight: pallet.pallet_weight,
          pallet_unit: pallet.pallet_unit,
          pl_maxll: pallet.pl_maxll,
          pl_maxlw: pallet.pl_maxlw,
          pl_maxlht: pallet.pl_maxlht,
          pl_maxlwt: pallet.pl_maxlwt,
          shipment_id: this.shipment_id,
        };

        ClientQPM.method("palletFillsFromShipmentDims", { calcinfo });

        const response = await ClientQPM.fetch();
        this.pallets = response.pallets;
        console.log(response.pallets);
      } catch (error) {
        console.error(error);
        throw new Error(error);
      }
    },

    updatePallet: function(updated = {}) {
      this.palletinfo = { ...this.palletinfo, ...updated };
      if (this.boxes.length > 1) this.calculateBoxesToPallet();
    },

    addBox: async function(params) {
      try {
        ClientQPM.method("addBoxForCalc", { boxinfo: params });
        const response = ClientQPM.fetch();
        this.boxes.push(params);

        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    handleReadXlsx: function(file) {
      readXlsxFile(file).then(this.readXlsx.bind(this));
    },

    readXlsx: function(content) {
      const rows = content.length;
      const cols = (rows > 0 && content[0].length) || 0;
      const graph = [];
      let stack = [];

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++)
          if (content[i][j] || stack.length > 0) stack.push(content[i][j]);

        if (stack.length > 0) {
          graph.push(stack);
          stack = [];
        }
      }

      this.readGraph(graph);
    },

    createShipment: async function() {
      try {
        const userinfo = { user_name: this.user.username };
        ClientQPM.method("createNewShipment", { userinfo });
        const { shipment_id } = await ClientQPM.fetch();
        this.shipment_id = shipment_id;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    readGraph: async function(graph) {
      await this.createShipment();

      for (let i = 1; i < graph.length; i++) {
        if (graph[i].length >= 10) {
          const data = graph[i];
          const params = {
            shipment_id: this.shipment_id,
            box_amount: data[7],
            box_code: data[8],
            box_desc: data[9],
            box_class: "TEMP",
            box_color: data[6],
            box_extlength: data[2],
            box_extwidth: data[3],
            box_extheight: data[4],
            box_weight: data[5],
            box_allowlength: false,
            box_allowwidth: false,
            box_allowheight: true,
            box_unit: data[0],
          };

          await this.addBox(params);
        }
      }
    },
  },

  watch: {
    dropFiles: function(file) {
      if (file instanceof File) this.handleReadXlsx(file);
      console.log(file);
    },
  },
};
</script>
