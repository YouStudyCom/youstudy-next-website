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
                    return; // Stop here, no API call needed
                } catch (e) {
                    // Cookie corrupted, proceed to fetch
                }
            }

            // 3. Get Location Data (Privacy-friendly IP lookup)
            try {
                // Using ip2c.org as requested
                // Response format: 1;ISO2;ISO3;Country Name
                const response = await fetch('https://ip2c.org/s');
                const textData = await response.text();
                const parts = textData.split(';');

                let countryName = null;
                let countryCode = null;

                if (parts[0] === '1') {
                    countryCode = parts[1]; // ISO2
                    countryName = parts[3]; // Full Name
                } else {
                    throw new Error('IP2C lookup failed or IP unknown');
                }

                // Save to Cookie (30 days)
                Cookies.set('visitor_location', JSON.stringify({
                    country: countryName,
                    countryCode: countryCode
                }), { expires: 30 });

                setVisitorData({
                    country: countryName,
                    countryCode: countryCode,
                    city: null,
                    ip: null,
                    device: deviceType,
                    browser: result.browser.name,
                    os: result.os.name,
                    isLoading: false
                });

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
