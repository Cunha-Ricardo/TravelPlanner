import React, { useState } from "react";
import DestinationCard from "@/components/DestinationCard";

const Destinations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const destinations = [
    {
      id: "1",
      name: "Rio de Janeiro",
      country: "Brasil",
      continent: "américa do sul",
      image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      tag: "Popular",
      tagType: "popular" as const,
      activities: "Praias, Cultura, Diversão",
      type: "cidade",
    },
    {
      id: "2",
      name: "Paris",
      country: "França",
      continent: "europa",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      tag: "Romântico",
      tagType: "romantic" as const,
      activities: "Arte, Gastronomia, Arquitetura",
      type: "cidade",
    },
    {
      id: "3",
      name: "Tóquio",
      country: "Japão",
      continent: "ásia",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      tag: "Tendência",
      tagType: "trend" as const,
      activities: "Tecnologia, Culinária, Tradição",
      type: "cidade",
    },
    {
      id: "4",
      name: "Santorini",
      country: "Grécia",
      continent: "europa",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      tag: "Romântico",
      tagType: "romantic" as const,
      activities: "Praias, Vistas, Gastronomia",
      type: "ilha",
    },
    {
      id: "5",
      name: "Bali",
      country: "Indonésia",
      continent: "ásia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      tag: "Popular",
      tagType: "popular" as const,
      activities: "Praias, Templos, Natureza",
      type: "ilha",
    },
    {
      id: "6",
      name: "Machu Picchu",
      country: "Peru",
      continent: "américa do sul",
      image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      tag: "Aventura",
      tagType: "trend" as const,
      activities: "Montanhas, História, Aventura",
      type: "natureza",
    },
  ];

  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch =
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.activities.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesContinent =
      selectedContinent === "all" || destination.continent === selectedContinent;

    const matchesType = selectedType === "all" || destination.type === selectedType;

    return matchesSearch && matchesContinent && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-semibold mb-6">Explore Destinos</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar destinos
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Digite um destino, país ou atividade"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Continente
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                value={selectedContinent}
                onChange={(e) => setSelectedContinent(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="ásia">Ásia</option>
                <option value="europa">Europa</option>
                <option value="áfrica">África</option>
                <option value="américa do norte">América do Norte</option>
                <option value="américa do sul">América do Sul</option>
                <option value="oceania">Oceania</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="cidade">Cidade</option>
                <option value="praia">Praia</option>
                <option value="ilha">Ilha</option>
                <option value="montanha">Montanha</option>
                <option value="natureza">Natureza</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.length > 0 ? (
          filteredDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              image={destination.image}
              name={destination.name}
              country={destination.country}
              tag={destination.tag}
              tagType={destination.tagType}
              activities={destination.activities}
              onClick={() => alert(`Destino selecionado: ${destination.name}, ${destination.country}`)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 text-lg">
              Nenhum destino encontrado com os filtros atuais. Tente ajustar sua busca.
            </p>
          </div>
        )}
      </div>

      {/* Popular Searches */}
      {filteredDestinations.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Buscas populares</h3>
          <div className="flex flex-wrap gap-2">
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium transition-colors"
              onClick={() => setSearchTerm("praia")}
            >
              Praias paradisíacas
            </button>
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium transition-colors"
              onClick={() => {
                setSearchTerm("");
                setSelectedContinent("europa");
              }}
            >
              Destinos na Europa
            </button>
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium transition-colors"
              onClick={() => setSearchTerm("natureza")}
            >
              Experiências na natureza
            </button>
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium transition-colors"
              onClick={() => {
                setSearchTerm("");
                setSelectedType("cidade");
              }}
            >
              Melhores cidades
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Destinations;
