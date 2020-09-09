import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxAccessToken from './MapboxAccessToken.js';
 
mapboxgl.accessToken = MapboxAccessToken;

const style = {
    height: "500px"
};
   
class Mapbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  markers = [];
  map = null
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.props.center.lng, this.props.center.lat],
      zoom: this.props.zoom
    });
    this.map.addControl(new mapboxgl.NavigationControl());

    this.props.assets.forEach(a => {
        let popup = new mapboxgl.Popup()
            .setHTML('<p>' + a.label + '</p>');

        let marker = new mapboxgl.Marker({draggable: true})
            .setLngLat([a.lng, a.lat])
            .setPopup(popup)
            .addTo(this.map);
        
        marker.getElement().addEventListener('click', () => {
          this.props.onClick(a.id);
        });
       
        marker.on('dragend', () => {
          var lngLat = marker.getLngLat();
          this.props.onMove(a.id, lngLat.lng, lngLat.lat);
        }); 
 
        this.markers.push(marker);
    });


    
    this.map.on('load', () => {
      this.props.areas.forEach(a => {
        let polygon = [];
        
        a.polygon.forEach(c => {
          polygon.push([c.long, c.lat]);
        })

        this.map.addSource(a.id, 
        {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [ polygon ]
                }
            }
        });
        this.map.addLayer({
            'id': a.id,
            'type': 'fill',
            'source': a.id,
            'layout': {},
            'paint': {
                'fill-color': '#077',
                'fill-opacity': 0.8
            }
        });
      });
    });

    this.map.on('moveend', ({ originalEvent }) => {
      if (originalEvent) {
        this.map.fire('usermoveend');
      } else {
        // this.map.fire('flyend');
      }
    });

    this.map.on('usermoveend', () => {
      this.props.onChange(this.map.getCenter().lng.toFixed(4), this.map.getCenter().lat.toFixed(4), this.map.getZoom().toFixed(2));
    });
  
  }
  
  render() {
    if (this.map) {
        this.map.flyTo({
            center: [this.props.center.lng, this.props.center.lat],
            zoom: this.props.zoom
        });

        //console.log(this.markers.length);
        // if (this.markers.length > 0) {
        //   for (var i = this.markers.length - 1; i >= 0; i--) {
        //     this.markers[i].remove();
        //   }
        // }

        const markers_len = this.markers.length - 1;
        this.props.assets.forEach((a, idx) => {
          if (idx > markers_len) {
            let popup = new mapboxgl.Popup()
              .setHTML('<p>' + a.label + '</p>');
      
            var marker = new mapboxgl.Marker()
                .setLngLat([a.lng, a.lat])
                .setPopup(popup)
                .addTo(this.map);
            
            this.markers.push(marker);
          }
          else {
            this.markers[idx].setLngLat([a.lng, a.lat])
          }
        });
    }

    return (
      <div >
        <div ref={el => this.mapContainer = el} style={style} />
      </div>
    )
  }
}
// class Mapbox extends React.Component {
//     constructor(props) {
//       super(props);
//       this.state = {
//         lng: -97.8,
//         lat: 30.34,
//         zoom: 5
//       };
//     }
     
//     componentDidMount() {
//       const map = new mapboxgl.Map({
//         container: this.mapContainer,
//         style: 'mapbox://styles/mapbox/streets-v11',
//         center: [this.state.lng, this.state.lat],
//         zoom: this.state.zoom
//       });
     
//       map.on('move', () => {
//         this.setState({
//           lng: map.getCenter().lng.toFixed(4),
//           lat: map.getCenter().lat.toFixed(4),
//           zoom: map.getZoom().toFixed(2)
//         });
//       });
//     }
     
//     render() {
//       return (
//         <div>
//           <div className='sidebarStyle'>
//             <div>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</div>
//           </div>
//           <div ref={el => this.mapContainer = el} className='mapContainer' />
//         </div>
//       )
//     }
//   }
 
export default Mapbox;
