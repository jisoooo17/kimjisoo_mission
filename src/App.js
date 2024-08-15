import { useEffect, useRef, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const mapEl = useRef(null); // 지도 엘리먼트 참조
  const { naver } = window; 

  const [data, setData] = useState([]); // 서버에서 가져온 데이터 저장
  const [markers, setMarkers] = useState([]); // 지도에 표시된 마커들 저장
  const [visMarkers, setVisMarkers] = useState(new Set()); // 현재 보이는 마커의 타입 저장
  const [map, setMap] = useState(null); // 네이버 지도 객체 저장

  // 버튼 요소들에 대한 참조
  const btnRefs = useRef({});

  useEffect(() => {
    if (!mapEl.current || !naver) return;

    // 지도 중심 좌표
    const location = new naver.maps.LatLng(37.5358994, 126.8969627);
    
    // 지도 옵션
    const mapOptions = {
      center: location, 
      zoom: 17, 
      zoomControl: false,
    };

    // 네이버 지도 생성하여 mapInstance에 저장
    const mapInstance = new naver.maps.Map(mapEl.current, mapOptions);
    setMap(mapInstance); 

    // 기본 마커
    new naver.maps.Marker({
      position: location,
      map: mapInstance,
      icon: createCustomMarker(
        iconUrls.PIN,
        { width: 40, height: 40 }
      ),
    });

    // 서버로부터 데이터 가져옴
    axios.get('https://apiy.yourpick.co.kr/mission/test001')
      .then((res) => {
        setData(res.data); 
        showMarkers(res.data, mapInstance); 
      })
      .catch((err) => { console.log(err); }); 
  }, [naver]); 

  // 아이콘 URL 설정
  const iconUrls = {
    PIN: process.env.PUBLIC_URL + '/img/icon-pin.png',
    CAFE: process.env.PUBLIC_URL + '/img/icon-cafe.png',
    FOOD: process.env.PUBLIC_URL + '/img/icon-cutlery.png',
    MART: process.env.PUBLIC_URL + '/img/icon-store.png',
    PHARMACY: process.env.PUBLIC_URL + '/img/icon-medicine.png',
  };

  // 모든 타입의 마커를 표시하는 함수
  const showMarkers = (data, mapInstance) => {
    const newMarkers = data.map((item) => {
      return new naver.maps.Marker({
        position: new naver.maps.LatLng(item.lat, item.lng),
        map: mapInstance,
        title: item.name,
        type: item.type,
        icon: createCustomMarker(
          iconUrls[item.type],
          { width: 30, height: 30 } 
        ),
      });
    });
  
    setMarkers(newMarkers);
    setVisMarkers(new Set(data.map((item) => item.type)));
    newMarkers.forEach(marker => marker.setMap(mapInstance));
  };
  
  const createCustomMarker = (url, size) => {
    return {
      content: `
        <div style="width: ${size.width}px; height: ${size.height}px; overflow: hidden;">
          <img src="${url}" style="width: 100%; height: 100%;"/>
        </div>
      `,
      size: new naver.maps.Size(size.width, size.height),
      anchor: new naver.maps.Point(size.width / 2, size.height),
    };
  };
  
  // 버튼 클릭 시 특정 타입의 마커를 토글하는 함수
  const handleBtnClk = (type) => {
    setVisMarkers((prev) => {
      const newVisMarkers = new Set(prev); 

      if (newVisMarkers.has(type)) {
        // 클릭한 타입이 이미 존재하면, 제거하고 마커와 버튼 이미지를 숨김
        newVisMarkers.delete(type);
        markers.forEach((marker) => {
          if (marker.type === type) {
            marker.setMap(null);
          }
        });

        // 해당 타입의 버튼 이미지 숨기기
        if (btnRefs.current[type]) {
          btnRefs.current[type].classList.add("hide");
        }
      } else {
        // 클릭한 타입이 존재하지 않으면, 추가하고 마커와 버튼 이미지를 보이게 함
        newVisMarkers.add(type);
        markers.forEach((marker) => {
          if (marker.type === type) {
            marker.setMap(map); 
          }
        });

        // 해당 타입의 버튼 이미지를 보이게 하기
        if (btnRefs.current[type]) {
          btnRefs.current[type].classList.remove("hide");
        }
      }
      
      return newVisMarkers;
    });
  };

  return (
    <div className="App">
      <div className="wrap">
        <div className="map" ref={mapEl}></div>
        <div className="btn-area">
          <div className="btn-w">
            <button 
              type="button" 
              className="btn-toggle" 
              ref={(el) => btnRefs.current["CAFE"] = el} 
              onClick={() => handleBtnClk('CAFE')}>
              <img src={process.env.PUBLIC_URL + '/img/icon-cafe.png'} alt="CAFE Icon" />
            </button>
            <p className="txt">카페</p>
          </div>
          <div className="btn-w">
            <button 
              type="button" 
              className="btn-toggle" 
              ref={(el) => btnRefs.current["FOOD"] = el}
              onClick={() => handleBtnClk('FOOD')}>
              <img src={process.env.PUBLIC_URL + '/img/icon-cutlery.png'} alt="FOOD Icon" />
            </button>
            <p className="txt">음식점</p>
          </div>
          <div className="btn-w">
            <button 
              type="button" 
              className="btn-toggle" 
              ref={(el) => btnRefs.current["MART"] = el} 
              onClick={() => handleBtnClk('MART')}>
              <img src={process.env.PUBLIC_URL + '/img/icon-store.png'} alt="MART Icon" />
            </button>
            <p className="txt">편의점</p>
          </div>
          <div className="btn-w">
            <button 
              type="button" 
              className="btn-toggle" 
              ref={(el) => btnRefs.current["PHARMACY"] = el} 
              onClick={() => handleBtnClk('PHARMACY')}>
              <img src={process.env.PUBLIC_URL + '/img/icon-medicine.png'} alt="PHARMACY Icon" />
            </button>
            <p className="txt">약국</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
