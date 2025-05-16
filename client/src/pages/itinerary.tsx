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
  const handleGenerateItinerary = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/itinerary"] });
    queryClient.refetchQueries({ queryKey: ["/api/itinerary", itineraryParams] });
    
    // Mock data for demonstration
    setTimeout(() => {
      const mockItinerary: ItineraryDay[] = [
        {
          date: "Dia 1 - 10/06/2023",
          title: "Chegada e Introdução a Paris",
          activities: [
            { id: "1-1", time: "09:00 - 12:00", description: "Check-in no hotel e descanso após o voo" },
            { id: "1-2", time: "12:30 - 14:00", description: "Almoço no Café de Flore, um clássico café parisiense" },
            { id: "1-3", time: "14:30 - 17:00", description: "Passeio a pé pelo Quartier Latin e Jardim de Luxemburgo" },
            { id: "1-4", time: "19:00 - 21:30", description: "Jantar no Le Petit Châtelet, com vista para Notre-Dame" },
          ],
          tip: "Compre um carnê de tickets de metrô para economizar durante a estadia.",
        },
        {
          date: "Dia 2 - 11/06/2023",
          title: "Museu do Louvre e Arredores",
          activities: [
            { id: "2-1", time: "08:30 - 09:00", description: "Café da manhã no hotel" },
            { id: "2-2", time: "09:30 - 13:00", description: "Visita ao Museu do Louvre (reserve ingressos antecipadamente)" },
            { id: "2-3", time: "13:30 - 15:00", description: "Almoço no Café Marly com vista para a pirâmide do Louvre" },
            { id: "2-4", time: "15:30 - 17:30", description: "Passeio pelo Jardim das Tulherias e Place de la Concorde" },
            { id: "2-5", time: "18:00 - 19:30", description: "Compras na Rue de Rivoli" },
            { id: "2-6", time: "20:00 - 22:00", description: "Jantar no Le Comptoir du Relais, um bistrô tradicional" },
          ],
        },
        {
          date: "Dia 3 - 12/06/2023",
          title: "Torre Eiffel e Champs-Élysées",
          activities: [
            { id: "3-1", time: "09:00 - 12:00", description: "Visita à Torre Eiffel (reserva antecipada recomendada)" },
            { id: "3-2", time: "12:30 - 14:00", description: "Almoço no Le Moulin de la Galette em Montmartre" },
            { id: "3-3", time: "14:30 - 16:30", description: "Explorar Montmartre e a Basílica de Sacré-Cœur" },
            { id: "3-4", time: "17:00 - 19:00", description: "Passeio pela Champs-Élysées até o Arco do Triunfo" },
            { id: "3-5", time: "20:00 - 22:30", description: "Cruzeiro noturno pelo Rio Sena com jantar" },
          ],
          tip: "Reserve o cruzeiro com antecedência para garantir seu lugar.",
        },
        {
          date: "Dia 4 - 13/06/2023",
          title: "Versalhes",
          activities: [
            { id: "4-1", time: "08:00 - 09:00", description: "Café da manhã no hotel" },
            { id: "4-2", time: "09:30 - 10:30", description: "Trem para Versalhes (30 minutos de Paris)" },
            { id: "4-3", time: "10:30 - 14:30", description: "Visita ao Palácio de Versalhes e seus jardins" },
            { id: "4-4", time: "14:30 - 16:00", description: "Almoço em restaurante próximo ao palácio" },
            { id: "4-5", time: "16:00 - 17:30", description: "Visita ao Grand Trianon e Petit Trianon" },
            { id: "4-6", time: "18:00 - 19:00", description: "Retorno a Paris" },
            { id: "4-7", time: "20:00 - 22:00", description: "Jantar no Le Procope, o café mais antigo de Paris" },
          ],
        },
        {
          date: "Dia 5 - 14/06/2023",
          title: "Museu d'Orsay e Marais",
          activities: [
            { id: "5-1", time: "09:00 - 12:30", description: "Visita ao Museu d'Orsay" },
            { id: "5-2", time: "13:00 - 14:30", description: "Almoço no L'As du Fallafel no bairro Le Marais" },
            { id: "5-3", time: "15:00 - 17:00", description: "Explorar o bairro de Le Marais e Place des Vosges" },
            { id: "5-4", time: "17:30 - 19:00", description: "Visita ao Centro Pompidou" },
            { id: "5-5", time: "20:00 - 22:00", description: "Jantar no Les Philosophes" },
          ],
        },
        {
          date: "Dia 6 - 15/06/2023",
          title: "Dia Livre em Paris",
          activities: [
            { id: "6-1", time: "09:00 - 10:00", description: "Café da manhã no hotel" },
            { id: "6-2", time: "10:30 - 12:30", description: "Visita às Catacumbas de Paris (opcional)" },
            { id: "6-3", time: "13:00 - 14:30", description: "Almoço em cafés de sua escolha" },
            { id: "6-4", time: "15:00 - 18:00", description: "Compras nas Galerias Lafayette" },
            { id: "6-5", time: "19:00 - 21:30", description: "Jantar e espetáculo no Moulin Rouge (opcional)" },
          ],
          tip: "Reserve com antecedência para o Moulin Rouge, pois os ingressos esgotam rapidamente.",
        },
        {
          date: "Dia 7 - 16/06/2023",
          title: "Nice e Côte d'Azur",
          activities: [
            { id: "7-1", time: "06:30 - 07:00", description: "Check-out do hotel em Paris" },
            { id: "7-2", time: "07:30 - 12:00", description: "Trem de alta velocidade para Nice" },
            { id: "7-3", time: "12:30 - 13:30", description: "Check-in no hotel em Nice" },
            { id: "7-4", time: "14:00 - 15:30", description: "Almoço em restaurante à beira-mar" },
            { id: "7-5", time: "16:00 - 19:00", description: "Passeio pela Promenade des Anglais e Cidade Velha" },
            { id: "7-6", time: "20:00 - 22:00", description: "Jantar em restaurante local com pratos provençais" },
          ],
        },
      ];
      
      setGeneratedItinerary(mockItinerary);
      setIsGenerating(false);
      
      toast({
        title: "Roteiro gerado com sucesso!",
        description: "Seu itinerário de viagem foi criado.",
      });
    }, 1500);
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
