
async function testConnection() {
    console.log('1. Testing Authentication...');
    try {
        const authResponse = await fetch('http://127.0.0.1:8002/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'api@user.com',
                password: 'Amin770904030123*'
            })
        });

        console.log('Auth Status:', authResponse.status, authResponse.statusText);
        const authBody = await authResponse.text();

        let token;
        try {
            const authData = JSON.parse(authBody);
            token = authData.data?.token || authData.token;
            console.log('Token received:', token ? 'YES' : 'NO');
        } catch (e) {
            console.error('Auth response is NOT JSON. Content:', authBody.substring(0, 200));
            return;
        }

        if (!token) {
            console.error('Login failed, cannot proceed to lead submission.');
            // Print full body if login failed to debug why
            console.log('Full Auth Body:', authBody);
            return;
        }

        console.log('\n2. Testing Lead Submission...');
        const payload = {
            "enFirstName": "TestAgent",
            "enLastName": "Debug",
            "email": "testagent@debug.com",
            "mobile": "1234567890",
            "whatsapp": "1234567890",
            "nationality_id": 4,
            "gender_id": 0,
            "birth_date": "2000-01-01",
            "source_id": 4,
            "residence_id": 20,
            "english_level_id": null,
            "inquiryType": 0,
            "withInquiry": true,
            "study_level_id": 2,
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
            "note": "Debug Test from Script"
        };

        const leadResponse = await fetch('http://127.0.0.1:8002/api/students/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
            redirect: 'manual'
        });

        console.log('Lead Status:', leadResponse.status, leadResponse.statusText);

        if (leadResponse.status >= 300 && leadResponse.status < 400) {
            console.log('REDIRECT DETECTED!');
            console.log('Target Location:', leadResponse.headers.get('location'));
        }

        const leadBody = await leadResponse.text();
        console.log('Lead Body:', leadBody.substring(0, 1000)); // Log first 1000 chars

    } catch (error) {
        console.error('FATAL ERROR:', error);
    }
}

testConnection();
