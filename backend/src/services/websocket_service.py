import threading
import time
from datetime import datetime
from flask_socketio import emit
import logging

logger = logging.getLogger(__name__)

class WebSocketService:
    def __init__(self, socketio, automation_service):
        self.socketio = socketio
        self.automation_service = automation_service
        self.is_running = False
        self.update_thread = None
        
        self.setup_event_handlers()
        self.start_real_time_updates()

    def setup_event_handlers(self):
        @self.socketio.on('connect')
        def handle_connect():
            logger.info('Client connected to WebSocket')
            emit('connected', {'message': 'Connected to real-time updates'})
            
            if self.automation_service:
                status = self.automation_service.get_automation_status()
                emit('stats_update', status.get('stats', {}))

        @self.socketio.on('disconnect')
        def handle_disconnect():
            logger.info('Client disconnected from WebSocket')

        @self.socketio.on('request_stats')
        def handle_stats_request():
            if self.automation_service:
                status = self.automation_service.get_automation_status()
                emit('stats_update', status.get('stats', {}))

    def start_real_time_updates(self):
        if self.is_running:
            return
        
        self.is_running = True
        self.update_thread = threading.Thread(target=self._update_loop)
        self.update_thread.daemon = True
        self.update_thread.start()
        logger.info('Started real-time WebSocket updates')

    def stop_real_time_updates(self):
        self.is_running = False
        if self.update_thread:
            self.update_thread.join(timeout=5)
        logger.info('Stopped real-time WebSocket updates')

    def _update_loop(self):
        while self.is_running:
            try:
                self._send_stats_update()
                time.sleep(30)
            except Exception as e:
                logger.error(f'Error in WebSocket update loop: {str(e)}')
                time.sleep(60)

    def _send_stats_update(self):
        if not self.automation_service:
            return
        
        try:
            status = self.automation_service.get_automation_status()
            self.socketio.emit('stats_update', status.get('stats', {}))
        except Exception as e:
            logger.error(f'Error sending stats update: {str(e)}')

    def send_activity_update(self, activity_data):
        try:
            self.socketio.emit('activity_update', {
                'id': int(time.time()),
                'type': activity_data.get('type', 'info'),
                'title': activity_data.get('title', ''),
                'time': datetime.utcnow().isoformat(),
                'status': activity_data.get('status', 'info')
            })
        except Exception as e:
            logger.error(f'Error sending activity update: {str(e)}')

    def send_alert(self, alert_data):
        try:
            self.socketio.emit('alert', {
                'id': int(time.time()),
                'type': alert_data.get('type', 'info'),
                'message': alert_data.get('message', ''),
                'timestamp': datetime.utcnow().isoformat(),
                'severity': alert_data.get('severity', 'info')
            })
        except Exception as e:
            logger.error(f'Error sending alert: {str(e)}')
