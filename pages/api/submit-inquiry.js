import { UAParser } from 'ua-parser-js';
import { siteConfig } from '../../data/siteConfig.mjs';
import { countries } from '../../data/countries';

import rateLimit from '../../lib/rateLimit';

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500000, // Max 500,000 users per minute (High capacity)
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Get IP (Prioritize Cloudflare, then Real IP, then Forwarded, then Remote)
    let ip = req.headers['cf-connecting-ip'];
    let ipSource = 'cf-connecting-ip';

    if (!ip) {
        ip = req.headers['x-real-ip'];
        ipSource = 'x-real-ip';
    }
    if (!ip) {
        ip = req.headers['x-forwarded-for']?.split(',')[0];
        ipSource = 'x-forwarded-for';
    }
    if (!ip) {
        ip = req.socket.remoteAddress;
        ipSource = 'remoteAddress';
    }

    // Rate Limiting (20 requests per minute per IP - Relaxed for Carrier NAT)
    try {
        await limiter.check(res, 20, 'CACHE_TOKEN' + ip);
    } catch {
        return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    try {
        const { name, email, mobile, message, pageUrl, selectedCountry, residenceCountry, studyLevel, visitorData, sourceId, referrerId, schoolId, event_id } = req.body;

        // 1. Authenticate to get Token
        // NOTE: In a real production environment, we should cache this token
        // to avoid logging in on every single request. Using simpler flow for now.
        const authResponse = await fetch(`${siteConfig.api.baseUrl.crm}${siteConfig.api.endpoints.crm.login}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: siteConfig.auth.crm.email,
                password: siteConfig.auth.crm.password
            })
        });

        if (!authResponse.ok) {
            throw new Error('Failed to authenticate with CRM');
        }

        const authBody = await authResponse.text();
        let authData;
        try {
            authData = JSON.parse(authBody);
        } catch (e) {
            console.error('Auth JSON Parse Error:', authBody);
            throw new Error(`Auth Endpoint returned non-JSON: ${authBody.substring(0, 100)}...`);
        }
        const token = authData.data?.token || authData.token; // Handle potential response structures

        if (!token) {
            throw new Error('No access token received');
        }

        // 2. Prepare Data Payload
        const nameParts = (name || '').trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;

        // Meta Data for Note
        // Meta Data for Note
        const userAgent = req.headers['user-agent'] || 'Unknown';

        let detectedCountryName = visitorData?.country || 'Unknown';
        let detectedCountryCode = visitorData?.countryCode || 'N/A';

        // Server-Side Fallback for Geolocation if client failed
        if (!detectedCountryName || detectedCountryName === 'Unknown' || detectedCountryName === 'N/A') {

            // 1. Try Cloudflare Header (Fastest & Most Accurate)
            const cfCountry = req.headers['cf-ipcountry'];
            if (cfCountry && cfCountry.length === 2 && cfCountry !== 'XX') {
                const normalizedCode = cfCountry.toUpperCase();
                const matched = countries.find(c => c.code === normalizedCode);
                if (matched) {
                    detectedCountryName = matched.name.en;
                    detectedCountryCode = matched.code;
                } else {
                    detectedCountryCode = normalizedCode; // Use code even if name not found
                }
            }

            // 2. Fallback to IP Lookup (freeipapi.com)
            if ((!detectedCountryCode || detectedCountryCode === 'N/A') && ip && ip.length > 6) {
                try {
                    // Using freeipapi.com (allows commercial use, limit 60/min)
                    const geoRes = await fetch(`https://freeipapi.com/api/json/${ip}`);
                    if (geoRes.ok) {
                        const geoData = await geoRes.json();
                        if (geoData.countryName) {
                            detectedCountryName = geoData.countryName;
                            detectedCountryCode = geoData.countryCode; // ISO2

                            // Save to Cookie for future requests (Server-side Set-Cookie)
                            // Expires in 30 days (2592000 seconds)
                            // We must encode the JSON value
                            const cookieValue = JSON.stringify({
                                country: detectedCountryName,
                                countryCode: detectedCountryCode
                            });
                            res.setHeader('Set-Cookie', `visitor_location=${encodeURIComponent(cookieValue)}; Path=/; Max-Age=2592000; SameSite=Lax`);
                        }
                    }
                } catch (e) {
                    console.warn('Server-side IP lookup failed:', e.message);
                }
            }
        }

        // 3. Fallback: Infer from Mobile Code (e.g. +966 -> Saudi Arabia)
        // Useful for Localhost/VPN where IP lookup fails but user selected a code
        if ((!detectedCountryName || detectedCountryName === 'Unknown') && req.body.mobileCountryCode) {
            const rawCode = req.body.mobileCountryCode.trim(); // e.g. "+966"
            // Find country with this dial code
            const matchedStats = countries.find(c => c.dialCode === rawCode);
            if (matchedStats) {
                detectedCountryName = matchedStats.name.en;
                detectedCountryCode = matchedStats.code; // e.g. "SA"
            }
        }

        // Helper to debug valid IDs
        const calculateResidenceId = () => {
            let usedCode = 'N/A';
            let calcId = 682; // Default to Saudi Arabia (id: 682) instead of 4
            let method = 'default';

            // 1. Trust Client 'residenceCountry' if provided (and valid)
            if (residenceCountry && !isNaN(parseInt(residenceCountry)) && parseInt(residenceCountry) > 0) {
                return { id: parseInt(residenceCountry), method: 'client_payload' };
            }

            // 2. Try Detected Code (Server-side IP lookup)
            if (detectedCountryCode && detectedCountryCode !== 'N/A') {
                const normalizedCode = detectedCountryCode.trim().toUpperCase();
                const matched = countries.find(c => c.code === normalizedCode);
                if (matched) {
                    return { id: matched.id, method: `detected(${normalizedCode})` };
                }
            }

            // 3. Fallback to Nationality (Selected Country)
            if (selectedCountry) {
                return { id: parseInt(selectedCountry), method: 'nationality_fallback' };
            }

            return { id: 682, method: 'default' };
        };

        const residenceResult = calculateResidenceId();

        // Check if detected country differs from Mobile Country (VPN/Proxy Check)
        let mobileLocationNote = '';
        if (req.body.mobileCountryCode) {
            const mCode = countries.find(c => c.dialCode === req.body.mobileCountryCode.trim());
            if (mCode && mCode.code !== detectedCountryCode) {
                mobileLocationNote = `<br><span style="color: #eab308; font-size: 11px;">⚠️ IP (${detectedCountryCode}) ≠ Mobile (${mCode.code})</span>`;
            }
        }

        const noteMetaData = `
                <br>
                <br>
                <div style="font-family: sans-serif; font-size: 14px; color: #333;">                    
                    <ul style="padding-left: 20px; margin: 0;">
                        <li style="margin-bottom: 5px;">
                            <strong>Page:</strong> 
                            <a href="${pageUrl}" style="color: #2563eb; text-decoration: none;">${pageUrl || 'unknown'}</a>
                        </li>
                        <li style="margin-bottom: 5px;">
                            <strong>Location:</strong> ${detectedCountryName} <span style="color: #666;">(${detectedCountryCode})</span>
                            ${mobileLocationNote}
                        </li>
                        <li style="margin-bottom: 5px;">
                            <strong>IP Addr:</strong> <code>${ip}</code> <span style="font-size:10px; color:#999;">(via ${ipSource})</span>
                        </li>
                        <li style="margin-bottom: 5px; font-size: 10px; color: #999;">
                            <strong>Debug:</strong> ResID:${residenceResult.id} (${residenceResult.method})
                        </li>
                    </ul>
                </div>                
                `;

        // Preserve user message line breaks by converting \n to <br>
        const userMessageHtml = message ? message.replace(/\n/g, '<br>') : '';
        const finalNote = `${userMessageHtml}${noteMetaData}`;

        const payload = {
            "enFirstName": firstName,
            "enLastName": lastName,
            "email": email,
            "mobile": mobile,
            "whatsapp": mobile, // Mapping rule: whatsapp = mobile
            "nationality_id": selectedCountry ? parseInt(selectedCountry) : 682,
            "gender_id": 0,
            "birth_date": "2000-01-01",
            "source_id": sourceId || 4,
            "residence_id": residenceResult.id,
            "english_level_id": null,
            "inquiryType": 0,
            "withInquiry": true,
            "study_level_id": studyLevel ? parseInt(studyLevel) : 2,
            "subject_areas": null,
            "study_budget": 0,
            "planned_start_date": null,
            "fee_payer_id": null,
            "countries": null,
            "course_name": null,
            "currency_id": null,
            "referrer_id": referrerId || null,
            "school_id": schoolId || null,
            "event_id": null,
            "branch_id": null,
            "note": finalNote
        };

        // 3. Send to CRM
        const logLabel = `[CRM Submission]`;
        const endpointUrl = `${siteConfig.api.baseUrl.crm}${siteConfig.api.endpoints.crm.createStudent}`;
        console.log(`${logLabel} Sending to: ${endpointUrl}`);

        const leadResponse = await fetch(endpointUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const leadBody = await leadResponse.text();
        let leadData;
        try {
            leadData = JSON.parse(leadBody);
        } catch (e) {
            console.error(`${logLabel} JSON Parse Error:`, leadBody);
            throw new Error(`Submission Endpoint returned non-JSON. URL: ${endpointUrl}`);
        }

        if (!leadResponse.ok) {
            const errorText = typeof leadData === 'object' ? JSON.stringify(leadData) : leadBody;
            console.error(`${logLabel} Error (${leadResponse.status}):`, errorText);
            // Pass the specific backend error message to the client if available
            const clientMsg = leadData.message || leadData.error || `CRM Error: ${leadResponse.status}`;
            throw new Error(clientMsg);
        }

        return res.status(200).json({ success: true, data: leadData });

    } catch (error) {
        console.error('Submission Handler Error:', error);
        return res.status(500).json({ message: error.message });
    }
}
