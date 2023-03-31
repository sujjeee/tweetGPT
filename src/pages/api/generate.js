import CryptoJS from 'crypto-js';

export default async function handler(req, res) {
    try {
        const { prompt, apiKey } = await req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is missing' });
        }

        if (!apiKey) {
            return res.status(400).json({ error: 'API key is missing' });
        }
        const decryptedKey = CryptoJS.AES.decrypt(apiKey, process.env.NEXT_PUBLIC_NEXTAUTH_KEY).toString(CryptoJS.enc.Utf8);

        const payload = {
            model: "text-davinci-003",
            prompt,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            max_tokens: 200,
            n: 1,
        };

        const openaiRes = await fetch('https://api.openai.com/v1/completions', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${decryptedKey}`,
            },
            method: 'POST',
            body: JSON.stringify(payload),
        });
        if (openaiRes.status === 401) {
            return res.status(401).json({ error: 'Invalid API key' });
        }

        if (!openaiRes.ok) {
            return res.status(401).json({ error: 'OpenAI API failed to respond' });
        }
        const result = await openaiRes.json();
        return res.status(200).json({ data: result.choices[0].text });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
