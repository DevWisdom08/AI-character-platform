"""
BaZi (八字) Calculator - MVP Version
This is a simplified mock version for MVP demonstration.
TODO: Integrate real lunar-python library and true solar time calculations.
"""

from datetime import datetime
from typing import Dict, List, Tuple
import random


# Chinese Stems and Branches
HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

# Ten Gods (十神)
TEN_GODS = [
    "比肩", "劫财", "食神", "伤官", 
    "偏财", "正财", "七杀", "正官", 
    "偏印", "正印"
]

# Five Elements
FIVE_ELEMENTS = ["木", "火", "土", "金", "水"]

# Hidden Stems mapping (simplified)
HIDDEN_STEMS_MAP = {
    "子": ["癸"],
    "丑": ["己", "癸", "辛"],
    "寅": ["甲", "丙", "戊"],
    "卯": ["乙"],
    "辰": ["戊", "乙", "癸"],
    "巳": ["丙", "戊", "庚"],
    "午": ["丁", "己"],
    "未": ["己", "丁", "乙"],
    "申": ["庚", "壬", "戊"],
    "酉": ["辛"],
    "戌": ["戊", "辛", "丁"],
    "亥": ["壬", "甲"],
}


class BaZiCalculator:
    """Mock BaZi Calculator for MVP"""
    
    @staticmethod
    def calculate_pillar(year: int, month: int, day: int, hour: int) -> Dict:
        """
        Calculate BaZi pillars based on birth date/time.
        This is a SIMPLIFIED MOCK version for MVP.
        """
        
        # Year Pillar (based on year)
        year_stem_idx = (year - 4) % 10
        year_branch_idx = (year - 4) % 12
        year_stem = HEAVENLY_STEMS[year_stem_idx]
        year_branch = EARTHLY_BRANCHES[year_branch_idx]
        
        # Month Pillar (simplified calculation)
        month_stem_idx = (year_stem_idx * 2 + month) % 10
        month_branch_idx = (month + 1) % 12
        month_stem = HEAVENLY_STEMS[month_stem_idx]
        month_branch = EARTHLY_BRANCHES[month_branch_idx]
        
        # Day Pillar (simplified - should use accurate calendar)
        day_stem_idx = (year + month + day) % 10
        day_branch_idx = (year + month + day) % 12
        day_stem = HEAVENLY_STEMS[day_stem_idx]
        day_branch = EARTHLY_BRANCHES[day_branch_idx]
        
        # Hour Pillar
        hour_branch_idx = (hour + 1) // 2 % 12
        hour_stem_idx = (day_stem_idx * 2 + hour_branch_idx) % 10
        hour_stem = HEAVENLY_STEMS[hour_stem_idx]
        hour_branch = EARTHLY_BRANCHES[hour_branch_idx]
        
        return {
            "year_pillar": {
                "stem": year_stem,
                "branch": year_branch,
                "hidden_stems": HIDDEN_STEMS_MAP[year_branch],
                "ten_god": random.choice(TEN_GODS)
            },
            "month_pillar": {
                "stem": month_stem,
                "branch": month_branch,
                "hidden_stems": HIDDEN_STEMS_MAP[month_branch],
                "ten_god": random.choice(TEN_GODS)
            },
            "day_pillar": {
                "stem": day_stem,
                "branch": day_branch,
                "hidden_stems": HIDDEN_STEMS_MAP[day_branch],
                "ten_god": "日主"
            },
            "hour_pillar": {
                "stem": hour_stem,
                "branch": hour_branch,
                "hidden_stems": HIDDEN_STEMS_MAP[hour_branch],
                "ten_god": random.choice(TEN_GODS)
            },
            "day_master": day_stem,
            "bazi_string": f"{year_stem}{year_branch} {month_stem}{month_branch} {day_stem}{day_branch} {hour_stem}{hour_branch}"
        }
    
    @staticmethod
    def get_element_from_stem(stem: str) -> str:
        """Get five element from heavenly stem"""
        element_map = {
            "甲": "木", "乙": "木",
            "丙": "火", "丁": "火",
            "戊": "土", "己": "土",
            "庚": "金", "辛": "金",
            "壬": "水", "癸": "水"
        }
        return element_map.get(stem, "未知")
    
    @staticmethod
    def generate_personality_summary(bazi_data: Dict, gender: str) -> str:
        """Generate personality summary based on BaZi (simplified)"""
        day_master = bazi_data["day_master"]
        element = BaZiCalculator.get_element_from_stem(day_master)
        
        summaries = {
            "木": "性格积极上进，富有创造力，善于沟通。像树木一样充满生机，向往自由与成长。",
            "火": "热情开朗，充满活力，具有领导魅力。像火焰一样照亮他人，富有感染力。",
            "土": "稳重踏实，值得信赖，具有包容心。像大地一样厚德载物，沉稳可靠。",
            "金": "果断刚毅，原则性强，追求完美。像金属一样坚硬，有主见且执行力强。",
            "水": "聪慧灵活，适应力强，富有智慧。像水一样灵动，善于变通与思考。"
        }
        
        return summaries.get(element, "性格独特，魅力非凡。")


def calculate_bazi_profile(
    birth_year: int,
    birth_month: int,
    birth_day: int,
    birth_hour: int,
    birth_minute: int,
    gender: str,
    use_true_solar_time: bool = True
) -> Dict:
    """
    Main function to calculate complete BaZi profile.
    Returns a dictionary with all BaZi data.
    """
    
    # TODO: Implement true solar time adjustment if use_true_solar_time is True
    # TODO: Use lunar-python library for accurate calculations
    
    bazi_data = BaZiCalculator.calculate_pillar(
        birth_year, birth_month, birth_day, birth_hour
    )
    
    primary_element = BaZiCalculator.get_element_from_stem(bazi_data["day_master"])
    personality_summary = BaZiCalculator.generate_personality_summary(bazi_data, gender)
    
    return {
        **bazi_data,
        "primary_element": primary_element,
        "personality_summary": personality_summary
    }

