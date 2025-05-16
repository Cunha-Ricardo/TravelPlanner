import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ItineraryDay, { Activity } from "@/components/ItineraryDay";
import { Edit, Share, Download, X, Plus, Info } from "lucide-react";

interface ItineraryDay {
  date: string;
  title: string;
  activities: Activity[];
  tip?: string;
}

interface ItineraryParams {
  mainDestination: string;
  otherDestinations: string[];
  startDate: string;
  endDate: string;
  interests: string[];
  preferences: string;
}

const Itinerary: React.FC = () => {
  const { toast } = useToast();
  
  const [itineraryParams, setItineraryParams] = useState<ItineraryParams>({
    mainDestination: "Paris",
    otherDestinations: ["Versalhes", "Nice"],
    startDate: "2023-06-10",
    endDate: "2023-06-17",
    interests: ["Arte e cultura", "Gastronomia", "História"],
    preferences: "Gostaria de incluir pelo menos um dia no Museu do Louvre e visitar a Torre Eiffel. Preferência por restaurantes autênticos.",
  });

  const [newInterest, setNewInterest] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<ItineraryDay[]>([]);
  const [isShowingFullItinerary, setIsShowingFullItinerary] = useState(false);

  // Query for getting the itinerary
  const { data: itinerary, isLoading } = useQuery({
    queryKey: ["/api/itinerary", itineraryParams],
    queryFn: async () => {
      setIsGenerating(true);
      try {
        const response = await apiRequest(
          "POST",
          "/api/itinerary",
          itineraryParams
        );
        const data = await response.json();
        setIsGenerating(false);
        return data;
      } catch (error) {
        setIsGenerating(false);
        throw error;
      }
    },
    enabled: false, // Disable auto-fetch
  });

  // Handle generating the itinerary
  const handleGenerateItinerary = async () => {
    setIsGenerating(true);
    
    try {
      // Faz a requisição para a API
      const response = await apiRequest(
        "POST",
        "/api/itinerary",
        itineraryParams
      );
      
      if (!response.ok) {
        throw new Error("Falha ao gerar o roteiro");
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setGeneratedItinerary(data);
        
        toast({
          title: "Roteiro gerado com sucesso!",
          description: "Seu itinerário de viagem foi criado usando nosso assistente de IA.",
        });
      } else {
        throw new Error("Formato de resposta inválido");
      }
    } catch (error) {
      console.error("Erro ao gerar roteiro:", error);
      
      toast({
        title: "Erro ao gerar roteiro",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle adding a new interest
  const handleAddInterest = () => {
    if (newInterest.trim() && !itineraryParams.interests.includes(newInterest.trim())) {
      setItineraryParams({
        ...itineraryParams,
        interests: [...itineraryParams.interests, newInterest.trim()],
      });
      setNewInterest("");
    }
  };

  // Handle removing an interest
  const handleRemoveInterest = (interest: string) => {
    setItineraryParams({
      ...itineraryParams,
      interests: itineraryParams.interests.filter((i) => i !== interest),
    });
  };

  // Handle adding another destination
  const handleAddDestination = (destination: string) => {
    if (destination.trim() && !itineraryParams.otherDestinations.includes(destination.trim())) {
      setItineraryParams({
        ...itineraryParams,
        otherDestinations: [...itineraryParams.otherDestinations, destination.trim()],
      });
    }
  };

  // Handle removing a destination
  const handleRemoveDestination = (destination: string) => {
    setItineraryParams({
      ...itineraryParams,
      otherDestinations: itineraryParams.otherDestinations.filter((d) => d !== destination),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-2">Roteiro de Viagem</h2>
        <p className="text-gray-600 mb-6">
          Planeje cada dia da sua viagem com ajuda do nosso assistente inteligente.
        </p>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Criar Novo Roteiro</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destino principal
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Para onde você vai?"
                value={itineraryParams.mainDestination}
                onChange={(e) =>
                  setItineraryParams({
                    ...itineraryParams,
                    mainDestination: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Outros destinos (opcional)
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ex: Londres, Amsterdã"
                  value={
                    itineraryParams.otherDestinations.length > 0
                      ? itineraryParams.otherDestinations.join(", ")
                      : ""
                  }
                  onChange={(e) => {
                    const destinations = e.target.value
                      .split(",")
                      .map((d) => d.trim())
                      .filter(Boolean);
                    setItineraryParams({
                      ...itineraryParams,
                      otherDestinations: destinations,
                    });
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de início
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                value={itineraryParams.startDate}
                onChange={(e) =>
                  setItineraryParams({
                    ...itineraryParams,
                    startDate: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de retorno
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                value={itineraryParams.endDate}
                onChange={(e) =>
                  setItineraryParams({
                    ...itineraryParams,
                    endDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interesses
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {itineraryParams.interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    {interest}
                    <button
                      type="button"
                      className="ml-1 text-primary-600 hover:text-primary-800"
                      onClick={() => handleRemoveInterest(interest)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
                <div className="flex items-center">
                  <input
                    type="text"
                    className="px-3 py-1 border border-gray-300 rounded-l-full focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="Adicionar interesse..."
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddInterest();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1 rounded-r-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 border border-l-0 border-gray-300"
                    onClick={handleAddInterest}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </button>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alguma preferência ou restrição?
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                rows={3}
                placeholder="Ex: preferência por museus, evitar lugares muito caros, etc."
                value={itineraryParams.preferences}
                onChange={(e) =>
                  setItineraryParams({
                    ...itineraryParams,
                    preferences: e.target.value,
                  })
                }
              ></textarea>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              onClick={handleGenerateItinerary}
              disabled={isGenerating}
            >
              {isGenerating ? "Gerando..." : "Gerar Roteiro com IA"}
            </button>
          </div>
        </div>

        {generatedItinerary.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h3 className="text-lg font-semibold">
                Roteiro para {itineraryParams.mainDestination}
              </h3>
              <div className="flex space-x-2 mt-2 sm:mt-0">
                <button className="text-gray-600 hover:text-gray-900 flex items-center text-sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </button>
                <button className="text-gray-600 hover:text-gray-900 flex items-center text-sm">
                  <Share className="h-4 w-4 mr-1" />
                  Compartilhar
                </button>
                <button className="text-gray-600 hover:text-gray-900 flex items-center text-sm">
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div className="space-y-8">
                  {generatedItinerary.slice(0, isShowingFullItinerary ? generatedItinerary.length : 3).map((day, index) => (
                    <ItineraryDay
                      key={index}
                      date={day.date}
                      title={day.title}
                      activities={day.activities}
                      tip={day.tip}
                    />
                  ))}

                  {!isShowingFullItinerary && generatedItinerary.length > 3 && (
                    <div className="text-center">
                      <button
                        className="text-primary-600 hover:text-primary-800 font-medium"
                        onClick={() => setIsShowingFullItinerary(true)}
                      >
                        Ver roteiro completo (+ {generatedItinerary.length - 3} dias)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Itinerary;
