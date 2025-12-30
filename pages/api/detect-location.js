export default async function handler(req, res) {
    // get IP from headers (Next.js / Vercel / Nginx standard)
    // get IP from headers (Prioritize Cloudflare, then X-Forwarded-For, then Remote)
    // get IP from headers (Prioritize Cloudflare, then Real IP, then X-Forwarded-For, then Remote)
    const ip = req.headers['cf-connecting-ip'] ||
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for']?.split(',')[0] ||
        req.socket.remoteAddress;

    try {
        // Fetch from freeipapi.com (Server-to-Server)
        // Note: freeipapi uses the IP in the URL path for lookup
        const lookupUrl = ip && ip.length > 6 ? `https://freeipapi.com/api/json/${ip}` : 'https://freeipapi.com/api/json';

        const response = await fetch(lookupUrl);

        if (!response.ok) {
            throw new Error(`Upstream Error: ${response.status}`);
        }

        const data = await response.json();

        // Return simplified structure matching useVisitorData expectation
        return res.status(200).json({
            country: data.countryName || 'Unknown',
            countryCode: data.countryCode || null,
            city: data.cityName || null,
            ip: data.ipAddress || ip
        });

    } catch (error) {
        console.error('API Proxy Error:', error);
        // Fallback to Unknown rather than 500
        return res.status(200).json({
            country: 'Unknown',
            countryCode: null,
            city: 'Unknown',
            ip: ip
        });
    }
}
