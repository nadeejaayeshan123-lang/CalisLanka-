from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.db import models
from django.db.models import Q
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver


class GalleryItem(models.Model):
    """
    Admin-managed media used on the public CalisLanka homepage.

    Photos can be used for:
    - Hero banner
    - One of the 7 studio gallery positions

    Videos are used in:
    - The studio video section
    """

    # ---------------------------------------------------------
    # UPLOAD LIMITS
    # ---------------------------------------------------------

    MAX_IMAGE_SIZE = 5 * 1024 * 1024       # 5 MB
    MAX_VIDEO_SIZE = 50 * 1024 * 1024      # 50 MB

    # ---------------------------------------------------------
    # MEDIA TYPES
    # ---------------------------------------------------------

    class MediaType(models.TextChoices):
        PHOTO = "photo", "Photo"
        VIDEO = "video", "Video"

    # ---------------------------------------------------------
    # HOMEPAGE PLACEMENTS
    # ---------------------------------------------------------

    class Placement(models.TextChoices):
        HERO = "hero", "Hero banner"
        GALLERY = "gallery", "Inside the Studio"

    # ---------------------------------------------------------
    # BASIC INFORMATION
    # ---------------------------------------------------------

    title = models.CharField(
        max_length=120,
        blank=True,
        help_text=(
            "Optional label used as image alt text "
            "or video caption."
        ),
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

    # ---------------------------------------------------------
    # IMAGE UPLOAD
    # ---------------------------------------------------------

    image = models.ImageField(
        upload_to="gallery/photos/",
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(
                allowed_extensions=[
                    "jpg",
                    "jpeg",
                    "png",
                    "webp",
                ]
            )
        ],
        help_text=(
            "Required for Photo items. "
            "JPG, JPEG, PNG or WebP. Maximum 5 MB."
        ),
    )

    # ---------------------------------------------------------
    # VIDEO UPLOAD
    # ---------------------------------------------------------

    video = models.FileField(
        upload_to="gallery/videos/",
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(
                allowed_extensions=[
                    "mp4",
                    "webm",
                    "mov",
                ]
            )
        ],
        help_text=(
            "Required for Video items. "
            "MP4, WebM or MOV. Maximum 50 MB."
        ),
    )

    # ---------------------------------------------------------
    # GALLERY POSITION
    # ---------------------------------------------------------

    order = models.PositiveIntegerField(
        default=1,
        help_text=(
            "Studio gallery position: 1 to 7. "
            "Used for gallery photos only. "
            "Ignored for the hero banner and videos."
        ),
    )

    # ---------------------------------------------------------
    # ACTIVE / INACTIVE
    # ---------------------------------------------------------

    is_active = models.BooleanField(
        default=True,
        help_text=(
            "Uncheck this to hide the item "
            "from the public website."
        ),
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True,
    )

    # ---------------------------------------------------------
    # DATABASE SETTINGS
    # ---------------------------------------------------------

    class Meta:
        ordering = [
            "placement",
            "order",
            "-uploaded_at",
        ]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "placement",
                    "order",
                ],
                condition=Q(
                    placement="gallery",
                    media_type="photo",
                ),
                name="unique_gallery_photo_slot",
            ),
        ]

    # ---------------------------------------------------------
    # STRING REPRESENTATION
    # ---------------------------------------------------------

    def __str__(self):
        return (
            self.title
            or f"{self.get_media_type_display()} #{self.pk}"
        )

    # ---------------------------------------------------------
    # FILE HELPER
    # ---------------------------------------------------------

    @property
    def file_field(self):
        if self.media_type == self.MediaType.PHOTO:
            return self.image

        return self.video

    # ---------------------------------------------------------
    # ADMIN SLOT LABEL
    # ---------------------------------------------------------

    @property
    def slot_label(self):
        if self.placement == self.Placement.HERO:
            return "Hero banner"

        if self.media_type == self.MediaType.VIDEO:
            return "Studio video"

        return f"Gallery #{self.order}"

    # ---------------------------------------------------------
    # VALIDATION
    # ---------------------------------------------------------

    def clean(self):
        errors = {}

        # -----------------------------------------------------
        # PHOTO VALIDATION
        # -----------------------------------------------------

        if self.media_type == self.MediaType.PHOTO:

            if not self.image:
                errors["image"] = (
                    "A photo must be uploaded."
                )

            if self.video:
                errors["video"] = (
                    "Remove the video when the media type "
                    "is Photo."
                )

        # -----------------------------------------------------
        # VIDEO VALIDATION
        # -----------------------------------------------------

        elif self.media_type == self.MediaType.VIDEO:

            if not self.video:
                errors["video"] = (
                    "A video must be uploaded."
                )

            if self.image:
                errors["image"] = (
                    "Remove the photo when the media type "
                    "is Video."
                )

            if self.placement != self.Placement.GALLERY:
                errors["placement"] = (
                    "Videos can only be used in the "
                    "Inside the Studio gallery."
                )

        # -----------------------------------------------------
        # HERO VALIDATION
        # -----------------------------------------------------

        if self.placement == self.Placement.HERO:

            if self.media_type != self.MediaType.PHOTO:
                errors["media_type"] = (
                    "The hero banner must use a photo."
                )

        # -----------------------------------------------------
        # GALLERY PHOTO SLOT VALIDATION
        # -----------------------------------------------------

        if (
            self.placement == self.Placement.GALLERY
            and self.media_type == self.MediaType.PHOTO
        ):
            if not 1 <= self.order <= 7:
                errors["order"] = (
                    "Studio gallery position must be "
                    "between 1 and 7."
                )

        # -----------------------------------------------------
        # FILE SIZE VALIDATION
        # -----------------------------------------------------

        if self.image and getattr(self.image, "size", None):
            if self.image.size > self.MAX_IMAGE_SIZE:
                errors["image"] = (
                    "Image file size cannot exceed 5 MB."
                )

        if self.video and getattr(self.video, "size", None):
            if self.video.size > self.MAX_VIDEO_SIZE:
                errors["video"] = (
                    "Video file size cannot exceed 50 MB."
                )

        # -----------------------------------------------------
        # HERO ORDER
        # -----------------------------------------------------

        if self.placement == self.Placement.HERO:
            self.order = 0

        # -----------------------------------------------------
        # RETURN VALIDATION ERRORS
        # -----------------------------------------------------

        if errors:
            raise ValidationError(errors)

    # ---------------------------------------------------------
    # SAVE
    # ---------------------------------------------------------

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)


# =============================================================
# FILE DELETION HELPERS
# =============================================================

def delete_stored_file(field_file):
    """
    Delete a stored file using Django's configured
    storage backend.
    """

    if not field_file or not field_file.name:
        return

    storage = field_file.storage

    if storage.exists(field_file.name):
        storage.delete(field_file.name)


# =============================================================
# DELETE FILES WHEN GALLERY ITEM IS DELETED
# =============================================================

@receiver(post_delete, sender=GalleryItem)
def delete_gallery_files_on_delete(
    sender,
    instance,
    **kwargs,
):
    """
    Remove uploaded files when a GalleryItem is deleted.
    """

    delete_stored_file(instance.image)
    delete_stored_file(instance.video)


# =============================================================
# DELETE OLD FILES WHEN MEDIA IS REPLACED
# =============================================================

@receiver(pre_save, sender=GalleryItem)
def delete_old_gallery_files_on_change(
    sender,
    instance,
    **kwargs,
):
    """
    Remove the previous uploaded file when an admin
    replaces it.
    """

    if not instance.pk:
        return

    try:
        old_instance = GalleryItem.objects.get(
            pk=instance.pk
        )
    except GalleryItem.DoesNotExist:
        return

    old_image_name = (
        old_instance.image.name
        if old_instance.image
        else None
    )

    new_image_name = (
        instance.image.name
        if instance.image
        else None
    )

    if old_image_name and old_image_name != new_image_name:
        delete_stored_file(old_instance.image)

    old_video_name = (
        old_instance.video.name
        if old_instance.video
        else None
    )

    new_video_name = (
        instance.video.name
        if instance.video
        else None
    )

    if old_video_name and old_video_name != new_video_name:
        delete_stored_file(old_instance.video)