from django.core.exceptions import ValidationError
import re

class PasswordStrengthValidator:
    def __init__(self):
        self.min_length = 8

    def validate(self, password, user=None):
        if len(password) < self.min_length:
            raise ValidationError(
                f'Password must be at least {self.min_length} characters long',
                code='password_too_short'
            )
        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                'Password must contain at least one uppercase letter',
                code='password_no_uppercase'
            )
        if not re.search(r'[a-z]', password):
            raise ValidationError(
                'Password must contain at least one lowercase letter',
                code='password_no_lowercase'
            )
        if not re.search(r'[0-9]', password):
            raise ValidationError(
                'Password must contain at least one number',
                code='password_no_number'
            )
        if not re.search(r'[!@#$%^&*]', password):
            raise ValidationError(
                'Password must contain at least one special character',
                code='password_no_special'
            )

    def get_help_text(self):
        return (
            f'Password must be at least {self.min_length} characters long, '
            'contain at least one uppercase letter, one lowercase letter, '
            'one number, and one special character (!@#$%^&*).'
        )
    