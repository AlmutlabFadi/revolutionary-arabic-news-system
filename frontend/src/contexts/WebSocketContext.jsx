import React, { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const WebSocketContext = createContext()

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }
  return context
}

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [realTimeData, setRealTimeData] = useState({
    stats: null,
    activities: [],
    alerts: []
  })

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    })

    newSocket.on('connect', () => {
      setConnected(true)
      console.log('WebSocket connected')
    })

    newSocket.on('disconnect', () => {
      setConnected(false)
      console.log('WebSocket disconnected')
    })

    newSocket.on('stats_update', (data) => {
      setRealTimeData(prev => ({ ...prev, stats: data }))
    })

    newSocket.on('activity_update', (data) => {
      setRealTimeData(prev => ({ 
        ...prev, 
        activities: [data, ...prev.activities.slice(0, 9)]
      }))
    })

    newSocket.on('alert', (data) => {
      setRealTimeData(prev => ({ 
        ...prev, 
        alerts: [data, ...prev.alerts.slice(0, 4)]
      }))
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const value = {
    socket,
    connected,
    realTimeData,
    emit: (event, data) => socket?.emit(event, data)
  }

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}
