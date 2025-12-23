import { UAParser } from 'ua-parser-js';
import { siteConfig } from '../../data/siteConfig.mjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { name, email, mobile, message, pageUrl, selectedCountry, residenceCountry, studyLevel, visitorData } = req.body;

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
        const userAgent = req.headers['user-agent'] || 'Unknown';
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const noteMetaData = {
            "page": pageUrl || 'unknown',
            "detected_country_name": visitorData?.country || 'N/A',
            "detected_ip": ip
        };

        const finalNote = `${message || ''}\n\n${JSON.stringify(noteMetaData)}`;

        const payload = {
            "enFirstName": firstName,
            "enLastName": lastName,
            "email": email,
            "mobile": mobile,
            "whatsapp": mobile, // Mapping rule: whatsapp = mobile
            "nationality_id": selectedCountry || 4,
            "gender_id": 0,
            "birth_date": "2000-01-01",
            "source_id": 4,
            "residence_id": residenceCountry || 20,
            "english_level_id": null,
            "inquiryType": 0,
            "withInquiry": true,
            "study_level_id": studyLevel || 2,
            "subject_areas": null,
            "study_budget": 0,
            "planned_start_date": null,
            "fee_payer_id": null,
            "countries": null,
            "course_name": null,
            "currency_id": null,
            "referrer_id": null,
            "school_id": null,
            "event_id": null,
            "branch_id": null,
            "note": finalNote
        };

        // 3. Send to CRM
        // Assumed endpoint: /leads based on context. 
        // If Base URL is http://127.0.0.1:8002/api/, then http://127.0.0.1:8002/api/lead
        const leadResponse = await fetch(`${siteConfig.api.baseUrl.crm}${siteConfig.api.endpoints.crm.createStudent}`, {
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
            console.error('Lead JSON Parse Error:', leadBody);
            throw new Error(`Submission Endpoint returned non-JSON: ${leadBody.substring(0, 100)}...`);
        }

        if (!leadResponse.ok) {
            const errorText = typeof leadData === 'object' ? JSON.stringify(leadData) : leadBody;
            console.error(`CRM Error (${leadResponse.status} ${leadResponse.statusText}):`, errorText);
            throw new Error(`Failed to submit lead to CRM [${leadResponse.status} ${leadResponse.statusText}]: ${errorText}`);
        }

        return res.status(200).json({ success: true, data: leadData });

    } catch (error) {
        console.error('Submission Handler Error:', error);
        return res.status(500).json({ message: error.message });
    }
}
