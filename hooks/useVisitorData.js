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
                // Using freeipapi.com (allows commercial use)
                const response = await fetch('https://freeipapi.com/api/json');
                if (response.ok) {
                    const data = await response.json();

                    if (data.countryName) {
                        const countryName = data.countryName;
                        const countryCode = data.countryCode;

                        // Save to Cookie (30 days)
                        Cookies.set('visitor_location', JSON.stringify({
                            country: countryName,
                            countryCode: countryCode
                        }), { expires: 30 });

                        setVisitorData({
                            country: countryName,
                            countryCode: countryCode,
                            city: data.cityName || null,
                            ip: data.ipAddress || null,
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
