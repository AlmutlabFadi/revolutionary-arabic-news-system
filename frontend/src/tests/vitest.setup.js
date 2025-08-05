import '@testing-library/jest-dom'
import { vi } from 'vitest'

global.WebSocket = class WebSocket {
  constructor() {
    this.readyState = 1
  }
  
  send() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
}

vi.mock('socket.io-client', () => ({
  default: () => ({
    on: vi.fn(),
    emit: vi.fn(),
    close: vi.fn(),
    connected: true
  })
}))
