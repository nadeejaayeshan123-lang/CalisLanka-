import os

from django.db import models
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver


class GalleryItem(models.Model):
    """A single photo or video shown in the 'Inside the Studio' section.

    Managed entirely from the Django admin (/admin/) — staff can upload
    new items, reorder them, temporarily hide them (is_active), or
    delete them outright.
    """

    class MediaType(models.TextChoices):
        PHOTO = "photo", "Photo"
        VIDEO = "video", "Video"

    title = models.CharField(
        max_length=120,
        blank=True,
        help_text="Optional label, e.g. 'Pull-up rig' — used as alt text / caption.",
    )
    media_type = models.CharField(
        max_length=5, choices=MediaType.choices, default=MediaType.PHOTO
    )
    image = models.ImageField(
        upload_to="gallery/photos/",
        blank=True,
        null=True,
        help_text="Required for photo items.",
    )
    video = models.FileField(
        upload_to="gallery/videos/",
        blank=True,
        null=True,
        help_text="Required for video items. MP4/WebM recommended.",
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Lower numbers appear first. Photo slots 1-7 map to the "
        "homepage grid in this order.",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Uncheck to hide from the website without deleting it.",
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-uploaded_at"]

    def __str__(self):
        return self.title or f"{self.get_media_type_display()} #{self.pk}"

    @property
    def file_field(self):
        """Return whichever file field applies to this item's media type."""
        return self.image if self.media_type == self.MediaType.PHOTO else self.video


def _delete_file(field_file):
    if field_file and field_file.name and os.path.isfile(field_file.path):
        os.remove(field_file.path)


@receiver(post_delete, sender=GalleryItem)
def delete_gallery_files_on_delete(sender, instance, **kwargs):
    """Remove the uploaded file from disk when its GalleryItem is deleted."""
    _delete_file(instance.image)
    _delete_file(instance.video)


@receiver(pre_save, sender=GalleryItem)
def delete_old_file_on_change(sender, instance, **kwargs):
    """Remove the old file from disk when it's replaced with a new upload."""
    if not instance.pk:
        return
    try:
        old = GalleryItem.objects.get(pk=instance.pk)
    except GalleryItem.DoesNotExist:
        return
    if old.image and old.image != instance.image:
        _delete_file(old.image)
    if old.video and old.video != instance.video:
        _delete_file(old.video)