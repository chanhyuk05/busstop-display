import React, { useState, useEffect } from 'react';
import { BusRoute, BusArrival } from './types';
import { mockRoutes, mockArrivals } from './data/mockData';
import Header from './components/Header';
import CurrentTime from './components/CurrentTime';
import SearchInput from './components/SearchInput';
import SearchResults from './components/SearchResults';
import BusArrivalInfo from './components/BusArrivalInfo';
import ReservationComplete from './components/ReservationComplete';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState<BusRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isReserved, setIsReserved] = useState(false);
  const [reservedBus, setReservedBus] = useState<string>('');
  const [countdown, setCountdown] = useState(5);
  const [currentSlide, setCurrentSlide] = useState(0);

  // 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      

    }, 30000); // 30초마다 업데이트

    return () => clearInterval(timer);
  }, []);

  // 자동 슬라이드 기능 - 검색어가 없을 때만 작동
  useEffect(() => {
    // 검색어가 있으면 자동 슬라이드 비활성화
    if (searchTerm.trim()) {
      return;
    }

    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => {
        const searchSlides = Math.ceil(filteredRoutes.length / 4);
        const uniqueArrivals = mockArrivals.reduce((unique: BusArrival[], bus) => {
          const existingBus = unique.find(b => b.routeNumber === bus.routeNumber);
          if (!existingBus || bus.arrivalTime < existingBus.arrivalTime) {
            return unique.filter(b => b.routeNumber !== bus.routeNumber).concat(bus);
          }
          return unique;
        }, []);
        const arrivalSlides = Math.ceil(uniqueArrivals.length / 4);
        const totalSlides = Math.max(searchSlides, arrivalSlides);
        if (totalSlides <= 1) return 0;
        return (prev + 1) % totalSlides;
      });
    }, 3000); // 3초마다 슬라이드

    return () => clearInterval(slideTimer);
  }, [filteredRoutes.length, mockArrivals.length, searchTerm]);

  // 실시간 검색 기능
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRoutes([]);
      return;
    }

    const filtered = mockRoutes.filter(route =>
      route.routeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.routeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoutes(filtered);
    
    // 검색할 때 슬라이드를 첫 번째로 리셋
    setCurrentSlide(0);
  }, [searchTerm]);

  // 버스 예약 기능
  const handleReservation = (busNumber: string) => {
    // 등록된 버스 번호인지 확인
    const isValidBus = mockRoutes.some(route => 
      route.routeNumber.toLowerCase() === busNumber.toLowerCase()
    );
    
    if (!isValidBus) {
      alert('등록되지 않은 버스 번호입니다.\n다시 확인해주세요.');
      return;
    }
    
    setReservedBus(busNumber);
    setIsReserved(true);
    setCountdown(5);
    
    // 1초마다 카운트다운 업데이트
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setIsReserved(false);
          setReservedBus('');
          setSearchTerm('');
          setFilteredRoutes([]);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 메인화면으로 돌아가기
  const returnToMain = () => {
    setIsReserved(false);
    setReservedBus('');
    setSearchTerm('');
    setFilteredRoutes([]);
    setCountdown(5);
  };

  // 노선 선택
  const handleRouteSelect = (route: BusRoute) => {
    setSelectedRoute(route);
  };

  // 시간 포맷
  const formatTime = (minutes: number) => {
    if (minutes < 1) return '곧 도착';
    return `${Math.ceil(minutes)}분`;
  };

  // 예약 완료 페이지 렌더링
  if (isReserved) {
    return (
      <ReservationComplete
        reservedBus={reservedBus}
        countdown={countdown}
        onReturn={returnToMain}
      />
    );
  }

  return (
    <div style={{ 
      padding: '0', 
      background: '#ffffff',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <Header />
      
      <div style={{ padding: '20px' }}>
        <CurrentTime currentTime={currentTime} />
        
        <SearchInput
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onEnterPress={handleReservation}
        />

        <SearchResults
          filteredRoutes={filteredRoutes}
          mockArrivals={mockArrivals}
          searchTerm={searchTerm}
          currentSlide={currentSlide}
          selectedRoute={selectedRoute}
          onRouteSelect={handleRouteSelect}
          formatTime={formatTime}
        />

        {/* 실시간 버스 도착 정보 - 검색어가 없을 때만 표시 */}
        {!searchTerm.trim() && (
          <BusArrivalInfo
            mockRoutes={mockRoutes}
            mockArrivals={mockArrivals}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            formatTime={formatTime}
          />
        )}
      </div>
    </div>
  );
}

export default App;