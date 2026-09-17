from django.shortcuts import render

from .models import GalleryItem


_PLACEHOLDER_HERO = {
    "url": "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=1400&q=90",
    "title": "CalisLanka athlete",
}

_PLACEHOLDER_PHOTOS = [
    {
        "url": "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=88",
        "title": "CalisLanka photo 1",
    },
    {
        "url": "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=88",
        "title": "CalisLanka photo 2",
    },
    {
        "url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=88",
        "title": "CalisLanka photo 3",
    },
    {
        "url": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=88",
        "title": "CalisLanka photo 4",
    },
    {
        "url": "https://images.unsplash.com/photo-1596357395217-80de13130e92?auto=format&fit=crop&w=1200&q=88",
        "title": "CalisLanka photo 5",
    },
    {
        "url": "https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=1200&q=88",
        "title": "CalisLanka photo 6",
    },
    {
        "url": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=88",
        "title": "CalisLanka photo 7",
    },
]


def home(request):
    # Hero image
    hero_item = (
        GalleryItem.objects.filter(
            placement=GalleryItem.Placement.HERO,
            media_type=GalleryItem.MediaType.PHOTO,
            is_active=True,
        )
        .order_by("-uploaded_at")
        .first()
    )

    if hero_item and hero_item.image:
        hero_photo = {
            "url": hero_item.image.url,
            "title": hero_item.title or "CalisLanka athlete",
        }
    else:
        hero_photo = _PLACEHOLDER_HERO

    # Seven studio gallery positions
    gallery_items = GalleryItem.objects.filter(
        placement=GalleryItem.Placement.GALLERY,
        media_type=GalleryItem.MediaType.PHOTO,
        is_active=True,
        order__gte=1,
        order__lte=7,
    )

    gallery_by_slot = {
        item.order: item
        for item in gallery_items
        if item.image
    }

    studio_photos = []

    for slot in range(1, 8):
        item = gallery_by_slot.get(slot)

        if item:
            studio_photos.append(
                {
                    "slot": slot,
                    "url": item.image.url,
                    "title": item.title or f"CalisLanka photo {slot}",
                }
            )
        else:
            placeholder = _PLACEHOLDER_PHOTOS[slot - 1]

            studio_photos.append(
                {
                    "slot": slot,
                    "url": placeholder["url"],
                    "title": placeholder["title"],
                }
            )

    # Studio videos
    studio_videos = GalleryItem.objects.filter(
        placement=GalleryItem.Placement.GALLERY,
        media_type=GalleryItem.MediaType.VIDEO,
        is_active=True,
    ).order_by("order", "-uploaded_at")

    return render(
        request,
        "website/home.html",
        {
            "hero_photo": hero_photo,
            "studio_photos": studio_photos,
            "studio_videos": studio_videos,
        },
    )


def blog(request):
    return render(request, "website/blog.html")


def appointment(request):
    return render(request, "website/appointment.html")