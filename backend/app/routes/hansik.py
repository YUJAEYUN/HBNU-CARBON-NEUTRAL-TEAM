from fastapi import APIRouter, HTTPException
from typing import Dict, Any, Optional
from datetime import datetime
import requests
from bs4 import BeautifulSoup

router = APIRouter(prefix="/api/hansik", tags=["hansik"])

# 간단한 예시 데이터 (실제로는 웹 스크래핑으로 대체될 예정)
menu_data = {
    "mon": {
        "date": "월요일",
        "lunch": "제육볶음\n미역국\n밥\n김치",
        "dinner": "돈까스\n된장국\n밥\n단무지"
    },
    "tue": {
        "date": "화요일",
        "lunch": "닭갈비\n콩나물국\n밥\n깍두기",
        "dinner": "비빔밥\n미소국\n김치"
    },
    "wed": {
        "date": "수요일",
        "lunch": "불고기\n시금치국\n밥\n총각김치",
        "dinner": "김치찌개\n계란말이\n밥\n무생채"
    },
    "thu": {
        "date": "목요일",
        "lunch": "고등어구이\n미소된장국\n밥\n배추김치",
        "dinner": "치킨커리\n양파스프\n밥\n피클"
    },
    "fri": {
        "date": "금요일",
        "lunch": "순대국\n메추리알장조림\n밥\n열무김치",
        "dinner": "짜장면\n군만두\n단무지"
    }
}

@router.get("/")
async def get_menu(day: Optional[str] = None):
    """
    학식 메뉴 정보를 가져옵니다.
    day 파라미터가 제공되면 해당 요일의 메뉴를 반환하고,
    그렇지 않으면 현재 요일의 메뉴를 반환합니다.
    """
    if day is None:
        # 현재 요일 계산 (0: 월요일, 6: 일요일)
        weekday = datetime.now().weekday()
        day_map = {0: "mon", 1: "tue", 2: "wed", 3: "thu", 4: "fri", 5: "sat", 6: "sun"}
        day = day_map.get(weekday, "mon")  # 기본값은 월요일
    
    if day not in menu_data:
        raise HTTPException(status_code=404, detail=f"Menu for {day} not found")
    
    return menu_data[day]

@router.get("/scrape")
async def scrape_menu(day: Optional[str] = None):
    """
    한밭대학교 홈페이지에서 학식 메뉴 정보를 스크래핑합니다.
    이 함수는 실제 구현 예시로, 실제 스크래핑 로직은 별도로 구현해야 합니다.
    """
    try:
        # 여기에 실제 스크래핑 로직을 구현합니다
        # 예시: 한밭대학교 학식 페이지 접근
        url = "https://www.hanbat.ac.kr/prog/carteGuidance/kor/sub06_030301/C1/calendar.do"
        
        # 실제 구현에서는 이 부분에 스크래핑 로직을 추가합니다
        # 지금은 예시 데이터를 반환합니다
        if day is None:
            weekday = datetime.now().weekday()
            day_map = {0: "mon", 1: "tue", 2: "wed", 3: "thu", 4: "fri", 5: "sat", 6: "sun"}
            day = day_map.get(weekday, "mon")
        
        if day not in menu_data:
            raise HTTPException(status_code=404, detail=f"Menu for {day} not found")
        
        return {
            "source": "scraping",
            "data": menu_data[day]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to scrape menu: {str(e)}")
