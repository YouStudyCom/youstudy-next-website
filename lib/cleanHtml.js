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



    // Post-processing: Wrap iframes in a professional responsive container
    let processed = clean.replace(
        /(<iframe.*?>.*?<\/iframe>)/g,
        '<div class="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl my-10 border border-slate-200 bg-slate-100">$1</div>'
    );

    // Ensure iframe fills the container
    processed = processed.replace(
        /<iframe/g,
        '<iframe class="absolute inset-0 w-full h-full"'
    );

    return processed;
};
