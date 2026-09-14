// src/components/RideTracker.tsx
interface RideTrackerProps {
  isRiding: boolean
  elapsed: string
  distance: number
  onStart: () => void
  onStop: () => void
}

const RideTracker = ({ isRiding, elapsed, distance, onStart, onStop }: RideTrackerProps) => {
  return (
    <>
      {isRiding && (
        <div style={{
          position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '8px 20px',
          borderRadius: '20px', display: 'flex', gap: '24px', zIndex: 1000, fontSize: '14px'
        }}>
          <span>⏱ {elapsed}</span>
          <span>📍 {(distance / 1000).toFixed(2)} km</span>
        </div>
      )}

      <div style={{
        position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 1000
      }}>
        <button
          onClick={isRiding ? onStop : onStart}
          style={{
            padding: '14px 40px', fontSize: '16px', fontWeight: 600,
            background: isRiding ? '#e53e3e' : '#378ADD',
            color: '#fff', border: 'none', borderRadius: '30px', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          {isRiding ? 'Stop Ride' : 'Start Ride'}
        </button>
      </div>
    </>
  )
}

export default RideTracker