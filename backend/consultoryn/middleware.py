from django.conf import settings
from django.middleware.csrf import CsrfViewMiddleware
from django.http import HttpResponseForbidden

class DisableCSRFMiddleware(CsrfViewMiddleware):
    def process_view(self, request, view_func, view_args, view_kwargs):
        if request.path.startswith('/auth/'):
            return None  # Skip CSRF check for /auth/* endpoints
        return super().process_view(request, view_func, view_args, view_kwargs)
    