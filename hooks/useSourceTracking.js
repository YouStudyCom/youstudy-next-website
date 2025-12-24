import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const SUPPORTED_CHANNELS = ['youtube', 'inquiry', 'facebook', 'twitter', 'whatsapp'];
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

        // 1. Check URL parameters for supported channels
        for (const channel of SUPPORTED_CHANNELS) {
            if (query[channel] !== undefined) {
                const val = parseInt(query[channel], 10);
                if (!isNaN(val)) {
                    foundChannel = channel;
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
