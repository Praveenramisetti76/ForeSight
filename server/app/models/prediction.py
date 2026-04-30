"""
MongoDB document shape for the 'predictions' collection.

{
    "_id":                ObjectId,
    "user_id":            str,
    "project_type":       str,
    "team_size":          int,
    "budget":             float,
    "duration":           int,
    "stakeholder_count":  int,
    "methodology":        str,
    "team_experience":    str,
    "risk_level":         str,        # "Low" | "Medium" | "High"
    "risk_score":         float,      # model confidence 0-1
    "timestamp":          datetime,
}
"""
