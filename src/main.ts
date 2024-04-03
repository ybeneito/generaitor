const form = document.querySelector("#generate-form") as HTMLFormElement;
const generated = document.querySelector("#generated") as HTMLIFrameElement;

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const prompt = formData.get("prompt") as string;

    const response = await fetch("https://generaitor-api.vercel.app/ai",
      {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          prompt: prompt,
        })
      })
    const data = await response.text()
    updateIfame(data)

    })

const updateIfame = (code: string) => {
  generated.srcdoc = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Generated</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      ${code}
    </body>
  </html>
  `
}



