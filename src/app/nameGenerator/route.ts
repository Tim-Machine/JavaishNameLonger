import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { apiKey, messages } = await request.json();

  const url = "https://api.openai.com/v1/chat/completions";
  return await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      messages,
    }),
  })
    .then(async (resp) => {
      try {
        const data = await resp.json();
        // console.log("data", data);
        const methodName = data.choices[0].message.content;

        // console.log("methodName", methodName);

        return NextResponse.json({ methodName: methodName });
      } catch (error) {}
    })
    .catch((error) => {
      return NextResponse.json({ error });
      console.error(error);
    });
}
