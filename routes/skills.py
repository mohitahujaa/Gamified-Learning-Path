from flask import Blueprint, request, jsonify
from models.skill_graph import SkillGraph

skills_bp = Blueprint("skills", __name__)

# Initialize skill graph
graph = SkillGraph()
graph.add_skill("basics", "Basics of Computer", "Fundamentals of computer usage")
graph.add_skill("ms_office", "MS Office", "Word, Excel, PowerPoint", ["basics"])
graph.add_skill("ms_office", "MS Office", "Word, Excel, PowerPoint", ["basics"])
graph.add_skill("canva", "Canva", "Design basics with Canva", ["basics"])
graph.add_skill("powerbi", "Power BI", "Data visualization basics", ["ms_office", "canva"])
graph.add_skill("ai_tools", "AI Tools", "Using AI tools for productivity", ["basics"])

# In-memory student progress tracking
student_progress = {}

# Badge definitions
BADGES = {
    "FIRST_STEP": {
        "name": "First Step",
        "description": "Completed your first skill!",
        "icon": "🎯"
    },
    "PATH_MASTER": {
        "name": "Path Master",
        "description": "Completed all skills in the learning path!",
        "icon": "🏆"
    }
}

def calculate_points(completed_skills):
    """Calculate points based on completed skills (50 points per skill)"""
    return len(completed_skills) * 50

def calculate_badges(completed_skills):
    """Calculate badges based on user progress"""
    badges = []
    total_skills = len(graph.get_all_skills())
    
    if len(completed_skills) >= 1:
        badges.append("FIRST_STEP")
    
    if len(completed_skills) >= total_skills:
        badges.append("PATH_MASTER")
    
    return badges

@skills_bp.route("/", methods=["GET"])
def get_skills():
    skills = []
    for skill in graph.get_all_skills():
        skills.append({
            "id": skill.id,
            "name": skill.name,
            "description": skill.description,
            "prerequisites": skill.prerequisites
        })
    return jsonify({"success": True, "skills": skills})


@skills_bp.route("/unlockable", methods=["POST"])
def unlockable_skills():
    data = request.get_json()
    user_id = data.get("user_id")
    completed = data.get("completed_skills", [])
    
    # If user_id is provided, get their actual progress
    if user_id and user_id in student_progress:
        completed = student_progress[user_id]
    
    unlockable = []
    for skill in graph.get_all_skills():
        if skill.id not in completed:
            prereqs = skill.prerequisites
            if all(p in completed for p in prereqs):
                unlockable.append({
                    "id": skill.id,
                    "name": skill.name,
                    "description": skill.description
                })
    return jsonify({"success": True, "unlockable": unlockable})

@skills_bp.route("/progress", methods=["POST"])
def mark_skill_completed():
    """Mark a skill as completed for a user"""
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        skill_id = data.get("skill_id")
        
        if not user_id or not skill_id:
            return jsonify({
                "success": False,
                "error": "Missing user_id or skill_id"
            }), 400
        
        # Validate skill exists
        skill = graph.get_skill(skill_id)
        if not skill:
            return jsonify({
                "success": False,
                "error": f"Skill '{skill_id}' not found"
            }), 404
        
        # Initialize user progress if not exists
        if user_id not in student_progress:
            student_progress[user_id] = []
        
        # Check if skill is already completed
        if skill_id in student_progress[user_id]:
            return jsonify({
                "success": False,
                "error": f"Skill '{skill_id}' already completed"
            }), 400
        
        # Check prerequisites
        user_completed = student_progress[user_id]
        if not all(prereq in user_completed for prereq in skill.prerequisites):
            return jsonify({
                "success": False,
                "error": f"Prerequisites not met for skill '{skill_id}'"
            }), 400
        
        # Mark skill as completed
        student_progress[user_id].append(skill_id)
        
        # Get updated unlockable skills
        unlockable = []
        for skill in graph.get_all_skills():
            if skill.id not in student_progress[user_id]:
                prereqs = skill.prerequisites
                if all(p in student_progress[user_id] for p in prereqs):
                    unlockable.append({
                        "id": skill.id,
                        "name": skill.name,
                        "description": skill.description
                    })
        
        return jsonify({
            "success": True,
            "message": f"Skill '{skill_id}' marked as completed",
            "unlockable_skills": unlockable,
            "completed_skills": student_progress[user_id]
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@skills_bp.route("/user_summary/<user_id>", methods=["GET"])
def get_user_summary(user_id):
    """Get user progress summary including points and badges"""
    try:
        if user_id not in student_progress:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404
        
        completed_skills = student_progress[user_id]
        points = calculate_points(completed_skills)
        badge_ids = calculate_badges(completed_skills)
        
        # Get badge details
        badges = []
        for badge_id in badge_ids:
            if badge_id in BADGES:
                badges.append({
                    "id": badge_id,
                    **BADGES[badge_id]
                })
        
        return jsonify({
            "success": True,
            "user_id": user_id,
            "completed_skills": completed_skills,
            "points": points,
            "badges": badges,
            "total_skills": len(graph.get_all_skills()),
            "progress_percentage": round((len(completed_skills) / len(graph.get_all_skills())) * 100, 1)
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500 