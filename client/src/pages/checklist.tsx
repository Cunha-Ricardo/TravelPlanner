import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import ChecklistItem from "@/components/ChecklistItem";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X, Plus, Download, Printer } from "lucide-react";
import { jsPDF } from "jspdf";

interface ChecklistItemType {
  id: string;
  text: string;
  category: string;
  checked: boolean;
}

interface ChecklistParams {
  destination: string;
  climate: string;
  duration: number;
  tripType: string;
  confirmedItems: string[];
}

const Checklist: React.FC = () => {
  const { toast } = useToast();
  const [checklistParams, setChecklistParams] = useState<ChecklistParams>({
    destination: "Chile",
    climate: "frio",
    duration: 10,
    tripType: "turismo",
    confirmedItems: ["Passagem comprada", "Hospedagem confirmada"],
  });

  const [newConfirmedItem, setNewConfirmedItem] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedChecklist, setGeneratedChecklist] = useState<ChecklistItemType[]>([]);
  const [progress, setProgress] = useState(0);

  // Query for getting the checklist
  const { data: checklist, isLoading } = useQuery({
    queryKey: ["/api/checklist", checklistParams],
    queryFn: async () => {
      setIsGenerating(true);
      try {
        const response = await apiRequest(
          "POST",
          "/api/checklist",
          checklistParams
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

  // Update the checklist when data changes
  useEffect(() => {
    if (checklist) {
      setGeneratedChecklist(checklist);
    }
  }, [checklist]);

  // Update progress
  useEffect(() => {
    if (generatedChecklist.length > 0) {
      const checkedItems = generatedChecklist.filter((item) => item.checked).length;
      setProgress((checkedItems / generatedChecklist.length) * 100);
    }
  }, [generatedChecklist]);

  // Handle checkbox change
  const handleCheckItem = (id: string, checked: boolean) => {
    setGeneratedChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked } : item))
    );
  };

  // Handle generating the checklist
  const handleGenerateChecklist = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/checklist"] });
    queryClient.refetchQueries({ queryKey: ["/api/checklist", checklistParams] });
    
    // Mock data for demonstration
    setTimeout(() => {
      const mockChecklist: ChecklistItemType[] = [
        { id: "1", text: "Passaporte", category: "Documentos", checked: true },
        { id: "2", text: "Documento com foto", category: "Documentos", checked: true },
        { id: "3", text: "Comprovante de hospedagem", category: "Documentos", checked: false },
        { id: "4", text: "Seguro viagem", category: "Documentos", checked: false },
        { id: "5", text: "Cópia dos documentos (física ou digital)", category: "Documentos", checked: false },
        { id: "6", text: "Casaco térmico", category: "Roupas", checked: false },
        { id: "7", text: "Luvas e gorro", category: "Roupas", checked: false },
        { id: "8", text: "Calça jeans/resistente", category: "Roupas", checked: true },
        { id: "9", text: "Meias térmicas", category: "Roupas", checked: true },
        { id: "10", text: "Cachecol", category: "Roupas", checked: false },
        { id: "11", text: "Carregador de celular", category: "Eletrônicos", checked: true },
        { id: "12", text: "Adaptador de tomada (padrão chileno)", category: "Eletrônicos", checked: false },
        { id: "13", text: "Power bank", category: "Eletrônicos", checked: false },
        { id: "14", text: "Câmera fotográfica", category: "Eletrônicos", checked: true },
        { id: "15", text: "Protetor labial", category: "Saúde", checked: false },
        { id: "16", text: "Remédio para resfriado", category: "Saúde", checked: false },
        { id: "17", text: "Medicamentos de uso contínuo", category: "Saúde", checked: true },
        { id: "18", text: "Analgésicos", category: "Saúde", checked: true },
        { id: "19", text: "Lanches rápidos", category: "Extras", checked: false },
        { id: "20", text: "Lista de endereços úteis", category: "Extras", checked: true },
        { id: "21", text: "Garrafa de água reutilizável", category: "Extras", checked: false },
      ];
      
      setGeneratedChecklist(mockChecklist);
      setIsGenerating(false);
      
      toast({
        title: "Checklist gerado com sucesso!",
        description: "Sua lista de itens para viagem foi criada.",
      });
    }, 1500);
  };

  // Handle adding a new confirmed item
  const handleAddConfirmedItem = () => {
    if (newConfirmedItem.trim()) {
      setChecklistParams({
        ...checklistParams,
        confirmedItems: [...checklistParams.confirmedItems, newConfirmedItem.trim()],
      });
      setNewConfirmedItem("");
    }
  };

  // Handle removing a confirmed item
  const handleRemoveConfirmedItem = (item: string) => {
    setChecklistParams({
      ...checklistParams,
      confirmedItems: checklistParams.confirmedItems.filter((i) => i !== item),
    });
  };

  // Group items by category
  const categorizedItems = generatedChecklist.reduce<Record<string, ChecklistItemType[]>>(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {}
  );

  // Handle adding a new custom item
  const [newCustomItemText, setNewCustomItemText] = useState("");
  const [newCustomItemCategory, setNewCustomItemCategory] = useState("Extras");
  const [isAddingItem, setIsAddingItem] = useState(false);

  const handleAddCustomItem = () => {
    if (newCustomItemText.trim()) {
      const newItem: ChecklistItemType = {
        id: `custom-${Date.now()}`,
        text: newCustomItemText.trim(),
        category: newCustomItemCategory,
        checked: false,
      };
      
      setGeneratedChecklist([...generatedChecklist, newItem]);
      setNewCustomItemText("");
      setIsAddingItem(false);
      
      toast({
        title: "Item adicionado",
        description: "O item foi adicionado ao seu checklist.",
      });
    }
  };
  
  // Exportar checklist para PDF
  const exportToPDF = () => {
    if (generatedChecklist.length === 0) {
      toast({
        title: "Nenhum checklist para exportar",
        description: "Gere um checklist primeiro antes de exportar para PDF.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Título
      doc.setFontSize(20);
      doc.setTextColor(20, 80, 140);
      const title = `Checklist de Viagem: ${checklistParams.destination}`;
      const titleWidth = doc.getStringUnitWidth(title) * doc.getFontSize() / doc.internal.scaleFactor;
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(title, titleX, 20);
      
      // Detalhes da viagem
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text(`Duração: ${checklistParams.duration} dias`, 20, 30);
      doc.text(`Clima: ${checklistParams.climate}`, 20, 36);
      doc.text(`Tipo de viagem: ${checklistParams.tripType}`, 20, 42);
      
      // Progresso
      const checkedItems = generatedChecklist.filter(item => item.checked).length;
      doc.text(`Progresso: ${checkedItems} de ${generatedChecklist.length} itens concluídos`, 20, 50);
      
      // Espaçamentos
      let y = 60; // posição vertical inicial
      const lineHeight = 7;
      
      // Ordenar por categoria
      Object.entries(categorizedItems).forEach(([category, items]) => {
        // Verificar se precisamos de uma nova página
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        // Categoria
        doc.setFontSize(14);
        doc.setTextColor(40, 40, 40);
        doc.text(category, 20, y);
        y += lineHeight;
        
        // Itens
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        items.forEach(item => {
          const statusSymbol = item.checked ? "☑" : "☐";
          doc.text(`${statusSymbol} ${item.text}`, 25, y);
          y += lineHeight - 1;
          
          // Verificar se precisamos de uma nova página
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
        });
        
        y += lineHeight - 2; // Espaço entre categorias
      });
      
      // Rodapé
      const date = new Date().toLocaleDateString('pt-BR');
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Gerado por TravelPlanner em ${date}`, 20, 290);
      
      // Salvar o PDF
      doc.save(`Checklist_${checklistParams.destination.replace(/\s+/g, '_')}.pdf`);
      
      toast({
        title: "PDF gerado com sucesso!",
        description: "Seu checklist foi exportado para PDF.",
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar o arquivo PDF. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-2">Checklist de Viagem</h2>
        <p className="text-gray-600 mb-6">
          Crie uma lista personalizada para não esquecer nada na sua próxima viagem.
        </p>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Detalhes da Viagem</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destino
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Para onde você vai?"
                value={checklistParams.destination}
                onChange={(e) =>
                  setChecklistParams({
                    ...checklistParams,
                    destination: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clima esperado
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                value={checklistParams.climate}
                onChange={(e) =>
                  setChecklistParams({
                    ...checklistParams,
                    climate: e.target.value,
                  })
                }
              >
                <option value="frio">Frio</option>
                <option value="quente">Quente</option>
                <option value="tropical">Tropical</option>
                <option value="chuvoso">Chuvoso</option>
                <option value="instavel">Instável</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duração da viagem
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Quantos dias?"
                value={checklistParams.duration}
                onChange={(e) =>
                  setChecklistParams({
                    ...checklistParams,
                    duration: parseInt(e.target.value) || 1,
                  })
                }
                min={1}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de viagem
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                value={checklistParams.tripType}
                onChange={(e) =>
                  setChecklistParams({
                    ...checklistParams,
                    tripType: e.target.value,
                  })
                }
              >
                <option value="turismo">Turismo</option>
                <option value="negocios">Negócios</option>
                <option value="aventura">Aventura</option>
                <option value="praia">Praia</option>
                <option value="mochilao">Mochilão</option>
                <option value="luxo">Luxo</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Itens já confirmados
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {checklistParams.confirmedItems.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {item}
                    <button
                      type="button"
                      className="ml-1 text-green-600 hover:text-green-800"
                      onClick={() => handleRemoveConfirmedItem(item)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
                <div className="flex items-center">
                  <input
                    type="text"
                    className="px-3 py-1 border border-gray-300 rounded-l-full focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="Adicionar item..."
                    value={newConfirmedItem}
                    onChange={(e) => setNewConfirmedItem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddConfirmedItem();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1 rounded-r-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 border border-l-0 border-gray-300"
                    onClick={handleAddConfirmedItem}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              onClick={handleGenerateChecklist}
              disabled={isGenerating}
            >
              {isGenerating ? "Gerando..." : "Gerar Checklist"}
            </button>
          </div>
        </div>

        {generatedChecklist.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Seu Checklist para {checklistParams.destination}
              </h3>
              <div className="text-sm text-gray-500">
                {generatedChecklist.filter((item) => item.checked).length} de{" "}
                {generatedChecklist.length} itens
              </div>
            </div>

            <div className="w-full mb-6">
              <div className="progress-bar">
                <div
                  className="progress-value"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-6">
              {Object.entries(categorizedItems).map(([category, items]) => (
                <div key={category}>
                  <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <ChecklistItem
                        key={item.id}
                        id={item.id}
                        text={item.text}
                        checked={item.checked}
                        onChange={handleCheckItem}
                      />
                    ))}
                  </ul>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-200">
                {isAddingItem ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Digite o item..."
                        value={newCustomItemText}
                        onChange={(e) => setNewCustomItemText(e.target.value)}
                      />
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        value={newCustomItemCategory}
                        onChange={(e) => setNewCustomItemCategory(e.target.value)}
                      >
                        <option value="Documentos">Documentos</option>
                        <option value="Roupas">Roupas</option>
                        <option value="Eletrônicos">Eletrônicos</option>
                        <option value="Saúde">Saúde</option>
                        <option value="Extras">Extras</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Hotel">Hotel</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        onClick={() => setIsAddingItem(false)}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
                        onClick={handleAddCustomItem}
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                    onClick={() => setIsAddingItem(true)}
                  >
                    <Plus className="h-5 w-5 mr-1" />
                    Adicionar novo item
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checklist;
