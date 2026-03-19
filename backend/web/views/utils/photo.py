import os

from django.conf import settings


def remove_old_photo(photo):
    if photo and photo.name != 'user/photos/default.jpg': #删掉旧头像但是不删除默认头像
        old_path = settings.MEDIA_ROOT / photo.name
        if os.path.exists(old_path):
            os.remove(old_path)