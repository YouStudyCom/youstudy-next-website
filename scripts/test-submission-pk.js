// Native fetch in Node 18+

async function testSubmission() {
    const url = 'https://www.youstudy.com/api/submit-inquiry';

    // Payload simulating a user from Pakistan
    const data = {
        name: "Test User PK",
        email: "antigravity_test_pk@example.com",
        mobile: "+923001234567",
        mobileCountryCode: "+92",
        mobileCountryId: 586,
        studyLevel: 2,
        message: "Tesing inquiry submission from Pakistan context.",
        selectedCountry: "586", // Pakistan ID
        visitorData: {
            country: "Pakistan",
            countryCode: "PK",
            ip: "103.1.2.3" // Fake PK IP
        },
        sourceId: 4,
        sourceChannel: "direct",
        pageUrl: "http://localhost:3000/test-pk"
    };

    console.log("🚀 Sending Test Payload to:", url);
    console.log(JSON.stringify(data, null, 2));

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        console.log("📡 Status:", response.status);
        const json = await response.json();
        console.log("📄 Response:", JSON.stringify(json, null, 2));
    } catch (error) {
        console.error("❌ Request Failed:", error);
    }
}

testSubmission();
