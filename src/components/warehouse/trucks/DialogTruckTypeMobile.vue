<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head has-background-info">
      <p class="modal-card-title has-text-white" style="font-size: 20px;">
        {{ language.TRUCK_TYPE_DETAILS }}
      </p>
    </header>
    <section class="modal-card-body">
      <div v-if="!resource == false">
        <div class="columns is-multiline">
          <div class="column is-12">
            <div class="columns is-multiline has-background-lighter" style="padding: 10px;">
              <div class="column is-12">
                <hr />
                <p class="subtitle">
                  <span>{{ language.DETAILS }}</span>
                </p>
              </div>

              <div class="column is-4">
                <p class="has-text-justified">
                  <b>{{ language.CODE }}</b> {{ resource.code }}
                </p>
              </div>
              <div class="column is-4">
                <p class="has-text-justified">
                  <b>{{ language.SEDE }}</b> {{ resource.sitename }}
                </p>
              </div>
              <div class="column is-4">
                <p class="has-text-justified">
                  <b>{{ language.CONTAINERS }}</b> {{ resource.containers.length }}
                </p>
              </div>
              <div class="column is-4">
                <p class="has-text-justified">
                  <b>{{ language.SERIAL }}</b> {{ resource.serial }}
                </p>
              </div>
              <div class="column is-4">
                <p class="has-text-justified">
                  <b>{{ language.VOLUMEN }}</b> {{ resource.volume }}
                </p>
              </div>
              <div class="column is-4">
                <p class="has-text-justified">
                  <b>{{ language.UPDATED }}</b>
                  {{ resource.updated && getToDate(resource.updated) }}
                </p>
              </div>
              <div class="column is-4">
                <p class="has-text-justified">
                  <b>{{ language.AXLES }}</b>
                  {{ resource.axles.length }}
                </p>
              </div>
              <div class="column is-4">
                <p class="has-text-justified">
                  <b>{{ language.BAYS }}</b>
                  {{ resource.bays.length }}
                </p>
              </div>
              <div class="column is-12 has-text-right">
                <b-button type="is-info" style="margin-right: 10px;" icon-right="pencil">
                  {{ language.EDIT }}
                </b-button>
                <b-button type="is-danger" icon-right="delete">
                  {{ language.DELETE }}
                </b-button>
                <hr />
              </div>
            </div>
          </div>
          <div class="column is-12">
            <trucks-list :truck_type="resource" :language="language" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import TrucksList from './TrucksList';
import moment from 'moment';
export default {
  props: ['resource', 'language'],
  components: { TrucksList },
  methods: {
    // obteniendo la fecha
    getToDate: function(date) {
      date = new Date(date);
      return `${moment(date).format('LT')} ${moment(date).format('L')}`;
    },
  },
};
</script>
