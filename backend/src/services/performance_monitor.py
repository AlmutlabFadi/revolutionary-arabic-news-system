import time
import logging
from datetime import datetime
from typing import Dict, Any
from functools import wraps

logger = logging.getLogger(__name__)

class PerformanceMonitor:
    def __init__(self):
        self.metrics = {}
        self.processing_times = []
        self.max_processing_time = 60  # 60 seconds limit
    
    def time_function(self, func_name: str = None):
        """Decorator to time function execution"""
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                start_time = time.time()
                
                try:
                    result = func(*args, **kwargs)
                    success = True
                except Exception as e:
                    logger.error(f"Function {func.__name__} failed: {str(e)}")
                    success = False
                    raise
                finally:
                    end_time = time.time()
                    duration = end_time - start_time
                    
                    function_name = func_name or func.__name__
                    self.record_metric(function_name, duration, success)
                    
                    if duration > self.max_processing_time:
                        logger.warning(f"Function {function_name} exceeded time limit: {duration:.2f}s > {self.max_processing_time}s")
                
                return result
            return wrapper
        return decorator
    
    def record_metric(self, name: str, duration: float, success: bool = True):
        """Record a performance metric"""
        if name not in self.metrics:
            self.metrics[name] = {
                'total_calls': 0,
                'total_time': 0,
                'avg_time': 0,
                'min_time': float('inf'),
                'max_time': 0,
                'success_count': 0,
                'failure_count': 0
            }
        
        metric = self.metrics[name]
        metric['total_calls'] += 1
        metric['total_time'] += duration
        metric['avg_time'] = metric['total_time'] / metric['total_calls']
        metric['min_time'] = min(metric['min_time'], duration)
        metric['max_time'] = max(metric['max_time'], duration)
        
        if success:
            metric['success_count'] += 1
        else:
            metric['failure_count'] += 1
        
        if 'process' in name.lower() or 'automation' in name.lower():
            self.processing_times.append({
                'timestamp': datetime.utcnow(),
                'duration': duration,
                'function': name,
                'success': success
            })
            
            if len(self.processing_times) > 100:
                self.processing_times = self.processing_times[-100:]
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get all performance metrics"""
        return {
            'metrics': self.metrics,
            'recent_processing_times': self.processing_times[-10:],
            'avg_processing_time': self.get_avg_processing_time(),
            'max_processing_time_limit': self.max_processing_time,
            'performance_status': self.get_performance_status()
        }
    
    def get_avg_processing_time(self) -> float:
        """Get average processing time for automation functions"""
        automation_times = [
            p['duration'] for p in self.processing_times 
            if p['success'] and ('process' in p['function'].lower() or 'automation' in p['function'].lower())
        ]
        
        if not automation_times:
            return 0.0
        
        return sum(automation_times) / len(automation_times)
    
    def get_performance_status(self) -> str:
        """Get overall performance status"""
        avg_time = self.get_avg_processing_time()
        
        if avg_time == 0:
            return 'no_data'
        elif avg_time < 30:
            return 'excellent'
        elif avg_time < 45:
            return 'good'
        elif avg_time < 60:
            return 'acceptable'
        else:
            return 'poor'
    
    def reset_metrics(self):
        """Reset all metrics"""
        self.metrics = {}
        self.processing_times = []

performance_monitor = PerformanceMonitor()
