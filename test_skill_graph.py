#!/usr/bin/env python3
"""
Test script for the SkillGraph module
"""

from models.skill_graph import skill_graph

def test_skill_graph():
    """Test the skill graph functionality"""
    print("=== Skill Graph Test ===\n")
    
    # Test 1: Get all skills
    print("1. All available skills:")
    all_skills = skill_graph.get_all_skills()
    for skill in all_skills:
        print(f"   - {skill.name} (ID: {skill.id})")
        print(f"     Description: {skill.description}")
        print(f"     Prerequisites: {skill.prerequisites}")
        print()
    
    # Test 2: Get specific skill
    print("2. Getting specific skill:")
    ms_office = skill_graph.get_skill("ms_office")
    if ms_office:
        print(f"   Found: {ms_office.name}")
        print(f"   Prerequisites: {ms_office.prerequisites}")
    print()
    
    # Test 3: Get unlockable skills with no completed skills
    print("3. Unlockable skills with no completed skills:")
    unlockable = skill_graph.get_unlockable_skills([])
    for skill in unlockable:
        print(f"   - {skill.name}")
    print()
    
    # Test 4: Get unlockable skills after completing basics
    print("4. Unlockable skills after completing 'Basics of Computer':")
    unlockable = skill_graph.get_unlockable_skills(["basics_computer"])
    for skill in unlockable:
        print(f"   - {skill.name}")
    print()
    
    # Test 5: Get unlockable skills after completing multiple skills
    print("5. Unlockable skills after completing 'Basics of Computer' and 'MS Office':")
    unlockable = skill_graph.get_unlockable_skills(["basics_computer", "ms_office"])
    for skill in unlockable:
        print(f"   - {skill.name}")
    print()
    
    # Test 6: Get prerequisites for a skill
    print("6. Prerequisites for 'AI Tools':")
    prereqs = skill_graph.get_prerequisites("ai_tools")
    for prereq in prereqs:
        print(f"   - {prereq.name}")
    print()
    
    # Test 7: Get dependent skills
    print("7. Skills that depend on 'Basics of Computer':")
    dependents = skill_graph.get_dependent_skills("basics_computer")
    for dependent in dependents:
        print(f"   - {dependent.name}")
    print()
    
    # Test 8: Add a new skill
    print("8. Adding a new skill:")
    try:
        skill_graph.add_skill(
            id="advanced_ai",
            name="Advanced AI Tools",
            description="Advanced artificial intelligence and machine learning tools",
            prerequisites=["ai_tools"]
        )
        print("   Successfully added 'Advanced AI Tools'")
        
        # Show new unlockable skills
        print("   Unlockable skills after completing 'AI Tools':")
        unlockable = skill_graph.get_unlockable_skills(["basics_computer", "ms_office", "canva", "power_bi", "ai_tools"])
        for skill in unlockable:
            print(f"     - {skill.name}")
    except ValueError as e:
        print(f"   Error: {e}")
    print()

if __name__ == "__main__":
    test_skill_graph() 