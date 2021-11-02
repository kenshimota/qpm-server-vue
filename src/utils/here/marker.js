import H from '@here/maps-api-for-javascript';
import erase from "./erase";

const ResourceMarker = (marker, coords) => ({
    coords,
    resource: marker,

    setData: function(data){
        this.data = data;
        this.resource.setData(data);
    },

    setCenter: function(point){
        const start = this.resource.getGeometry();
        erase(start, point, 200, (coord) => { 
            this.coords = coord;
            this.resource.setGeometry(coord); 
        });
    },

    addEventListener: function(event, callback){
        if(callback && event)
            this.resource.addEventListener(event, callback);
        else console.error("los datos del evento " + event + "no esta definida de forma correcta");
    },
});

const Marker = function(coords){
    const marker = new H.map.Marker(coords);
    const resource = ResourceMarker(marker, coords);
    return resource;
}

export default Marker;