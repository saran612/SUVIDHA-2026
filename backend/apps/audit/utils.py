from .models import AuditLog

def log_audit(user, action_type, entity_type, entity_id=None, ip=None, details=None):
    AuditLog.objects.create(
        user=user if user and user.is_authenticated else None,
        action_type=action_type,
        entity_type=entity_type,
        entity_id=str(entity_id) if entity_id else None,
        ip_address=ip,
        details=details or {}
    )
