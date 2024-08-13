import { useEffect, useRef } from 'react'; 
import './App.css';

function App() {  
  const mapEl = useRef(null); 
  const { naver } = window; 

  useEffect(() => { 
    if (!mapEl.current || !naver) return; 
    
    const location = new naver.maps.LatLng(37.5358994, 126.8969627);
    const mapOptions = {
      center: location,
      zoom: 17,
      zoomControl: true,
    };

    const map = new naver.maps.Map(mapEl.current, mapOptions);
    new naver.maps.Marker({
      position: location,
      map,
    });
  }, []);

  return (
    <div className="App">
      <div className="map" ref={mapEl}></div>
    </div>
  );
}

export default App;
