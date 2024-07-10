from django.db import models
from django.utils import timezone

class Todo(models.Model):
    text = models.CharField(max_length=40, null=False)
    complete = models.BooleanField(default=False, null=False)
    user = models.ForeignKey("user_auth.User", on_delete=models.CASCADE, blank=False, null=False)

    def __str__(self):
        return f"{self.text} by {self.user}"
    
class DailyLogin(models.Model):
    last_login = models.DateTimeField(null=False, default=timezone.now)
    user = models.ForeignKey("user_auth.User", on_delete=models.CASCADE, blank=False, null=False)

    def __str__(self) -> str:
        return f"{self.count} logged in on this date and time {self.last_login}"