import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ChatMessage from "@/components/ChatMessage";
import { Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Olá! Sou seu assistente de viagem. Estou aqui para ajudar com informações sobre destinos, dicas de viagem, recomendações de hospedagem, atrações turísticas, e muito mais. Como posso ajudar você hoje?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mutation for sending a message
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      setIsLoading(true);
      try {
        const response = await apiRequest("POST", "/api/chat", { message: content });
        const data = await response.json();
        setIsLoading(false);
        return data;
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          content: data.response,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente mais tarde.",
        variant: "destructive",
      });
      console.error("Error sending message:", error);
    },
  });

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const newMessage: Message = {
      id: `user-${Date.now()}`,
      content: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Mock AI response for demonstration
    if (message.toLowerCase().includes("japão")) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            content: "Para uma viagem de 10 dias ao Japão, recomendo este roteiro:\n\n• Dias 1-3: Tóquio - Explore Shibuya, Shinjuku, Akihabara, e o Templo Senso-ji.\n• Dias 4-5: Kyoto - Visite o Templo Kinkaku-ji, Arashiyama, e o Santuário Fushimi Inari.\n• Dia 6: Nara - Conheça o Parque de Nara e o Templo Todai-ji.\n• Dia 7: Osaka - Explore o Castelo de Osaka e Dotonbori.\n• Dias 8-9: Hakone/Mt. Fuji - Aprecie as vistas do Monte Fuji e relaxe em onsen.\n• Dia 10: Retorno a Tóquio - Últimas compras antes da partida.\n\nRecomendo adquirir o Japan Rail Pass para economizar em transporte. Quer mais detalhes sobre algum desses destinos?",
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      }, 1000);
    } else if (message.toLowerCase().includes("kyoto") || message.toLowerCase().includes("cerejeiras")) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            content: "Principais atrações em Kyoto:\n\n• Kinkaku-ji (Pavilhão Dourado) - Templo coberto de folhas de ouro, cercado por um belo jardim.\n• Fushimi Inari-taisha - Famoso pelos milhares de portões torii vermelhos.\n• Arashiyama - Floresta de bambu e o Templo Tenryu-ji.\n• Gion - O distrito histórico das gueixas.\n• Kiyomizu-dera - Templo em uma colina com vista panorâmica da cidade.\n• Distrito de Higashiyama - Ruas antigas com lojas tradicionais.\n\nMelhor época para ver as cerejeiras em flor:\n\nA temporada de cerejeiras (sakura) geralmente ocorre entre final de março e início de abril, variando um pouco a cada ano. Em Kyoto, o pico costuma ser na primeira semana de abril. Para Tóquio, geralmente é uma semana antes. Se planejar sua viagem para este período, recomendo reservar hospedagem com bastante antecedência, pois é alta temporada turística.\n\nDeseja que eu crie um itinerário detalhado para Kyoto em 2 dias?",
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      }, 1000);
    } else {
      // In a real implementation, we would call the API here
      sendMessageMutation.mutate(message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const quickSuggestions = [
    { text: "Sugerir roteiro", action: () => setMessage("Pode me sugerir um roteiro de 7 dias para Portugal?") },
    { text: "Converter moeda", action: () => setMessage("Quanto vale 100 euros em reais?") },
    { text: "Dicas locais", action: () => setMessage("Quais são as comidas típicas da Tailândia?") },
    { text: "Checklist de viagem", action: () => setMessage("O que devo levar para uma viagem à praia?") },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-2">Assistente de Viagem</h2>
        <p className="text-gray-600 mb-6">
          Tire suas dúvidas e obtenha recomendações personalizadas para sua viagem.
        </p>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col" style={{ height: "600px" }}>
          <div className="p-4 border-b">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="font-medium">Assistente de Viagem</h3>
                <p className="text-sm text-gray-500">
                  Disponível 24/7 para ajudar com sua viagem
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                content={msg.content}
                isUser={msg.isUser}
              />
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 p-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-r-lg transition-colors"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 flex space-x-2 flex-wrap">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded-md mb-1"
                  onClick={suggestion.action}
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
