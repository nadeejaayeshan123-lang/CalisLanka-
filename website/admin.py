import re

from django import forms
from django.contrib import admin
from django.utils.html import format_html

from .models import GalleryItem


class GalleryItemAdminForm(forms.ModelForm):
    class Meta:
        model = GalleryItem
        fields = "__all__"

    def clean(self):
        cleaned_data = super().clean()

        media_type = cleaned_data.get("media_type")
        image = cleaned_data.get("image")
        video = cleaned_data.get("video")

        if media_type == GalleryItem.MediaType.PHOTO:
            if not image:
                self.add_error(
                    "image",
                    "Please upload an image for a photo item.",
                )

            if video:
                self.add_error(
                    "video",
                    "Remove the video. Photo items should only contain an image.",
                )

        elif media_type == GalleryItem.MediaType.VIDEO:
            if not video:
                self.add_error(
                    "video",
                    "Please upload a video for a video item.",
                )

            if image:
                self.add_error(
                    "image",
                    "Remove the image. Video items should only contain a video.",
                )

        return cleaned_data


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    form = GalleryItemAdminForm

    list_display = (
        "preview",
        "slot",
        "title",
        "media_type",
        "placement",
        "is_active",
        "uploaded_at",
    )

    list_display_links = (
        "preview",
        "slot",
        "title",
    )

    list_editable = (
        "is_active",
    )

    list_filter = (
        "placement",
        "media_type",
        "is_active",
    )

    search_fields = (
        "title",
        "placement",
        "media_type"
    )

    search_help_text = (
        "Try: Hero, Gallery, Gallery 1-7, Photo, Video, or a media title."
    )

    ordering = (
        "placement",
        "order",
        "-uploaded_at",
    )

    fields = (
        "placement",
        "media_type",
        "title",
        "image",
        "video",
        "order",
        "is_active",
    )

    @admin.display(description="Preview")
    def preview(self, obj):
        if obj.media_type == GalleryItem.MediaType.PHOTO and obj.image:
            return format_html(
                '<img src="{}" '
                'style="height:56px;width:100px;border-radius:6px;'
                'object-fit:cover;" />',
                obj.image.url,
            )

        if obj.media_type == GalleryItem.MediaType.VIDEO and obj.video:
            return format_html(
                '<video src="{}" '
                'style="height:56px;width:100px;border-radius:6px;'
                'object-fit:cover;" muted></video>',
                obj.video.url,
            )

        return "—"

    @admin.display(description="Slot", ordering="order")
    def slot(self, obj):
        return obj.slot_label


    def get_search_results(self, request, queryset, search_term):
        term = " ".join(search_term.lower().split())

        # Hero
        if term in {"hero", "hero banner"}:
            return (
                queryset.filter(
                    placement=GalleryItem.Placement.HERO,
                ),
                False,
            )

        # All gallery items
        if term in {"gallery", "inside the studio", "studio"}:
            return (
                queryset.filter(
                    placement=GalleryItem.Placement.GALLERY,
                ),
                False,
            )

        # Gallery 1 through Gallery 7
        gallery_match = re.fullmatch(
            r"(?:gallery|photo)\s*#?\s*([1-7])",
            term,
        )

        if gallery_match:
            slot_number = int(gallery_match.group(1))

            return (
                queryset.filter(
                    placement=GalleryItem.Placement.GALLERY,
                    media_type=GalleryItem.MediaType.PHOTO,
                    order=slot_number,
                ),
                False,
            )

        # All photos
        if term in {"photo", "photos", "image", "images"}:
            return (
                queryset.filter(
                    media_type=GalleryItem.MediaType.PHOTO,
                ),
                False,
            )

        # All videos
        if term in {"video", "videos"}:
            return (
                queryset.filter(
                    media_type=GalleryItem.MediaType.VIDEO,
                ),
                False,
            )

        # Normal Django title/field search
        return super().get_search_results(
            request,
            queryset,
            search_term,
        )