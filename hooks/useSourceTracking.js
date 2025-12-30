import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const SUPPORTED_CHANNELS = ['youtube', 'inquiry', 'facebook', 'twitter', 'whatsapp', 'advertisementfb'];
const COOKIE_NAME_SOURCE_ID = 'source_id';
const COOKIE_NAME_CHANNEL = 'source_channel';
const DEFAULT_SOURCE_ID = 4; // Fallback default (e.g. "Website/Direct")

export function useSourceTracking() {
    const router = useRouter();
    const [sourceData, setSourceData] = useState({
        sourceId: DEFAULT_SOURCE_ID,
        channel: null
    });

    useEffect(() => {
        if (!router.isReady) return;

        const { query } = router;
        let foundChannel = null;
        let newSourceId = null;

        // 1. Check URL parameters for supported channels (Case Insensitive)
        const queryKeys = Object.keys(query);
        for (const key of queryKeys) {
            const lowerKey = key.toLowerCase();
            const matchedChannel = SUPPORTED_CHANNELS.find(ch => ch.toLowerCase() === lowerKey);

            if (matchedChannel) {
                const val = parseInt(query[key], 10);
                if (!isNaN(val)) {
                    foundChannel = matchedChannel;
                    newSourceId = val;
                    break; // Priority: take the first valid match
                }
            }
        }

        // 2. Logic: URL > Cookie > Default
        if (newSourceId) {
            // Found in URL -> Update Cookie & State
            Cookies.set(COOKIE_NAME_SOURCE_ID, newSourceId, { expires: 30 }); // 30 days
            Cookies.set(COOKIE_NAME_CHANNEL, foundChannel, { expires: 30 });

            setSourceData({
                sourceId: newSourceId,
                channel: foundChannel
            });
        } else {
            // Not in URL -> Try Cookie
            const cookieSourceId = Cookies.get(COOKIE_NAME_SOURCE_ID);
            const cookieChannel = Cookies.get(COOKIE_NAME_CHANNEL);

            if (cookieSourceId) {
                const val = parseInt(cookieSourceId, 10);
                if (!isNaN(val)) {
                    setSourceData({
                        sourceId: val,
                        channel: cookieChannel || null
                    });
                }
            }
        }
    }, [router.isReady, router.query]);

    return sourceData;
}
