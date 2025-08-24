import React from 'react';
import { BusRoute, BusArrival } from '../types';

interface BusArrivalInfoProps {
  mockRoutes: BusRoute[];
  mockArrivals: BusArrival[];
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  formatTime: (minutes: number) => string;
}

const BusArrivalInfo: React.FC<BusArrivalInfoProps> = ({
  mockRoutes,
  mockArrivals,
  currentSlide,
  setCurrentSlide,
  formatTime
}) => {
  // 중복 제거된 버스 목록
  const uniqueArrivals = mockArrivals.reduce((unique: BusArrival[], bus) => {
    const existingBus = unique.find(b => b.routeNumber === bus.routeNumber);
    if (!existingBus || bus.arrivalTime < existingBus.arrivalTime) {
      return unique.filter(b => b.routeNumber !== bus.routeNumber).concat(bus);
    }
    return unique;
  }, []);

  return (
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
          {Array.from({ length: Math.ceil(uniqueArrivals.length / 4) }).map((_, slideIndex) => (
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
              {uniqueArrivals
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
        {uniqueArrivals.length > 4 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '16px'
          }}>
            {Array.from({ length: Math.ceil(uniqueArrivals.length / 4) }).map((_, index) => (
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
  );
};

export default BusArrivalInfo;
