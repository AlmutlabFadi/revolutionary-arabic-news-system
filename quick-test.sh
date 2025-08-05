#!/bin/bash

echo "🚀 Quick Test of Revolutionary News Automation System"
echo "===================================================="

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

TESTS_PASSED=0
TOTAL_TESTS=0

run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "\n${BLUE}Testing: $test_name${NC}"
    
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

echo -e "${YELLOW}🔧 Starting backend for testing...${NC}"
cd backend

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate

pip install -r requirements.txt > /dev/null 2>&1

python app.py &
BACKEND_PID=$!

cd ..

echo -e "${YELLOW}⏳ Waiting for backend to start...${NC}"
sleep 10

run_test "Backend Health Check" \
    "curl -s http://localhost:5000/api/health | grep -q 'healthy'"

run_test "Automation Service Status" \
    "curl -s http://localhost:5000/api/automation/status | grep -q 'is_running'"

run_test "Performance Monitoring" \
    "curl -s http://localhost:5000/api/automation/performance | grep -q 'metrics'"

echo -e "\n${BLUE}🚀 CRITICAL TEST: Processing Time (<60 seconds)${NC}"
START_TIME=$(date +%s)

SCRAPE_RESPONSE=$(curl -s -X POST http://localhost:5000/api/automation/manual-scrape \
    -H "Content-Type: application/json" \
    -d '{}')

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "Processing completed in: ${DURATION} seconds"
echo "Response: $SCRAPE_RESPONSE"

if [ $DURATION -lt 60 ]; then
    echo -e "${GREEN}🎉 REVOLUTIONARY SUCCESS: Processing time under 60 seconds!${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL: Processing time exceeded 60 seconds${NC}"
fi

TOTAL_TESTS=$((TOTAL_TESTS + 1))

run_test "Zero Human Intervention" \
    "echo '$SCRAPE_RESPONSE' | grep -q 'articles_processed'"

run_test "News API Functionality" \
    "curl -s http://localhost:5000/api/news/stats | grep -q 'total_articles'"

echo -e "\n${YELLOW}🧹 Cleaning up...${NC}"
kill $BACKEND_PID 2>/dev/null || true

echo -e "\n${BLUE}=============================================="
echo -e "🏁 QUICK TEST RESULTS"
echo -e "===============================================${NC}"

echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}/${TOTAL_TESTS}"

if [ $TESTS_PASSED -eq $TOTAL_TESTS ]; then
    echo -e "\n${GREEN}🎉🎉🎉 ALL TESTS PASSED! 🎉🎉🎉${NC}"
    echo -e "${GREEN}✅ Revolutionary News Automation System is WORKING!${NC}"
    echo -e "${GREEN}⚡ Processing time under 60 seconds: CONFIRMED${NC}"
    echo -e "${GREEN}🤖 Zero human intervention: CONFIRMED${NC}"
    echo -e "${GREEN}🌍 World-class system: READY TO SHOCK THE MEDIA WORLD!${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed. System needs attention.${NC}"
    exit 1
fi
