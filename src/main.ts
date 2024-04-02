import { openai } from "./openai";

const form = document.querySelector("#generate-form") as HTMLFormElement;
const generated = document.querySelector("#generated") as HTMLIFrameElement;

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const prompt = formData.get("prompt") as string;
   
    const response = await openai.chat.completions.create({
        messages: [
          { role: 'system', content:`Tu crées des sites avec Tailwind, ton but est de générer du code HTML utilisant Tailwind en fonction du prompt de l'utilisateur. 
          Tu renvoies uniquement du code HTML sans aucun texte avant ou après, celui ci doit être valide et dans les standards et tu n'y rajoutes jamais de syntaxe markdown
          Tu ne renvoies que l'intérieur de la partie <body></body>` },
          { role: 'user', content: prompt },
        ],
        model: 'gpt-3.5-turbo',
        stream: true
      });


      let code = ""
      const onNewChunck = createTimer()
      for await (const message of response) {
        const isDone = message.choices[0].finish_reason === "stop";
        if(isDone) break
        const token = message.choices[0].delta.content
        code += token
        onNewChunck(code)
      }
})

const createTimer = () => {
  let date = new Date()
  let timeout: any = null
  return (code: string) => {
    // ne se lance que si le dernier call est plus vieux qu'une seconde
    if(new Date().getTime() - date.getTime() > 1000) {
      updateIfame(code)
      date = new Date()
    }
    if(timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      updateIfame(code)
    }, 1000)
  }
}

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



