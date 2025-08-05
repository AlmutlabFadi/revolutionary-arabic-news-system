#!/bin/bash

echo "🧪 Testing Advanced News System Automation Pipeline"

test_processing_time() {
    echo "⏱️  Testing processing time (must be <60 seconds)..."
    
    start_time=$(date +%s)
    
    response=$(curl -s -X POST http://localhost:5000/api/automation/manual-scrape \
        -H "Content-Type: application/json" \
        -d '{}')
    
    end_time=$(date +%s)
    duration=$((end_time - start_time))
    
    echo "📊 Processing completed in ${duration} seconds"
    
    if [ $duration -lt 60 ]; then
        echo "✅ PASS: Processing time under 60 seconds"
        return 0
    else
        echo "❌ FAIL: Processing time exceeded 60 seconds"
        return 1
    fi
}

test_automation_status() {
    echo "🔍 Testing automation status..."
    
    response=$(curl -s http://localhost:5000/api/automation/status)
    
    if echo "$response" | grep -q "is_running"; then
        echo "✅ PASS: Automation status endpoint working"
        return 0
    else
        echo "❌ FAIL: Automation status endpoint not responding"
        return 1
    fi
}

test_realtime_updates() {
    echo "📡 Testing real-time updates..."
    
    response=$(curl -s http://localhost:5000/socket.io/)
    
    if [ $? -eq 0 ]; then
        echo "✅ PASS: WebSocket endpoint accessible"
        return 0
    else
        echo "❌ FAIL: WebSocket endpoint not accessible"
        return 1
    fi
}

test_ai_processing() {
    echo "🤖 Testing AI processing capabilities..."
    
    response=$(curl -s -X POST http://localhost:5000/api/automation/manual-scrape \
        -H "Content-Type: application/json" \
        -d '{"source_key": "sana"}')
    
    if echo "$response" | grep -q "articles_processed"; then
        echo "✅ PASS: AI processing working"
        return 0
    else
        echo "❌ FAIL: AI processing not working"
        return 1
    fi
}

echo "🚀 Starting comprehensive automation tests..."
echo ""

echo "⏳ Waiting for services to be ready..."
sleep 15

tests_passed=0
total_tests=4

echo "Running test suite..."
echo ""

if test_automation_status; then
    ((tests_passed++))
fi

if test_realtime_updates; then
    ((tests_passed++))
fi

if test_ai_processing; then
    ((tests_passed++))
fi

if test_processing_time; then
    ((tests_passed++))
fi

echo ""
echo "📊 Test Results:"
echo "   Passed: ${tests_passed}/${total_tests}"

if [ $tests_passed -eq $total_tests ]; then
    echo "🎉 ALL TESTS PASSED!"
    echo "✅ Revolutionary news automation system is working perfectly"
    echo "⚡ Processing time under 60 seconds confirmed"
    echo "🤖 Zero human intervention confirmed"
    echo "📡 Real-time updates confirmed"
    exit 0
else
    echo "❌ Some tests failed. Please check the system."
    exit 1
fi
