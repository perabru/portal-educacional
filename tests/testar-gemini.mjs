// Teste opcional de conectividade Gemini. Nunca armazene GEMINI_API_KEY em fonte pública.
const key=process.env.GEMINI_API_KEY;
if(!key){console.error('Defina GEMINI_API_KEY no ambiente antes de rodar.');process.exit(2)}
const model='gemini-3.5-flash-lite';
try{
 const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{method:'POST',headers:{'content-type':'application/json','x-goog-api-key':key},body:JSON.stringify({contents:[{role:'user',parts:[{text:'Retorne somente o JSON {"ok":true}.'}]}],generationConfig:{responseMimeType:'application/json',maxOutputTokens:256}}),signal:AbortSignal.timeout(20000)});
 if(!res.ok){console.error('Gemini HTTP '+res.status+' (chave/cota/modelo devem ser revisados).');process.exit(1)}
 const data=await res.json();const payload=data?.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('')||'';
 console.log('Conexão com Gemini OK, modelo '+model+'. Retorno JSON: '+payload.slice(0,250));
}catch(e){console.error('Falha na conexão com Gemini:', e.message);process.exit(1)}
