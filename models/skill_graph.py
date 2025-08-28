from typing import List, Dict, Set, Optional
from dataclasses import dataclass

@dataclass
class Skill:
    """Represents a skill in the learning path graph"""
    id: str
    name: str
    description: str
    prerequisites: List[str]

class SkillGraph:
    """A directed graph representing skill dependencies"""
    
    def __init__(self):
        self.skills: Dict[str, Skill] = {}
        self._initialize_sample_data()
    
    def add_skill(self, id: str, name: str, description: str, prerequisites: List[str] = []) -> None:
        """
        Add a new skill to the graph
        
        Args:
            id: Unique identifier for the skill
            name: Display name of the skill
            description: Description of what the skill covers
            prerequisites: List of skill IDs that must be completed first
        """
        # Validate that all prerequisites exist
        for prereq_id in prerequisites:
            if prereq_id not in self.skills:
                raise ValueError(f"Prerequisite skill '{prereq_id}' does not exist")
        
        self.skills[id] = Skill(
            id=id,
            name=name,
            description=description,
            prerequisites=prerequisites.copy()
        )
    
    def get_skill(self, id: str) -> Optional[Skill]:
        """
        Get a skill by its ID
        
        Args:
            id: The skill ID to look up
            
        Returns:
            The Skill object if found, None otherwise
        """
        return self.skills.get(id)
    
    def get_all_skills(self) -> List[Skill]:
        """
        Get all skills in the graph
        
        Returns:
            List of all Skill objects
        """
        return list(self.skills.values())
    
    def get_unlockable_skills(self, completed_skills: List[str]) -> List[Skill]:
        """
        Get skills that can be unlocked based on completed skills
        
        Args:
            completed_skills: List of skill IDs that have been completed
            
        Returns:
            List of Skill objects that can now be unlocked
        """
        unlockable = []
        completed_set = set(completed_skills)
        
        for skill in self.skills.values():
            # Skip if already completed
            if skill.id in completed_set:
                continue
            
            # Check if all prerequisites are satisfied
            if all(prereq in completed_set for prereq in skill.prerequisites):
                unlockable.append(skill)
        
        return unlockable
    
    def get_prerequisites(self, skill_id: str) -> List[Skill]:
        """
        Get all prerequisite skills for a given skill
        
        Args:
            skill_id: The ID of the skill to get prerequisites for
            
        Returns:
            List of prerequisite Skill objects
        """
        skill = self.get_skill(skill_id)
        if not skill:
            return []
        
        return [self.skills[prereq_id] for prereq_id in skill.prerequisites if prereq_id in self.skills]
    
    def get_dependent_skills(self, skill_id: str) -> List[Skill]:
        """
        Get all skills that depend on the given skill
        
        Args:
            skill_id: The ID of the skill to find dependents for
            
        Returns:
            List of Skill objects that depend on the given skill
        """
        dependents = []
        for skill in self.skills.values():
            if skill_id in skill.prerequisites:
                dependents.append(skill)
        
        return dependents
    
    def _initialize_sample_data(self) -> None:
        """Initialize the graph with sample skill data"""
        sample_skills = [
            {
                "id": "basics_computer",
                "name": "Basics of Computer",
                "description": "Fundamental computer literacy including basic operations, file management, and internet usage",
                "prerequisites": []
            },
            {
                "id": "ms_office",
                "name": "MS Office",
                "description": "Microsoft Office suite including Word, Excel, PowerPoint, and Outlook",
                "prerequisites": ["basics_computer"]
            },
            {
                "id": "canva",
                "name": "Canva",
                "description": "Graphic design tool for creating visual content, presentations, and marketing materials",
                "prerequisites": ["basics_computer"]
            },
            {
                "id": "power_bi",
                "name": "Power BI",
                "description": "Business intelligence and data visualization tool for creating interactive reports and dashboards",
                "prerequisites": ["ms_office"]
            },
            {
                "id": "ai_tools",
                "name": "AI Tools",
                "description": "Artificial intelligence tools and platforms for automation, content creation, and data analysis",
                "prerequisites": ["canva", "power_bi"]
            }
        ]
        
        # Add all sample skills to the graph
        for skill_data in sample_skills:
            self.add_skill(
                id=skill_data["id"],
                name=skill_data["name"],
                description=skill_data["description"],
                prerequisites=skill_data["prerequisites"]
            )

# Create a global instance for easy access
skill_graph = SkillGraph() 