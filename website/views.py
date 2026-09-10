from django.shortcuts import render

from .models import GalleryItem

# Shown only until the first real photos are uploaded from /admin/, so the
# gallery never looks broken/empty on a fresh install.
_PLACEHOLDER_PHOTOS = [
    {"url": "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=88", "title": "CalisLanka photo 1"},
    {"url": "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=88", "title": "CalisLanka photo 2"},
    {"url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=88", "title": "CalisLanka photo 3"},
    {"url": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=88", "title": "CalisLanka photo 4"},
    {"url": "https://images.unsplash.com/photo-1596357395217-80de13130e92?auto=format&fit=crop&w=1200&q=88", "title": "CalisLanka photo 5"},
    {"url": "https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=1200&q=88", "title": "CalisLanka photo 6"},
    {"url": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=88", "title": "CalisLanka photo 7"},
]


def home(request):
    photos = list(
        GalleryItem.objects.filter(media_type=GalleryItem.MediaType.PHOTO, is_active=True)[:7]
    )
    studio_photos = (
        [{"url": p.image.url, "title": p.title or f"CalisLanka photo {i}"} for i, p in enumerate(photos, start=1)]
        if photos
        else _PLACEHOLDER_PHOTOS
    )

    studio_videos = GalleryItem.objects.filter(
        media_type=GalleryItem.MediaType.VIDEO, is_active=True
    )

    return render(
        request,
        "website/home.html",
        {"studio_photos": studio_photos, "studio_videos": studio_videos},
    )


def blog(request):
    return render(request, "website/blog.html")


def appointment(request):
    return render(request, "website/appointment.html")