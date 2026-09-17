from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.db import models
from django.db.models import Q
from django.core.files.storage import default_storage


class GalleryItem(models.Model):
    """
    Admin-managed media used on the public CalisLanka homepage.

    Photos can be used for:
    - Hero banner
    - One of the 7 studio gallery positions

    Videos are used in the studio video section.
    """

    class MediaType(models.TextChoices):
        PHOTO = "photo", "Photo"
        VIDEO = "video", "Video"

    class Placement(models.TextChoices):
        HERO = "hero", "Hero banner"
        GALLERY = "gallery", "Inside the Studio"

    title = models.CharField(
        max_length=120,
        blank=True,
        help_text="Optional label used as image alt text or video caption.",
    )

    media_type = models.CharField(
        max_length=5,
        choices=MediaType.choices,
        default=MediaType.PHOTO,
    )

    placement = models.CharField(
        max_length=7,
        choices=Placement.choices,
        default=Placement.GALLERY,
        help_text="Where this media appears on the homepage.",
    )

    image = models.ImageField(
        upload_to="gallery/photos/",
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(
                allowed_extensions=["jpg", "jpeg", "png", "webp"]
            )
        ],
        help_text="Required when media type is Photo.",
    )

    video = models.FileField(
        upload_to="gallery/videos/",
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(
                allowed_extensions=["mp4", "webm", "mov"]
            )
        ],
        help_text="Required when media type is Video.",
    )

    order = models.PositiveIntegerField(
        default=1,
        help_text="Studio gallery position: 1 to 7. Ignored for the hero.",
    )

    is_active = models.BooleanField(
        default=True,
        help_text="Uncheck this to hide the item from the public website.",
    )

    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["placement", "order", "-uploaded_at"]

        constraints = [
            models.UniqueConstraint(
                fields=["placement", "order"],
                condition=Q(placement="gallery"),
                name="unique_gallery_slot",
            ),
        ]

    def __str__(self):
        return self.title or f"{self.get_media_type_display()} #{self.pk}"

    @property
    def file_field(self):
        if self.media_type == self.MediaType.PHOTO:
            return self.image
        return self.video

    @property
    def slot_label(self):
        if self.placement == self.Placement.HERO:
            return "Hero banner"
        return f"Gallery #{self.order}"

    def clean(self):
        errors = {}

        # ---------------------------------------------------------
        # PHOTO VALIDATION
        # ---------------------------------------------------------
        if self.media_type == self.MediaType.PHOTO:
            if not self.image:
                errors["image"] = "A photo must be uploaded."

            if self.video:
                errors["video"] = (
                    "Remove the video when the media type is Photo."
                )

        # ---------------------------------------------------------
        # VIDEO VALIDATION
        # ---------------------------------------------------------
        elif self.media_type == self.MediaType.VIDEO:
            if not self.video:
                errors["video"] = "A video must be uploaded."

            if self.image:
                errors["image"] = (
                    "Remove the photo when the media type is Video."
                )

        # ---------------------------------------------------------
        # HERO VALIDATION
        # ---------------------------------------------------------
        if self.placement == self.Placement.HERO:
            if self.media_type != self.MediaType.PHOTO:
                errors["media_type"] = (
                    "The hero banner must use a photo."
                )

        # ---------------------------------------------------------
        # GALLERY SLOT VALIDATION
        # ---------------------------------------------------------
        if self.placement == self.Placement.GALLERY:
            if not 1 <= self.order <= 7:
                errors["order"] = (
                    "Studio gallery position must be between 1 and 7."
                )

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)


def delete_stored_file(field_file):
    """
    Delete a stored file using Django's storage backend.
    """
    if field_file and field_file.name:
        storage = field_file.storage

        if storage.exists(field_file.name):
            storage.delete(field_file.name)


def delete_old_gallery_file(instance, field_name, old_name):
    """
    Delete an old uploaded file after it has been replaced.
    """
    if not old_name:
        return

    new_file = getattr(instance, field_name)

    if new_file and new_file.name == old_name:
        return

    default_storage.delete(old_name)


from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver


@receiver(post_delete, sender=GalleryItem)
def delete_gallery_files_on_delete(sender, instance, **kwargs):
    """
    Remove uploaded files when a GalleryItem is deleted.
    """
    delete_stored_file(instance.image)
    delete_stored_file(instance.video)


@receiver(pre_save, sender=GalleryItem)
def delete_old_gallery_files_on_change(sender, instance, **kwargs):
    """
    Remove the previous uploaded file when an admin replaces it.
    """
    if not instance.pk:
        return

    try:
        old_instance = GalleryItem.objects.get(pk=instance.pk)
    except GalleryItem.DoesNotExist:
        return

    if (
        old_instance.image
        and old_instance.image.name != getattr(instance.image, "name", None)
    ):
        delete_stored_file(old_instance.image)

    if (
        old_instance.video
        and old_instance.video.name != getattr(instance.video, "name", None)
    ):
        delete_stored_file(old_instance.video)