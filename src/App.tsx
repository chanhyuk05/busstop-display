import React, { useState, useEffect } from 'react';

// 목데이터 타입 정의
interface BusRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  color: string;
  company: string;
  interval: number;
  firstBusTime: string;
  lastBusTime: string;
}

interface BusArrival {
  routeNumber: string;
  routeName: string;
  arrivalTime: number;
  remainingStops: number;
  busType: 'regular' | 'lowFloor' | 'articulated';
  isLast: boolean;
  isFull: boolean;
  busNumber: string;
  previousStop: string;
  nextStop: string;
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState<BusRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [busArrivals, setBusArrivals] = useState<BusArrival[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isReserved, setIsReserved] = useState(false);
  const [reservedBus, setReservedBus] = useState<string>('');
  const [countdown, setCountdown] = useState(5);
  const [currentSlide, setCurrentSlide] = useState(0);

  // 목데이터 - 서울시 버스 노선
  const mockRoutes: BusRoute[] = [
    {
      id: '1',
      routeNumber: '150',
      routeName: '강남역 ↔ 숙대입구',
      color: '#0066CC',
      company: '서울버스',
      interval: 8,
      firstBusTime: '05:30',
      lastBusTime: '23:30'
    },
    {
      id: '2',
      routeNumber: '402',
      routeName: '홍대입구 ↔ 숙대입구',
      color: '#33CC33',
      company: '대한운수',
      interval: 12,
      firstBusTime: '05:00',
      lastBusTime: '24:00'
    },
    {
      id: '3',
      routeNumber: '271',
      routeName: '이태원 ↔ 숙대입구',
      color: '#FF6600',
      company: '서울교통',
      interval: 15,
      firstBusTime: '06:00',
      lastBusTime: '22:30'
    },
    {
      id: '4',
      routeNumber: '4212',
      routeName: '사당역 ↔ 강남역',
      color: '#33CC33',
      company: '경기운수',
      interval: 10,
      firstBusTime: '05:20',
      lastBusTime: '23:50'
    },
    {
      id: '5',
      routeNumber: '1002',
      routeName: '김포공항 ↔ 강남역',
      color: '#8B4513',
      company: '공항버스',
      interval: 20,
      firstBusTime: '05:40',
      lastBusTime: '22:00'
    },
    {
      id: '6',
      routeNumber: '간선101',
      routeName: '서울역 ↔ 잠실역',
      color: '#0066CC',
      company: '서울시내버스',
      interval: 6,
      firstBusTime: '05:00',
      lastBusTime: '24:00'
    },
    {
      id: '7',
      routeNumber: '506',
      routeName: '강남터미널 ↔ 숙대입구',
      color: '#33CC33',
      company: '대원운수',
      interval: 10,
      firstBusTime: '05:30',
      lastBusTime: '23:00'
    },
    {
      id: '8',
      routeNumber: '643',
      routeName: '신촌 ↔ 숙대입구',
      color: '#FF6600',
      company: '신성운수',
      interval: 12,
      firstBusTime: '06:00',
      lastBusTime: '22:30'
    },
    {
      id: '9',
      routeNumber: 'N16',
      routeName: '강남역 ↔ 홍대입구',
      color: '#8B4513',
      company: '심야버스',
      interval: 30,
      firstBusTime: '23:30',
      lastBusTime: '04:30'
    },
    {
      id: '10',
      routeNumber: '7016',
      routeName: '수원 ↔ 강남역',
      color: '#DC143C',
      company: '경기버스',
      interval: 15,
      firstBusTime: '05:00',
      lastBusTime: '23:30'
    }
  ];

  // 목데이터 - 실시간 버스 도착 정보
  const mockArrivals: BusArrival[] = [
    {
      routeNumber: '150',
      routeName: '강남역 ↔ 숙대입구',
      arrivalTime: 3,
      remainingStops: 2,
      busType: 'regular',
      isLast: false,
      isFull: false,
      busNumber: '서울70사1234',
      previousStop: '한강진역',
      nextStop: '이촌역'
    },
    {
      routeNumber: '150',
      routeName: '강남역 ↔ 숙대입구',
      arrivalTime: 8,
      remainingStops: 5,
      busType: 'lowFloor',
      isLast: false,
      isFull: false,
      busNumber: '서울70사5678',
      previousStop: '용산역',
      nextStop: '한강진역'
    },
    {
      routeNumber: '402',
      routeName: '홍대입구 ↔ 숙대입구',
      arrivalTime: 5,
      remainingStops: 3,
      busType: 'regular',
      isLast: false,
      isFull: true,
      busNumber: '서울70사9012',
      previousStop: '공덕역',
      nextStop: '신용산역'
    },
    {
      routeNumber: '271',
      routeName: '이태원 ↔ 숙대입구',
      arrivalTime: 12,
      remainingStops: 7,
      busType: 'articulated',
      isLast: true,
      isFull: false,
      busNumber: '서울70사3456',
      previousStop: '남영역',
      nextStop: '용산역'
    },
    {
      routeNumber: '506',
      routeName: '강남터미널 ↔ 숙대입구',
      arrivalTime: 6,
      remainingStops: 4,
      busType: 'regular',
      isLast: false,
      isFull: false,
      busNumber: '서울70사7890',
      previousStop: '서빙고역',
      nextStop: '한강진역'
    },
    {
      routeNumber: '643',
      routeName: '신촌 ↔ 숙대입구',
      arrivalTime: 15,
      remainingStops: 8,
      busType: 'lowFloor',
      isLast: false,
      isFull: true,
      busNumber: '서울70사2468',
      previousStop: '효창공원앞',
      nextStop: '용산역'
    },
    {
      routeNumber: 'N16',
      routeName: '강남역 ↔ 홍대입구',
      arrivalTime: 25,
      remainingStops: 12,
      busType: 'regular',
      isLast: false,
      isFull: false,
      busNumber: '서울70사1357',
      previousStop: '이태원역',
      nextStop: '한강진역'
    },
    {
      routeNumber: '7016',
      routeName: '수원 ↔ 강남역',
      arrivalTime: 18,
      remainingStops: 6,
      busType: 'regular',
      isLast: false,
      isFull: false,
      busNumber: '경기70사9753',
      previousStop: '노량진역',
      nextStop: '용산역'
    }
  ];

  // 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // 실시간 버스 정보 업데이트 시뮬레이션
      setBusArrivals(prev => 
        prev.map(bus => ({
          ...bus,
          arrivalTime: Math.max(0, bus.arrivalTime - 0.5),
          remainingStops: bus.arrivalTime <= 1 ? Math.max(0, bus.remainingStops - 1) : bus.remainingStops
        }))
      );
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

  // 검색어 하이라이트 함수
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} style={{ backgroundColor: 'rgba(255, 235, 59, 0.5)', fontWeight: 'bold' }}>
          {part}
        </span>
      ) : part
    );
  };

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

  // 검색 기능 (기존 버튼용)
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredRoutes([]);
      return;
    }

    const filtered = mockRoutes.filter(route =>
      route.routeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.routeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoutes(filtered);
  };

  // 노선 선택
  const handleRouteSelect = (route: BusRoute) => {
    setSelectedRoute(route);
  };

  // 버스 타입 아이콘
  const getBusTypeIcon = (type: string) => {
    switch (type) {
      case 'lowFloor': return '♿';
      case 'articulated': return '🚌🚌';
      default: return '🚌';
    }
  };

  // 시간 포맷
  const formatTime = (minutes: number) => {
    if (minutes < 1) return '곧 도착';
    return `${Math.ceil(minutes)}분`;
  };

    // 예약 완료 페이지 렌더링
  if (isReserved) {
  return (
      <div 
        onClick={returnToMain}
        style={{ 
          padding: '40px 20px', 
          background: '#ffffff',
          minHeight: '100vh',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          color: '#111827',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >

        
        {/* 성공 아이콘 */}
        <div style={{
          width: '120px',
          height: '120px',
          background: 'linear-gradient(135deg, #4ade80, #22c55e)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 40px auto',
          boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          <div style={{
            fontSize: '60px',
            fontWeight: '700',
            color: 'white'
          }}>
            ✓
          </div>
        </div>
        
        <h1 style={{
          fontSize: '48px',
          fontWeight: '800',
          marginBottom: '16px',
          margin: '0 0 16px 0',
          color: '#111827'
        }}>
          호출 완료!
        </h1>
        
        <div style={{
          fontSize: '20px',
          marginBottom: '40px',
          opacity: '0.7',
          fontWeight: '500',
          color: '#6b7280'
        }}>
          버스가 성공적으로 호출되었습니다
        </div>
        
        <div style={{
          marginBottom: '40px'
        }}>
          <div style={{
            fontSize: '18px',
            opacity: '0.6',
            marginBottom: '12px',
            fontWeight: '500',
            color: '#6b7280'
          }}>
            호출된 버스
          </div>
          <div style={{
            fontSize: '56px',
            fontWeight: '800',
            color: '#f59e0b',
            marginBottom: '8px'
          }}>
            {reservedBus}번
          </div>
        </div>
        
        <div style={{
          fontSize: '24px',
          marginBottom: '50px',
          lineHeight: '1.6',
          fontWeight: '500',
          color: '#374151'
        }}>
          곧 도착할 예정입니다<br/>
          잠시만 기다려주세요
              </div>
        
        {/* 카운트다운 */}
        <div style={{
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '12px'
          }}>
            <div style={{
              fontSize: '64px',
              fontWeight: '800',
              color: '#f59e0b'
            }}>
              {countdown}
              </div>
            <div style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#6b7280'
            }}>
              초 후 자동 복귀
            </div>
          </div>
        </div>
        
        <div style={{
          fontSize: '16px',
          opacity: '0.6',
          fontWeight: '500',
          color: '#9ca3af'
        }}>
          화면을 터치하면 즉시 돌아갑니다
        </div>
        
        <style>
          {`
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '0', 
      background: '#ffffff',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 헤더 */}
      <div style={{
        background: '#1e40af',
        color: 'white',
        padding: '24px 20px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        <h1 style={{ 
          margin: '0',
          fontSize: '28px',
          fontWeight: '700',
          textAlign: 'center'
        }}>
          숙대입구
        </h1>
      </div>
      
      <div style={{ padding: '20px' }}>
      
      {/* 현재 시간 */}
      <div style={{ 
        marginBottom: '32px',
        padding: '20px',
        background: '#f0f9ff',
        border: '3px solid #0ea5e9',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: '20px', 
          color: '#0369a1',
          marginBottom: '8px',
          fontWeight: '600'
        }}>
          현재 시각
        </div>
        <div style={{ 
          fontSize: '32px',
          fontWeight: '700',
          color: '#0c4a6e'
        }}>
          {currentTime.toLocaleString('ko-KR', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      {/* 노선 검색 */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ 
          fontSize: '24px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          버스 번호 검색
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="버스번호를 입력하세요 (예: 150)"
          style={{ 
            padding: '20px 24px', 
            border: '3px solid #d1d5db', 
            borderRadius: '12px',
            fontSize: '24px',
            outline: 'none',
            textAlign: 'center',
            fontWeight: '600',
            width: '100%',
            boxSizing: 'border-box'
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              if (searchTerm.trim()) {
                handleReservation(searchTerm.trim());
              }
            }
          }}
          onFocus={(e) => e.target.style.borderColor = '#2563eb'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
        />
              </div>

      {/* 검색 결과 */}
      {filteredRoutes.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ 
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              transition: 'transform 0.5s ease-in-out',
              transform: `translateX(-${currentSlide * 100}%)`
            }}>
              {Array.from({ length: Math.ceil(filteredRoutes.length / 4) }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  style={{
                    minWidth: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    padding: '0 10px',
                    boxSizing: 'border-box'
                  }}
                >
                                    {filteredRoutes
                    .slice(slideIndex * 4, (slideIndex + 1) * 4)
                    .map((route) => {
                      const routeArrivals = mockArrivals.filter(arrival => arrival.routeNumber === route.routeNumber);
                      const nextArrival = routeArrivals.sort((a, b) => a.arrivalTime - b.arrivalTime)[0]; // 가장 빠른 버스
                      
                      return routeArrivals.length > 0 ? (
                        // 실시간 도착 정보가 있는 경우 - 가장 빠른 버스 표시
                        <div
                          key={`${route.id}-search`}
                          onClick={() => handleRouteSelect(route)}
                          style={{
                            padding: '20px',
                            background: 'white',
                            border: selectedRoute?.id === route.id ? '4px solid #2563eb' : '3px solid #e5e7eb',
                            borderRadius: '16px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{
                                background: route.color,
                                color: 'white',
                                padding: '10px 14px',
                                borderRadius: '10px',
                                fontWeight: '700',
                                fontSize: '16px',
                                minWidth: '60px',
                                textAlign: 'center'
                              }}>
                                {highlightSearchTerm(route.routeNumber, searchTerm)}
                              </div>
                              <div>
                                <div style={{ fontWeight: '700', marginBottom: '6px', color: '#111827', fontSize: '16px' }}>
                                  {highlightSearchTerm(route.routeName, searchTerm)}
                                </div>
                                <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                                  다음 버스: {nextArrival.busNumber}
                                  {nextArrival.busType === 'lowFloor' && ' • 저상버스'}
                                  {nextArrival.busType === 'articulated' && ' • 굴절버스'}
                                  {nextArrival.isLast && ' • 막차'}
                                  {nextArrival.isFull && ' • 만차'}
                                </div>
                                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                                  {nextArrival.previousStop} → 숙대입구 → {nextArrival.nextStop}
                                </div>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ 
                                fontSize: '22px', 
                                fontWeight: '700', 
                                color: nextArrival.arrivalTime <= 3 ? '#dc2626' : '#059669',
                                marginBottom: '2px'
                              }}>
                                {formatTime(nextArrival.arrivalTime)}
                              </div>
                              <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>
                                {nextArrival.remainingStops}정거장 전
                              </div>
                            </div>
                          </div>
                    </div>
                      ) : (
                        // 실시간 도착 정보가 없는 경우 - 기본 노선 정보만 표시
                        <div
                          key={route.id}
                          onClick={() => handleRouteSelect(route)}
                          style={{
                            padding: '20px',
                            background: 'white',
                            border: selectedRoute?.id === route.id ? '4px solid #2563eb' : '3px solid #e5e7eb',
                            borderRadius: '16px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                              background: route.color,
                              color: 'white',
                              padding: '10px 14px',
                              borderRadius: '10px',
                              fontWeight: '700',
                              fontSize: '16px',
                              minWidth: '60px',
                              textAlign: 'center'
                            }}>
                              {highlightSearchTerm(route.routeNumber, searchTerm)}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: '700', marginBottom: '6px', color: '#111827', fontSize: '16px' }}>
                                {highlightSearchTerm(route.routeName, searchTerm)}
                              </div>
                              <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                                {route.company} • 배차간격 {route.interval}분
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
                  </div>
            
            {/* 슬라이드 인디케이터 */}
            {filteredRoutes.length > 4 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '16px'
              }}>
                {Array.from({ length: Math.ceil(filteredRoutes.length / 4) }).map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: currentSlide === index ? '#059669' : '#d1d5db',
                      cursor: 'pointer',
                      transition: 'background 0.3s'
                    }}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 실시간 버스 도착 정보 - 검색어가 없을 때만 표시 */}
      {!searchTerm.trim() && (
      <div>
        <div style={{ 
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            transition: 'transform 0.5s ease-in-out',
            transform: `translateX(-${currentSlide * 100}%)`
          }}>
            {Array.from({ length: Math.ceil(mockArrivals.reduce((unique: BusArrival[], bus) => {
              const existingBus = unique.find(b => b.routeNumber === bus.routeNumber);
              if (!existingBus || bus.arrivalTime < existingBus.arrivalTime) {
                return unique.filter(b => b.routeNumber !== bus.routeNumber).concat(bus);
              }
              return unique;
            }, []).length / 4) }).map((_, slideIndex) => (
              <div
                key={slideIndex}
                style={{
                  minWidth: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  padding: '0 10px',
                  boxSizing: 'border-box'
                }}
              >
                {mockArrivals
                  .reduce((unique: BusArrival[], bus) => {
                    const existingBus = unique.find(b => b.routeNumber === bus.routeNumber);
                    if (!existingBus || bus.arrivalTime < existingBus.arrivalTime) {
                      return unique.filter(b => b.routeNumber !== bus.routeNumber).concat(bus);
                    }
                    return unique;
                  }, [])
                  .slice(slideIndex * 4, (slideIndex + 1) * 4)
                  .map((bus, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '20px',
                        background: 'white',
                        border: '3px solid #e5e7eb',
                        borderRadius: '16px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{
                            background: mockRoutes.find(r => r.routeNumber === bus.routeNumber)?.color || '#666',
                            color: 'white',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            fontWeight: '700',
                            fontSize: '16px',
                            minWidth: '60px',
                            textAlign: 'center'
                          }}>
                            {bus.routeNumber}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', marginBottom: '6px', color: '#111827', fontSize: '16px' }}>
                              {bus.routeName}
                            </div>
                            <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                              {bus.busNumber}
                              {bus.busType === 'lowFloor' && ' • 저상버스'}
                              {bus.busType === 'articulated' && ' • 굴절버스'}
                              {bus.isLast && ' • 막차'}
                              {bus.isFull && ' • 만차'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                              {bus.previousStop} → 숙대입구 → {bus.nextStop}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ 
                            fontSize: '22px', 
                            fontWeight: '700', 
                            color: bus.arrivalTime <= 3 ? '#dc2626' : '#059669',
                            marginBottom: '2px'
                          }}>
                            {formatTime(bus.arrivalTime)}
                          </div>
                          <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>
                            {bus.remainingStops}정거장 전
                          </div>
                        </div>
              </div>
            </div>
          ))}
        </div>
            ))}
          </div>
          
                    {/* 슬라이드 인디케이터 */}
          {mockArrivals.reduce((unique: BusArrival[], bus) => {
            const existingBus = unique.find(b => b.routeNumber === bus.routeNumber);
            if (!existingBus || bus.arrivalTime < existingBus.arrivalTime) {
              return unique.filter(b => b.routeNumber !== bus.routeNumber).concat(bus);
            }
            return unique;
          }, []).length > 4 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '16px'
            }}>
              {Array.from({ length: Math.ceil(mockArrivals.reduce((unique: BusArrival[], bus) => {
                const existingBus = unique.find(b => b.routeNumber === bus.routeNumber);
                if (!existingBus || bus.arrivalTime < existingBus.arrivalTime) {
                  return unique.filter(b => b.routeNumber !== bus.routeNumber).concat(bus);
                }
                return unique;
              }, []).length / 4) }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: currentSlide === index ? '#059669' : '#d1d5db',
                    cursor: 'pointer',
                    transition: 'background 0.3s'
                  }}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
          </div>
          )}
        </div>
      </div>
      )}
      
      </div>
    </div>
  );
}

export default App;