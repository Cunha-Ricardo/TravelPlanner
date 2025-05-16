import OpenAI from "openai";

// Configure OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "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",
});

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Assistente específico para criação de roteiros
const ROTEIRO_ASSISTANT_ID = "asst_orz98VXa4zht5BF5fvHd7TxL";

/**
 * Send a message to the OpenAI API and get a response
 * @param message User's message to the assistant
 * @returns The assistant's response
 */
export async function sendMessage(message: string): Promise<string> {
  try {
    const systemMessage = "Você é um especialista sábio em viagens internacionais. Suas respostas são informativas, objetivas e cheias de conhecimento prático. Fale como um guia experiente, mantendo suas respostas em português.";
    
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "Desculpe, não consegui processar sua pergunta. Por favor, tente novamente.";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Falha ao comunicar com o assistente de viagem.");
  }
}

/**
 * Generate a travel itinerary using OpenAI Assistant
 * @param params Parameters for the itinerary
 * @returns The generated itinerary
 */
export async function generateItinerary(params: {
  mainDestination: string;
  otherDestinations: string[];
  startDate: string;
  endDate: string;
  interests: string[];
  preferences: string;
}): Promise<any> {
  try {
    const { 
      mainDestination, 
      otherDestinations, 
      startDate, 
      endDate, 
      interests, 
      preferences 
    } = params;
    
    // Calculate trip duration in days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Format the prompt for the assistant
    const mensagem_usuario = `
    Crie um roteiro detalhado de ${duration} dias em ${mainDestination}${otherDestinations.length > 0 ? ', incluindo visitas a ' + otherDestinations.join(', ') : ''}.
    Data de início: ${new Date(startDate).toLocaleDateString('pt-BR')}
    Data de fim: ${new Date(endDate).toLocaleDateString('pt-BR')}
    Interesses: ${interests.join(', ')}
    Preferências: ${preferences}
    
    Formato obrigatório:
    - Organize por dias (Dia 1, Dia 2, etc.) com data específica
    - Para cada dia, liste atividades com horários específicos
    - Inclua sugestões de café da manhã, almoço e jantar
    - Mencione pontos turísticos específicos de ${mainDestination}
    - Adicione dicas úteis quando relevante
    
    Formate sua resposta como um JSON com a seguinte estrutura:
    [
      {
        "date": "Dia 1 - DD/MM/AAAA",
        "title": "Título descritivo para o dia",
        "activities": [
          { "id": "1-1", "time": "09:00 - 12:00", "description": "Descrição da atividade" },
          ...
        ],
        "tip": "Dica útil para o dia (opcional)"
      },
      ...
    ]
    `;
    
    // Cria uma nova thread
    console.log("Criando thread para geração de roteiro...");
    const thread = await openai.beta.threads.create();
    
    // Envia a mensagem para a thread
    console.log("Enviando mensagem para o assistente...");
    await openai.beta.threads.messages.create(
      thread.id,
      { role: "user", content: mensagem_usuario }
    );
    
    // Executa o assistente na thread
    console.log("Executando o assistente...");
    const run = await openai.beta.threads.runs.create(
      thread.id,
      { assistant_id: ROTEIRO_ASSISTANT_ID }
    );
    
    // Poll para verificar quando o assistente terminar
    console.log("Aguardando resposta do assistente...");
    let runStatus;
    do {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo entre verificações
      runStatus = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );
      console.log(`Status atual: ${runStatus.status}`);
    } while (runStatus.status !== "completed" && runStatus.status !== "failed");
    
    if (runStatus.status === "failed") {
      throw new Error(`O assistente falhou: ${runStatus.last_error?.message || "Erro desconhecido"}`);
    }
    
    // Recupera a mensagem de resposta
    console.log("Obtendo resposta do assistente...");
    const messages = await openai.beta.threads.messages.list(
      thread.id
    );
    
    // Encontra a última mensagem do assistente
    let roteiro_texto = "";
    for (const msg of messages.data) {
      if (msg.role === "assistant") {
        // Extrai o conteúdo da mensagem
        if (msg.content && msg.content.length > 0 && msg.content[0].type === 'text') {
          roteiro_texto = msg.content[0].text.value;
          break;
        }
      }
    }
    
    if (!roteiro_texto) {
      throw new Error("O assistente não retornou um roteiro.");
    }
    
    // Procura pelo JSON na resposta
    let jsonMatch = roteiro_texto.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) {
      // Tenta encontrar o JSON com outra abordagem
      const startIndex = roteiro_texto.indexOf('[');
      const endIndex = roteiro_texto.lastIndexOf(']');
      
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        jsonMatch = [roteiro_texto.substring(startIndex, endIndex + 1)];
      } else {
        throw new Error("Não foi possível encontrar um JSON válido na resposta.");
      }
    }
    
    try {
      const itineraryData = JSON.parse(jsonMatch[0]);
      return itineraryData;
    } catch (parseError) {
      console.error("Erro ao analisar JSON:", parseError);
      throw new Error("Formato de resposta inválido do assistente.");
    }
  } catch (error) {
    console.error("Erro ao gerar roteiro:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    throw new Error(`Falha ao gerar o roteiro de viagem: ${errorMessage}`);
  }
}

/**
 * Generate a travel checklist using OpenAI
 * @param params Parameters for the checklist
 * @returns The generated checklist items
 */
export async function generateChecklist(params: {
  destination: string;
  climate: string;
  duration: number;
  tripType: string;
  confirmedItems: string[];
}): Promise<any> {
  try {
    const { 
      destination, 
      climate, 
      duration, 
      tripType, 
      confirmedItems 
    } = params;
    
    // Format the prompt
    const prompt = `
      Gere um checklist inteligente de viagem com base nos seguintes parâmetros:
      
      - Destino: ${destination}
      - Clima esperado: ${climate}
      - Duração da viagem: ${duration} dias
      - Tipo de viagem: ${tripType}
      - Itens já confirmados pelo usuário: ${confirmedItems.join(', ')}
      
      O checklist deve ser dividido por categorias:
      - Documentos (ex: passaporte, RG, seguro viagem)
      - Roupas adequadas ao clima (ex: casaco, bermuda, biquíni)
      - Higiene pessoal (ex: escova de dente, shampoo)
      - Eletrônicos (ex: carregador, adaptador de tomada, power bank)
      - Saúde (ex: remédios, protetor solar, repelente)
      - Específicos por tipo de viagem (ex: roupa social, tênis de trilha, guia turístico)
      - Transporte (ex: reserva de carro, passagens)
      - Hotel (ex: confirmação de reserva)
      - Outros essenciais (cartões, dinheiro, snacks, etc.)
      
      Cada categoria deve ter pelo menos 4-5 itens relevantes.
      
      Formate sua resposta como um JSON com a seguinte estrutura:
      [
        { "id": "1", "text": "Passaporte", "category": "Documentos", "checked": false },
        { "id": "2", "text": "Seguro viagem", "category": "Documentos", "checked": false },
        ...
      ]
      
      Obs: Os itens que já estão na lista de "Itens já confirmados pelo usuário" devem ser marcados como "checked": true.
    `;
    
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "Você é um especialista em planejamento de viagens. Crie checklists detalhados em português com base nas informações fornecidas." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });
    
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Não foi possível gerar o checklist. Resposta vazia.");
    }
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Erro na formatação do checklist gerado.");
    }
  } catch (error) {
    console.error("Error generating checklist:", error);
    throw new Error("Falha ao gerar o checklist de viagem.");
  }
}
