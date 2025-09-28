// In api/gemini.js

export default async function handler(request, response) {
  const { contents, systemInstruction } = request.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return response.status(500).json({ error: { message: 'The GEMINI_API_KEY environment variable is not set in Vercel.' } });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contents, systemInstruction }),
    });

    // If the response is not OK, get the detailed error from Google
    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error("Gemini API Error:", errorData);
      const errorMessage = errorData.error?.message || 'An unknown error occurred with the Gemini API.';
      // Send the specific error back to the website
      return response.status(geminiResponse.status).json({ error: { message: errorMessage } });
    }

    const data = await geminiResponse.json();
    response.status(200).json(data);
  } catch (error) {
    console.error("Serverless function error:", error);
    response.status(500).json({ error: { message: error.message } });
  }
}
