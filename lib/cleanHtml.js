import sanitizeHtml from 'sanitize-html';

export const cleanHtml = (html) => {
    if (!html || typeof html !== 'string') return '';

    // sanitize-html configuration
    const clean = sanitizeHtml(html, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe']),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            'iframe': ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'scrolling', 'class', 'style'],
            'img': ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading', 'class', 'style'],
            '*': ['style', 'class', 'dir', 'lang'] // Allow global styling/structure attributes if needed
        },
        allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com', 'www.google.com'], // Optional: Restrict iframes
    });

    return clean;
};
