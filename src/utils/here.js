import H from '@here/maps-api-for-javascript';
import onResize from 'simple-element-resize-detector';
import Marker from "./here/marker";
import config from './here.json';

// creado de node del elemento
const HereMap = () => ({
  _config: config, // configuración del servicio
  platform: new H.service.Platform({ apikey: config.APP_KEY }), // creacion de la plataforma
  bubbles: [],

  // funcion que se encarga de crear un mapa
  createMap: function(nodeElement, params = { zoom: 10, center: { lat: 13.51, lng: -88.87 } }) {
    const platform = this.platform;
    const defaultLayers = platform.createDefaultLayers();
    params.pixelRatio = window.devicePixelRatio || 1;

    const map = new H.Map(nodeElement, defaultLayers.vector.normal.map, params);
    this.map = map;

    // Step 3: make the map interactive
    // MapEvents enables the event system
    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    this.behavior = behavior;
    this.nodeElement = nodeElement;

    map.addEventListener("tap", (evt) => this.handleClickMap(evt));
    this.uiControls(defaultLayers, map);
    this._autoResize();
  },

  // funcion control event tap
  handleClickMap: function(evt) {
    const map = this.map;
    const center = evt.target.getCenter();
    const currentPointer = evt.currentPointer;
    const coords = map.screenToGeo(currentPointer.viewportX, currentPointer.viewportY);
    typeof this.onClick == "function" && this.onClick({ coords, center, currentPointer });
  },

  // function que crea un punto de marcado
  createMarker: function(point, params = {}){
    const { content } = params;
    const marker = Marker(point);
    marker.addEventListener("tap", () => this.addBuble(point, { content }));
    marker.setData(content);
    return marker;
  },

  addObject: function(object){
    const map = this.map;
    map.addObject(object);
  },

  // funcion que se encarga de una burbuja de informacion
  addBuble: function() {
    const bubble = new H.ui.InfoBubble(...arguments);
    this.bubbles.push(bubble);
    this.ui.addBubble(bubble);
  },

  // funcionque se encarga agregar los controles
  uiControls: function(defaultLayers, map) {
    const ui = H.ui.UI.createDefault(map, defaultLayers, navigator.language);
    ui.getControl('zoom').setDisabled(false);

    const mapSettings = ui.getControl('mapsettings');
    const zoom = ui.getControl('zoom');
    const scalebar = ui.getControl('scalebar');

    mapSettings.setAlignment('top-left');
    zoom.setAlignment('top-left');
    scalebar.setAlignment('top-left');
    this.ui = ui;
  },

  // funcion que se encarga de obtener tu posision actual
  currentPosition: function() {
    return new Promise(resolve => {
      window.navigator.geolocation.getCurrentPosition(resolve);
    });
  },

  _autoResize: function() {
    const map = this.map;
    onResize(this.nodeElement, () => map.getViewPort().resize());
  },
});

export default HereMap;
