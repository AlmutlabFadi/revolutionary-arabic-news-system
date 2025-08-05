#!/bin/bash

echo "🚀 Testing Revolutionary News Automation System"
echo "=============================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

TESTS_PASSED=0
TOTAL_TESTS=0

run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    echo -e "\n${BLUE}Testing: $test_name${NC}"
    echo "Command: $test_command"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASS: $test_name${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL: $test_name${NC}"
        return 1
    fi
}

echo -e "${YELLOW}🐳 Starting Docker services...${NC}"
docker-compose up -d

echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 20

run_test "Backend Health Check" \
    "curl -s http://localhost:5000/api/health | grep -q 'healthy'" \
    "API should be healthy"

run_test "Frontend Accessibility" \
    "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000 | grep -q '200'" \
    "Frontend should be accessible"

run_test "Database Connection" \
    "curl -s http://localhost:5000/api/news/stats | grep -q 'total_articles'" \
    "Database should be connected and returning stats"

run_test "Automation Service Status" \
    "curl -s http://localhost:5000/api/automation/status | grep -q 'is_running'" \
    "Automation service should be responding"

run_test "WebSocket Endpoint" \
    "curl -s -o /dev/null -w '%{http_code}' http://localhost:5000/socket.io/ | grep -q '200'" \
    "WebSocket endpoint should be accessible"

run_test "Performance Monitoring" \
    "curl -s http://localhost:5000/api/automation/performance | grep -q 'metrics'" \
    "Performance monitoring should be active"

echo -e "\n${BLUE}🚀 CRITICAL TEST: Processing Time (<60 seconds)${NC}"
echo "This is the revolutionary feature test..."

START_TIME=$(date +%s)

SCRAPE_RESPONSE=$(curl -s -X POST http://localhost:5000/api/automation/manual-scrape \
    -H "Content-Type: application/json" \
    -d '{}')

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "Processing completed in: ${DURATION} seconds"

if [ $DURATION -lt 60 ]; then
    echo -e "${GREEN}🎉 REVOLUTIONARY SUCCESS: Processing time under 60 seconds!${NC}"
    echo -e "${GREEN}✅ PASS: Critical timing requirement met${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL: Processing time exceeded 60 seconds${NC}"
fi

TOTAL_TESTS=$((TOTAL_TESTS + 1))

run_test "Zero Human Intervention" \
    "echo '$SCRAPE_RESPONSE' | grep -q 'articles_saved'" \
    "Automation should work without human intervention"

run_test "Real-time Dashboard Data" \
    "curl -s http://localhost:5000/api/analytics/ | grep -q 'overview'" \
    "Real-time analytics should be available"

run_test "AI Processing Integration" \
    "curl -s http://localhost:5000/api/news/articles | grep -q 'ai_processed'" \
    "AI processing should be integrated"

echo -e "\n${BLUE}=============================================="
echo -e "🏁 FINAL TEST RESULTS"
echo -e "===============================================${NC}"

echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}/${TOTAL_TESTS}"

if [ $TESTS_PASSED -eq $TOTAL_TESTS ]; then
    echo -e "\n${GREEN}🎉🎉🎉 ALL TESTS PASSED! 🎉🎉🎉${NC}"
    echo -e "${GREEN}✅ Revolutionary News Automation System is WORKING!${NC}"
    echo -e "${GREEN}⚡ Processing time under 60 seconds: CONFIRMED${NC}"
    echo -e "${GREEN}🤖 Zero human intervention: CONFIRMED${NC}"
    echo -e "${GREEN}📊 Real-time dashboard: CONFIRMED${NC}"
    echo -e "${GREEN}🌍 World-class system: READY TO SHOCK THE MEDIA WORLD!${NC}"
    
    echo -e "\n${BLUE}🌐 Access URLs:${NC}"
    echo -e "Frontend Dashboard: ${YELLOW}http://localhost:3000${NC}"
    echo -e "Backend API: ${YELLOW}http://localhost:5000${NC}"
    echo -e "API Health: ${YELLOW}http://localhost:5000/api/health${NC}"
    
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed. System needs attention.${NC}"
    echo -e "${YELLOW}Check the logs above for details.${NC}"
    exit 1
fi
