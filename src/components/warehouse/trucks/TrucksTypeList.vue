<template>
  <div>
    <div class="columns ">
      <div class="column is-3 ">
        <!-- Skeleton de carga -->
        <section v-if="loading" style="width: 100%;">
          <article class="media" v-for="i in media" :key="i">
            <figure class="media-left">
              <p class="image is-48x48">
                <b-skeleton circle width="48px" height="48px"></b-skeleton>
              </p>
            </figure>
            <div class="media-content">
              <div class="content">
                <p>
                  <b-skeleton active></b-skeleton>
                  <b-skeleton height="80px"></b-skeleton>
                </p>
              </div>
              <nav class="level is-mobile">
                <div class="level-left">
                  <a class="level-item">
                    <span class="icon is-small">
                      <b-skeleton></b-skeleton>
                    </span>
                  </a>
                  <a class="level-item">
                    <span class="icon is-small">
                      <b-skeleton></b-skeleton>
                    </span>
                  </a>
                </div>
              </nav>
            </div>
          </article>
        </section>

        <div
          v-else
          class="columns is-multiline"
          style="max-height: 900px; overflow: hidden scroll;"
        >
          <div class="column is-12">
            <div class="container has-text-right" style="margin-bottom: 10px;">
              <span>
                <b-button type="is-info" icon-left="plus" @click="openNewEditTruck()">
                  <span>{{ language.NEW }}</span>
                </b-button>
              </span>
            </div>
          </div>

          <div class="column is-12" v-for="truck_type in list" :key="truck_type.id">
            <div
              :class="{
                media: true,
                'media-list': true,
                'media-list-active': select && truck_type.id == select.id,
              }"
              @click="select = truck_type"
            >
              <div class="media-left">
                <b-icon :type="truck_type.cabcolor" icon="truck" />
              </div>
              <div class="media-content has-text-left">
                {{ truck_type.code }}
                <br />

                <p>
                  <small>
                    <b>{{ language.SERIAL }}</b> {{ truck_type.serial }}
                  </small>
                </p>

                <p>
                  <small>
                    <b>{{ language.VOLUMEN }}</b> {{ truck_type.volume }}
                  </small>
                </p>

                <p>
                  <small>
                    <b>{{ language.UPDATED }}</b>
                    {{ truck_type.updated && getToDate(truck_type.updated) }}
                  </small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="column is-9" style="max-height: 900px; overflow: hidden scroll;">
        <div v-if="!select == false">
          <div class="columns is-multiline">
            <div class="column is-12"></div>
            <div class="column is-12">
              <trucks-list :truck_type="select" :language="language" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.media-list {
  cursor: pointer;
  padding: 20px;
  border-top: 1px solid #ddd;
  border-radius: 10px;
  margin: 0px auto;
}

.media-list-active {
  background: #f1f1f1;
  color: #666;
}
</style>

<script>
import { ClientQPM } from '../../../utils/qpm';
import TrucksList from './TrucksList';
import moment from 'moment';

export default {
  props: ['language'],
  components: { TrucksList },

  data: () => ({
    page: 1,
    perPage: 20,
    list: [],
    media: 4,
    loading: false,
    sede: ClientQPM.getCurrentUser().site_name,
    select: null,
  }),

  mounted: function() {
    this.getData();
  },

  methods: {
    // obteniendo la fecha
    getToDate: function(date) {
      date = new Date(date);
      return `${moment(date).format('LT')} ${moment(date).format('L')}`;
    },

    // metodo que obtiene el listo de tipos de vehiculos
    getData: async function() {
      try {
        ClientQPM.method('getTruckTypesFromSite', { sede: { sede: this.sede } });
        this.loading = true;

        const trucks_type = await ClientQPM.fetch()
          .then(t => t)
          .catch(error => {
            throw error;
          });

        this.list = trucks_type;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    openDelete: function(resource) {
      this.$buefy.dialog.confirm({
        title: 'Eliminar Tipo',
        message:
          '¿Usted esta seguro que desea <b>Eliminar</b> el siguiente tipo? Esta accion no puede ser corregida.',
        confirmText: this.language.DELETE,
        cancelText: this.language.CANCEL,
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          try {
            // establecinedo method, sus parametros y solicitando sus datops
            ClientQPM.method('deleteContainer', { contid: { id: resource.id } });
            await ClientQPM.fetch()
              .then(response => response)
              .catch(error => {
                throw error;
              });

            // mostrando el mensaje de exito
            this.$buefy.toast.open({
              message: 'El container fue eliminado con exito',
              type: 'is-success',
              hasIcon: true,
            });

            // actualizando los datos de la table
            this.getData();
          } catch (error) {
            this.$buefy.toast.open({
              type: 'is-danger',
              message: error,
              hasIcon: true,
            });
          }
        },
      });
    },
  },
};
</script>
