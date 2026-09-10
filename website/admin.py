from django.contrib import admin
from django.utils.html import format_html

from .models import GalleryItem


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ("preview", "slot", "title", "media_type", "is_active", "uploaded_at")
    list_display_links = ("preview", "slot", "title")
    list_editable = ("is_active",)
    list_filter = ("placement", "media_type", "is_active")
    search_fields = ("title",)
    ordering = ("placement", "order", "-uploaded_at")
    fields = ("placement", "media_type", "title", "image", "video", "order", "is_active")

    @admin.display(description="Preview")
    def preview(self, obj):
        if obj.media_type == GalleryItem.MediaType.PHOTO and obj.image:
            return format_html(
                '<img src="{}" style="height:56px;width:auto;border-radius:6px;'
                'object-fit:cover;" />',
                obj.image.url,
            )
        if obj.media_type == GalleryItem.MediaType.VIDEO and obj.video:
            return format_html(
                '<video src="{}" style="height:56px;width:auto;border-radius:6px;" '
                'muted></video>',
                obj.video.url,
            )
        return "—"

    @admin.display(description="Slot", ordering="order")
    def slot(self, obj):
        return obj.slot_label
