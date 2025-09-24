import { TextToSpeechClient } from "@google-cloud/text-to-speech";

const client = new TextToSpeechClient();

const VOICE_NAME = "pt-BR-Wavenet-B";
const GENDER = "MALE";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: "Text is required" });
    }

    try {
        const [response] = await client.synthesizeSpeech({
            input: { text: text },
            voice: {
                languageCode: "pt-BR",
                name: VOICE_NAME,
                ssmlGender: GENDER,
            },
            audioConfig: { audioEncoding: "MP3" },
        });

        const audioContent = response.audioContent.toString("base64");

        res.status(200).json({ audioContent });
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ message: "Failed to synthesize speech" });
    }
}
