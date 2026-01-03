import { useState, useEffect } from 'react';
import { UAParser } from 'ua-parser-js';
import Cookies from 'js-cookie';

export const useVisitorData = () => {
    const [visitorData, setVisitorData] = useState({
        country: null,
        countryCode: null,
        city: null,
        ip: null,
        device: null,
        browser: null,
        os: null,
        isLoading: true
    });

    useEffect(() => {
        const fetchVisitorData = async () => {
            // 1. Get Device Info
            const parser = new UAParser();
            const result = parser.getResult();
            const deviceType = result.device.type || 'desktop';

            // 2. Check Cookie for Location Data
            const cachedLocation = Cookies.get('visitor_location');

            if (cachedLocation) {
                try {
                    const parsed = JSON.parse(cachedLocation);
                    // Only use cache if it's valid (not Unknown)
                    if (parsed.country && parsed.country !== 'Unknown') {
                        setVisitorData({
                            country: parsed.country,
                            countryCode: parsed.countryCode,
                            city: null,
                            ip: null,
                            device: deviceType,
                            browser: result.browser.name,
                            os: result.os.name,
                            isLoading: false
                        });
                        return; // Valid cache found
                    }
                } catch (e) {
                    // Cookie corrupted, proceed to fetch
                }
            }

            // 3. Get Location Data (Client-Side First for accuracy)
            try {
                // Try ip2c.org (Fast, Client-side, works on localhost)
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

                const response = await fetch('https://ip2c.org/self', { signal: controller.signal });
                clearTimeout(timeoutId);

                const text = await response.text(); // Format: "1;CC;CCC;Country Name"

                if (text && text.startsWith('1;')) {
                    const parts = text.split(';');
                    const countryCode = parts[1];
                    const countryName = parts[3];

                    // Save to Cookie (30 days)
                    Cookies.set('visitor_location', JSON.stringify({
                        country: countryName,
                        countryCode: countryCode
                    }), { expires: 30 });

                    setVisitorData({
                        country: countryName,
                        countryCode: countryCode,
                        city: null, // ip2c doesn't provide city
                        ip: null,
                        device: deviceType,
                        browser: result.browser.name,
                        os: result.os.name,
                        isLoading: false
                    });
                    return;
                }
            } catch (error) {
                // Proceed to API fallback
                console.warn('IP2C Lookup failed, falling back to API:', error);
            }

            // 4. Fallback: Get Location Data (Internal API Proxy)
            try {
                // Use internal proxy to avoid AdBlockers/CSP issues
                const response = await fetch('/api/detect-location');
                if (response.ok) {
                    const data = await response.json();

                    // ... (rest of logic)

                    if (data.country && data.country !== 'Unknown') {
                        const countryName = data.country;
                        const countryCode = data.countryCode;

                        // Save to Cookie (30 days)
                        Cookies.set('visitor_location', JSON.stringify({
                            country: countryName,
                            countryCode: countryCode
                        }), { expires: 30 });

                        setVisitorData({
                            country: countryName,
                            countryCode: countryCode,
                            city: data.city || null,
                            ip: data.ip || null,
                            device: deviceType,
                            browser: result.browser.name,
                            os: result.os.name,
                            isLoading: false
                        });
                        return;
                    }
                }
                throw new Error('IP lookup failed');
            } catch (error) {
                const fallbackData = {
                    country: "Unknown",
                    countryCode: null,
                    city: "Unknown",
                    ip: null,
                    device: deviceType,
                    browser: result.browser.name,
                    os: result.os.name,
                    isLoading: false
                };
                setVisitorData(fallbackData);
            }
        };

        fetchVisitorData();
    }, []);

    return visitorData;
};
