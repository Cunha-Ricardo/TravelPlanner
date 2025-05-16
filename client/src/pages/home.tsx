import React from "react";
import { useLocation, Link } from "wouter";
import DestinationCard from "@/components/DestinationCard";
import FeatureCard from "@/components/FeatureCard";
import { Calendar, DollarSign, CheckSquare } from "lucide-react";

const Home: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setLocation] = useLocation();

  const destinations = [
    {
      id: "1",
      name: "Rio de Janeiro",
      country: "Brasil",
      image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      tag: "Popular",
      tagType: "popular" as const,
      activities: "Praias, Cultura, Diversão",
    },
    {
      id: "2",
      name: "Paris",
      country: "França",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      tag: "Romântico",
      tagType: "romantic" as const,
      activities: "Arte, Gastronomia, Arquitetura",
    },
    {
      id: "3",
      name: "Tóquio",
      country: "Japão",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      tag: "Tendência",
      tagType: "trend" as const,
      activities: "Tecnologia, Culinária, Tradição",
    },
  ];

  const features = [
    {
      icon: Calendar,
      title: "Roteiro Personalizado",
      description: "Crie um roteiro detalhado com atividades planejadas para cada dia da sua viagem.",
      linkText: "Criar roteiro",
      linkHref: "/roteiro",
      iconBgColor: "bg-primary-100",
      iconColor: "text-primary-600",
    },
    {
      icon: DollarSign,
      title: "Conversão de Moeda",
      description: "Converta valores entre diferentes moedas com taxas de câmbio atualizadas.",
      linkText: "Converter moedas",
      linkHref: "/conversao",
      iconBgColor: "bg-secondary-100",
      iconColor: "text-secondary-600",
    },
    {
      icon: CheckSquare,
      title: "Checklist de Viagem",
      description: "Gere checklists personalizados com tudo o que você precisa para sua viagem.",
      linkText: "Criar checklist",
      linkHref: "/checklist",
      iconBgColor: "bg-accent-500/20",
      iconColor: "text-accent-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <div
          className="h-64 md:h-96 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&h=800')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 to-transparent flex items-center">
          <div className="p-6 md:p-10 max-w-lg">
            <h2 className="text-white text-2xl md:text-4xl font-bold mb-4 font-accent">
              Descubra seu próximo destino
            </h2>
            <p className="text-white text-sm md:text-base mb-6">
              Planeje roteiros personalizados, organize sua viagem e receba dicas
              exclusivas com o nosso assistente inteligente.
            </p>
            <button
              className="bg-accent-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg shadow-lg font-medium transition-colors"
              onClick={() => setLocation("/destinos")}
            >
              Começar a planejar
            </button>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-8">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">Para onde você quer ir?</h3>
          <div className="md:flex md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destino
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Digite um destino (ex: Paris, Tailândia, etc)"
              />
            </div>
            <div className="md:w-1/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de ida
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="md:w-1/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de volta
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="md:w-auto md:self-end">
              <button className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                onClick={() => setLocation("/destinos")}>
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Destinos em alta</h2>
          <a
            href="/destinos"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Ver todos
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              image={destination.image}
              name={destination.name}
              country={destination.country}
              tag={destination.tag}
              tagType={destination.tagType}
              activities={destination.activities}
              onClick={() => setLocation("/destinos")}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-6">
          Planeje sua viagem com facilidade
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              linkText={feature.linkText}
              linkHref={feature.linkHref}
              iconBgColor={feature.iconBgColor}
              iconColor={feature.iconColor}
            />
          ))}
        </div>
      </section>

      {/* Travel Assistant */}
      <section className="mb-10">
        <div className="bg-gradient-to-r from-primary-700 to-primary-900 rounded-xl overflow-hidden shadow-lg">
          <div className="md:flex">
            <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
              <span className="text-primary-200 text-sm font-medium uppercase tracking-wider">
                Assistente de viagem
              </span>
              <h2 className="text-white text-2xl md:text-3xl font-bold mt-2 mb-4">
                Tire suas dúvidas com nosso assistente inteligente
              </h2>
              <p className="text-primary-100 mb-6">
                Pergunte sobre destinos, receba dicas personalizadas e tire suas
                dúvidas sobre qualquer aspecto da sua viagem com nosso assistente
                baseado em IA.
              </p>
              <button
                className="bg-white text-primary-700 hover:bg-gray-100 px-6 py-3 rounded-lg shadow-md font-medium transition-colors self-start"
                onClick={() => setLocation("/chat")}
              >
                Iniciar conversa
              </button>
            </div>
            <div className="md:w-1/2 relative overflow-hidden h-60 md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Assistente de viagem"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
