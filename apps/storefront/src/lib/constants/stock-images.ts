/**
 * Generic fallback photo for a real product that has no photo of its own
 * yet (e.g. just created in Admin, before someone uploads the real shot).
 * Sourced from Pexels (pexels.com/license — free for commercial/e-commerce
 * use, no attribution required, no identifiable people in the photo) and
 * re-hosted on our own Supabase Storage bucket rather than hotlinked, so it
 * doesn't depend on an external CDN staying up.
 *
 * This must never be used in place of a real product photo when one
 * exists — only as a last-resort fallback — and the UI must say so
 * ("Immagine rappresentativa") so a customer is never misled about what
 * they're actually buying.
 */
export const PRODUCT_IMAGE_FALLBACK_URL =
  "https://zbonndqouhzsjlxeslne.supabase.co/storage/v1/object/public/lottico-media-bucket/eyewear-fallback-01M505C8ZF3HZ2RCM8VRJQY2VM.jpg"
