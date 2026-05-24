const EXT = 'jpg|jpeg|png|gif|webp|svg|avif|bmp|tiff';
const DOUBLE_EXT_RE = new RegExp(`\\.(${EXT})\\.(${EXT})$`, 'i');

export function normalizeImageUrl(url: string | null | undefined): string | null | undefined {
    if (!url) return url;
    return url.replace(DOUBLE_EXT_RE, '.$1');
}
