import DOMPurify from 'isomorphic-dompurify';

export const cleanHtml = (html) => {
    if (!html || typeof html !== 'string') return '';

    // Configure DOMPurify to allow specific tags and attributes required for rich text
    // but disallow script execution.
    const clean = DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true },
        ADD_TAGS: ['iframe', 'img'], // Allow iframes for embeds, validation logic below recommended
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target', 'class', 'style'],
    });

    // Post-processing for additional safety/styling if needed
    // e.g., wrapping iframes, enforcing https
    return clean;
};
