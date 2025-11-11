import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, X, Coffee, Droplets, Wheat, Candy, Wine, Zap, Soup, Cookie, Beef, ChevronLeft, ChevronRight, User, Package, FileText } from 'lucide-react';
import logoImage from '@/assets/logo-don-cabral-new.png';
import logoPrint from '@/assets/logo-don-cabral-invoice.png';

interface Product {
  name: string;
  defaultPrice?: number;
}

interface InvoiceItem {
  product: string;
  quantity: number;
  unit: 'unidade' | 'caixa';
  unitPrice: number;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  total: number;
}

interface ManualItem {
  id: string;
  product: string;
  quantity: number;
  unit: 'unidade' | 'caixa';
  unitPrice: number;
  weight: number;
  weightUnit: 'kg' | 'lbs';
}

interface InvoiceData {
  invoiceNumber: string;
  clientName: string;
  deliveryCity: string;
  orderDate: string;
  paymentDate: string;
  items: InvoiceItem[];
  grandTotal: number;
  discount: number;
  finalTotal: number;
}

interface ProductCategory {
  name: string;
  products: Product[];
}

const productCategories: ProductCategory[] = [
  {
    name: "Caixas de Açaí",
    products: [
      { name: "Caixas de açaí 300ml", defaultPrice: 26.85 },
      { name: "Caixas de açaí 1 litro", defaultPrice: 28.35 },
      { name: "Caixas de açaí 1,5 litros", defaultPrice: 29.85 },
    ]
  },
  {
    name: "Temperos e Condimentos",
    products: [
      { name: "Sazon carne (48 UND)", defaultPrice: 55.35 },
      { name: "Sazon Feijao - 48 x 60g", defaultPrice: 0 },
      { name: "Sal Parrilha c/ervas finas Odicasa", defaultPrice: 0 },
      { name: "Sal de Parrilha c/chimichurri Odicasa", defaultPrice: 0 },
      { name: "Sal de Parrilha c/alho Odicasa - 9x4", defaultPrice: 0 },
      { name: "Sal de Parrilha c/paprica Odicasa", defaultPrice: 0 },
      { name: "Sal de Parrilha Odicasa - 9x500g", defaultPrice: 0 },
      { name: "Sal refinado Lebre", defaultPrice: 0 },
      { name: "Sal Grosso Lebre", defaultPrice: 0 },
    ]
  },
  {
    name: "Bebidas e Achocolatados",
    products: [
      { name: "Nescau 350gr", defaultPrice: 14.42 },
      { name: "Toddy 370g", defaultPrice: 0 },
      { name: "Toddy 750g", defaultPrice: 0 },
      { name: "Toddy 1800g", defaultPrice: 0 },
      { name: "Guaraviton Ginseng", defaultPrice: 0 },
      { name: "Guaraviton Acai", defaultPrice: 0 },
      { name: "Mate Leao Natural 6x450ml", defaultPrice: 0 },
      { name: "Mate Leao Limao 6x450ml", defaultPrice: 0 },
      { name: "Mate Leao Natural 6x1500ml", defaultPrice: 0 },
      { name: "Mate Leao Limao 6x1500ml", defaultPrice: 0 },
      { name: "Tubaina Funada 2 litros pet. (6x200)", defaultPrice: 0 },
      { name: "Tubaina Funada Garrafa Vidro (6x60)", defaultPrice: 0 },
    ]
  },
  {
    name: "Sucos",
    products: [
      { name: "Suco Maguary concentrado", defaultPrice: 18.00 },
      { name: "Suco de Uva Grand Valle - 12 x 300", defaultPrice: 0 },
      { name: "Suco de Uva Grand Valle - 06 x 100", defaultPrice: 0 },
      { name: "Suco de Uva Grand Valle - 06 x 150", defaultPrice: 0 },
      { name: "Suco Concentrado Caju Maguary", defaultPrice: 0 },
      { name: "Suco Concentrado Maguary - Maracujá", defaultPrice: 0 },
    ]
  },
  {
    name: "Cereais e Grãos",
    products: [
      { name: "Feijão 1kg (fardo)", defaultPrice: 14.24 },
      { name: "Feijão carioca (fardo)", defaultPrice: 30.00 },
      { name: "Feijao Preto Caldo Bom - 10 x 1000", defaultPrice: 0 },
      { name: "Feijao Carioca Caldo Bom - 10 x 10", defaultPrice: 0 },
      { name: "Arroz Rey Arthur", defaultPrice: 0 },
      { name: "Canjiquinha Caldo Bom - Quirela", defaultPrice: 0 },
    ]
  },
  {
    name: "Farofas e Açúcar",
    products: [
      { name: "Farofa de milho", defaultPrice: 28.50 },
      { name: "Farofa Milho Caldo Bom - 24 x 400g", defaultPrice: 0 },
      { name: "Açúcar União Refinado 10x1000g", defaultPrice: 0 },
    ]
  },
  {
    name: "Doces e Bananadas",
    products: [
      { name: "Bananada Tachao com chocolate - 25 x 250g", defaultPrice: 210.00 },
      { name: "Bananada Tachao Natural - 25 x 250g", defaultPrice: 162.00 },
      { name: "Bananada Tachao Natural Display", defaultPrice: 0 },
      { name: "Bananada Tachao c/chocolate Display", defaultPrice: 0 },
      { name: "Bananada Tachao c/canela 25x200g", defaultPrice: 0 },
      { name: "Bananada Tacao c/canela Display", defaultPrice: 0 },
      { name: "Bananada Tachao s/açúcar 25x200g", defaultPrice: 0 },
      { name: "Bananada Tacha s/açúcar Display", defaultPrice: 0 },
    ]
  },
  {
    name: "Molhos",
    products: [
      { name: "Molho Pomarola Tradicional - 24 x 300ml", defaultPrice: 30.00 },
      { name: "Molho Pomarola Manjericao - 24 x 300ml", defaultPrice: 30.00 },
    ]
  },
  {
    name: "Salgadinhos",
    products: [
      { name: "Fandangos Presunto", defaultPrice: 0 },
      { name: "Fandangos Queijo", defaultPrice: 0 },
      { name: "Cebolitos", defaultPrice: 0 },
      { name: "Cheetos Bola", defaultPrice: 0 },
      { name: "Cheetos Onda", defaultPrice: 0 },
    ]
  },
  {
    name: "Café",
    products: [
      { name: "Café Melita Vacuo", defaultPrice: 0 },
      { name: "Café Pilao Tradicional Vacuo", defaultPrice: 0 },
    ]
  }
];

// Flatten all products for backward compatibility
const products: Product[] = productCategories.flatMap(category => category.products);

const InvoiceGenerator: React.FC = () => {
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Load data from localStorage or use defaults
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('invoiceFormData');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      invoiceNumber: '',
      clientName: '',
      deliveryCity: '',
      orderDate: new Date().toISOString().split('T')[0],
      paymentDate: '',
    };
  });
  
  const [productQuantities, setProductQuantities] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('invoiceProductQuantities');
    if (saved) {
      return JSON.parse(saved);
    }
    return {};
  });
  
  const [productPrices, setProductPrices] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('invoiceProductPrices');
    if (saved) {
      return JSON.parse(saved);
    }
    const prices: { [key: string]: number } = {};
    products.forEach(product => {
      prices[product.name] = product.defaultPrice || 0;
    });
    return prices;
  });

  const [productWeights, setProductWeights] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('invoiceProductWeights');
    if (saved) {
      return JSON.parse(saved);
    }
    return {};
  });

  const [productUnits, setProductUnits] = useState<{ [key: string]: 'unidade' | 'caixa' }>(() => {
    const saved = localStorage.getItem('invoiceProductUnits');
    if (saved) {
      return JSON.parse(saved);
    }
    return {};
  });

  const [productWeightUnits, setProductWeightUnits] = useState<{ [key: string]: 'kg' | 'lbs' }>(() => {
    const saved = localStorage.getItem('invoiceProductWeightUnits');
    if (saved) {
      return JSON.parse(saved);
    }
    return {};
  });
  
  const [discount, setDiscount] = useState<number>(() => {
    const saved = localStorage.getItem('invoiceDiscount');
    if (saved) {
      return JSON.parse(saved);
    }
    return 0;
  });
  const [manualItems, setManualItems] = useState<ManualItem[]>(() => {
    const saved = localStorage.getItem('invoiceManualItems');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('invoiceFormData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('invoiceProductQuantities', JSON.stringify(productQuantities));
  }, [productQuantities]);

  useEffect(() => {
    localStorage.setItem('invoiceProductPrices', JSON.stringify(productPrices));
  }, [productPrices]);

  useEffect(() => {
    localStorage.setItem('invoiceDiscount', JSON.stringify(discount));
  }, [discount]);

  useEffect(() => {
    localStorage.setItem('invoiceManualItems', JSON.stringify(manualItems));
  }, [manualItems]);

  useEffect(() => {
    localStorage.setItem('invoiceProductWeights', JSON.stringify(productWeights));
  }, [productWeights]);

  useEffect(() => {
    localStorage.setItem('invoiceProductUnits', JSON.stringify(productUnits));
  }, [productUnits]);

  useEffect(() => {
    localStorage.setItem('invoiceProductWeightUnits', JSON.stringify(productWeightUnits));
  }, [productWeightUnits]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const items: InvoiceItem[] = [];
    let grandTotal = 0;

    products.forEach(product => {
      const quantity = productQuantities[product.name] || 0;
      const unitPrice = productPrices[product.name] || 0;
      const weight = productWeights[product.name] || 0;
      const unit = productUnits[product.name] || 'unidade';
      const weightUnit = productWeightUnits[product.name] || 'kg';
      
      if (quantity > 0 && unitPrice > 0) {
        const total = quantity * unitPrice;
        
        items.push({
          product: product.name,
          quantity,
          unit,
          unitPrice,
          weight,
          weightUnit,
          total
        });
        grandTotal += total;
      }
    });

    // Add manual items
    manualItems.forEach(item => {
      if (item.quantity > 0 && item.unitPrice > 0) {
        const total = item.quantity * item.unitPrice;
        
        items.push({
          product: item.product,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          weight: item.weight,
          weightUnit: item.weightUnit,
          total
        });
        grandTotal += total;
      }
    });

    const currentGrandTotal = calculateGrandTotal();
    const finalTotal = currentGrandTotal - discount;

    const invoice: InvoiceData = {
      ...formData,
      items,
      grandTotal: currentGrandTotal,
      discount,
      finalTotal
    };

    setInvoiceData(invoice);
    setShowInvoice(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const updateQuantity = (productName: string, quantity: number) => {
    setProductQuantities(prev => ({
      ...prev,
      [productName]: quantity
    }));
  };

  const updatePrice = (productName: string, price: number) => {
    setProductPrices(prev => ({
      ...prev,
      [productName]: price
    }));
  };

  const updateWeight = (productName: string, weight: number) => {
    setProductWeights(prev => ({
      ...prev,
      [productName]: weight
    }));
  };

  const updateUnit = (productName: string, unit: 'unidade' | 'caixa') => {
    setProductUnits(prev => ({
      ...prev,
      [productName]: unit
    }));
  };

  const updateWeightUnit = (productName: string, weightUnit: 'kg' | 'lbs') => {
    setProductWeightUnits(prev => ({
      ...prev,
      [productName]: weightUnit
    }));
  };

  const addManualItem = () => {
    const newItem: ManualItem = {
      id: Date.now().toString(),
      product: '',
      quantity: 0,
      unit: 'unidade',
      unitPrice: 0,
      weight: 0,
      weightUnit: 'kg'
    };
    setManualItems(prev => [...prev, newItem]);
  };

  const removeManualItem = (id: string) => {
    setManualItems(prev => prev.filter(item => item.id !== id));
  };

  const updateManualItem = (id: string, field: keyof ManualItem, value: string | number) => {
    setManualItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const getProductIcon = (productName: string, categoryName: string) => {
    // Map categories to icons and colors
    const categoryConfig: { [key: string]: { icon: any; color: string; bgColor: string } } = {
      "Caixas de Açaí": { icon: Droplets, color: "text-purple-600", bgColor: "bg-purple-100" },
      "Temperos e Condimentos": { icon: Zap, color: "text-orange-600", bgColor: "bg-orange-100" },
      "Bebidas e Achocolatados": { icon: Coffee, color: "text-brown-600", bgColor: "bg-amber-100" },
      "Sucos": { icon: Wine, color: "text-red-600", bgColor: "bg-red-100" },
      "Cereais e Grãos": { icon: Wheat, color: "text-yellow-600", bgColor: "bg-yellow-100" },
      "Farofas e Açúcar": { icon: Candy, color: "text-pink-600", bgColor: "bg-pink-100" },
      "Doces e Bananadas": { icon: Candy, color: "text-emerald-600", bgColor: "bg-emerald-100" },
      "Molhos": { icon: Soup, color: "text-indigo-600", bgColor: "bg-indigo-100" },
      "Salgadinhos": { icon: Cookie, color: "text-blue-600", bgColor: "bg-blue-100" },
      "Café": { icon: Coffee, color: "text-stone-600", bgColor: "bg-stone-100" }
    };

    return categoryConfig[categoryName] || { icon: Beef, color: "text-gray-600", bgColor: "bg-gray-100" };
  };

  const getCategoryHeaderColor = (categoryName: string) => {
    const categoryColors: { [key: string]: string } = {
      "Caixas de Açaí": "text-purple-600 border-purple-200",
      "Temperos e Condimentos": "text-orange-600 border-orange-200",
      "Bebidas e Achocolatados": "text-amber-600 border-amber-200",
      "Sucos": "text-red-600 border-red-200",
      "Cereais e Grãos": "text-yellow-600 border-yellow-200",
      "Farofas e Açúcar": "text-pink-600 border-pink-200",
      "Doces e Bananadas": "text-emerald-600 border-emerald-200",
      "Molhos": "text-indigo-600 border-indigo-200",
      "Salgadinhos": "text-blue-600 border-blue-200",
      "Café": "text-stone-600 border-stone-200"
    };

    return categoryColors[categoryName] || "text-gray-600 border-gray-200";
  };

  // Calculate dynamic totals
  const calculateGrandTotal = () => {
    let grandTotal = 0;
    
    // Calculate total from products
    products.forEach(product => {
      const quantity = productQuantities[product.name] || 0;
      const unitPrice = productPrices[product.name] || 0;
      if (quantity > 0 && unitPrice > 0) {
        grandTotal += quantity * unitPrice;
      }
    });
    
    // Add manual items total
    manualItems.forEach(item => {
      if (item.quantity > 0 && item.unitPrice > 0) {
        grandTotal += item.quantity * item.unitPrice;
      }
    });
    
    return grandTotal;
  };

  const grandTotal = calculateGrandTotal();
  const finalTotal = grandTotal - discount;

  const isStep1Valid = formData.invoiceNumber && formData.clientName && formData.deliveryCity && formData.orderDate && formData.paymentDate;
  const isStep2Valid = Object.values(productQuantities).some(qty => qty > 0) || manualItems.some(item => item.quantity > 0 && item.unitPrice > 0);

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: "Dados Cadastrais", icon: User },
    { number: 2, title: "Escolha dos Produtos", icon: Package },
    { number: 3, title: "Resumo do Pedido", icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header only on step 1 */}
      {!showInvoice && currentStep === 1 && (
        <div className="bg-gradient-header text-primary-foreground py-4 md:py-6 mb-4 md:mb-6">
          <div className="max-w-4xl mx-auto px-2 md:px-4 text-center">
            <div className="flex items-center justify-center">
              <img src={logoImage} alt="Front Line Logo" className="h-10 md:h-16 w-auto" />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-2 md:px-4 pb-4 md:pb-12">
        {!showInvoice ? (
          <Card className="shadow-invoice">
            <CardHeader className="pb-3 md:pb-6">
              {/* Step Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={step.number} className="flex items-center gap-2 flex-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          currentStep >= step.number 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <StepIcon className="w-3 h-3" />
                        </div>
                        <span className={`text-xs font-medium ${
                          currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="w-full bg-muted rounded-full h-1 mt-3">
                  <div 
                    className="bg-primary h-1 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>
              </div>
              
              {currentStep !== 2 && (
                <CardTitle className="text-lg md:text-xl text-center text-primary mb-6">
                  {steps[currentStep - 1].title}
                </CardTitle>
              )}
            </CardHeader>
            <CardContent className="p-3 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6">
                {/* Step 1: Dados Cadastrais */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="invoiceNumber" className="text-sm font-medium">Número Invoice</Label>
                        <Input
                          id="invoiceNumber"
                          className="h-10 text-sm mt-1"
                          value={formData.invoiceNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                          placeholder="INV-001"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientName" className="text-sm font-medium">Nome do Cliente</Label>
                        <Input
                          id="clientName"
                          className="h-10 text-sm mt-1"
                          value={formData.clientName}
                          onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                          placeholder="Nome completo do cliente"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="deliveryCity" className="text-sm font-medium">Cidade/Estado</Label>
                      <Input
                        id="deliveryCity"
                        className="h-10 text-sm mt-1"
                        value={formData.deliveryCity}
                        onChange={(e) => setFormData(prev => ({ ...prev, deliveryCity: e.target.value }))}
                        placeholder="Ex: São Paulo - SP"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="orderDate" className="text-sm font-medium">Data do Pedido</Label>
                        <Input
                          id="orderDate"
                          className="h-10 text-sm mt-1"
                          type="date"
                          value={formData.orderDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, orderDate: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="paymentDate" className="text-sm font-medium">Data de Pagamento</Label>
                        <Input
                          id="paymentDate"
                          className="h-10 text-sm mt-1"
                          type="date"
                          value={formData.paymentDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, paymentDate: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Escolha dos Produtos */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-primary">Produtos</h3>
                      <Button 
                        type="button" 
                        onClick={addManualItem} 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Adicionar Item Manual
                      </Button>
                    </div>
                    
                    {/* Manual Items */}
                    {manualItems.length > 0 && (
                      <div className="space-y-3 p-4 bg-muted/30 rounded-lg border-2 border-dashed">
                        <h4 className="text-md font-semibold text-primary">Itens Manuais</h4>
                        {manualItems.map((item) => {
                          return (
                            <div key={item.id} className="grid grid-cols-1 md:grid-cols-8 gap-2 items-end p-3 border rounded-lg bg-background">
                              <div className="md:col-span-2">
                                <Label htmlFor={`manual-product-${item.id}`} className="text-sm text-muted-foreground">
                                  Nome do Produto
                                </Label>
                                <Input
                                  id={`manual-product-${item.id}`}
                                  type="text"
                                  value={item.product}
                                  onChange={(e) => updateManualItem(item.id, 'product', e.target.value)}
                                  placeholder="Nome do produto"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`manual-qty-${item.id}`} className="text-sm text-muted-foreground">
                                  Quantidade
                                </Label>
                                <Input
                                  id={`manual-qty-${item.id}`}
                                  type="number"
                                  min="0"
                                  value={item.quantity || ''}
                                  onChange={(e) => updateManualItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                  placeholder="0"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`manual-unit-${item.id}`} className="text-sm text-muted-foreground">
                                  Tipo
                                </Label>
                                <select
                                  id={`manual-unit-${item.id}`}
                                  value={item.unit || 'unidade'}
                                  onChange={(e) => updateManualItem(item.id, 'unit', e.target.value as 'unidade' | 'caixa')}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                >
                                  <option value="unidade">Unidade</option>
                                  <option value="caixa">Caixa</option>
                                </select>
                              </div>
                              <div>
                                <Label htmlFor={`manual-price-${item.id}`} className="text-sm text-muted-foreground">
                                  Valor (USD)
                                </Label>
                                <Input
                                  id={`manual-price-${item.id}`}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.unitPrice || ''}
                                  onChange={(e) => updateManualItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                  placeholder="0.00"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`manual-weight-${item.id}`} className="text-sm text-muted-foreground">
                                  Peso
                                </Label>
                                <Input
                                  id={`manual-weight-${item.id}`}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.weight || ''}
                                  onChange={(e) => updateManualItem(item.id, 'weight', parseFloat(e.target.value) || 0)}
                                  placeholder="0"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`manual-weightunit-${item.id}`} className="text-sm text-muted-foreground">
                                  Unidade
                                </Label>
                                <select
                                  id={`manual-weightunit-${item.id}`}
                                  value={item.weightUnit || 'kg'}
                                  onChange={(e) => updateManualItem(item.id, 'weightUnit', e.target.value as 'kg' | 'lbs')}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                >
                                  <option value="kg">kg</option>
                                  <option value="lbs">lbs</option>
                                </select>
                              </div>
                              <div className="text-right">
                                <Label className="text-sm text-muted-foreground">Total</Label>
                                <div className="font-semibold">
                                  ${(item.quantity * item.unitPrice).toFixed(2)}
                                </div>
                              </div>
                              <div className="flex justify-center">
                                <Button
                                  type="button"
                                  onClick={() => removeManualItem(item.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    <div className="space-y-6 max-h-[60vh] overflow-y-auto bg-slate-50 p-4 rounded-lg border">
                      {productCategories.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="space-y-3">
                          <h4 className={`text-md font-semibold border-b pb-2 ${getCategoryHeaderColor(category.name)}`}>
                            {category.name}
                          </h4>
                          <div className="space-y-3">
                            {category.products.map((product, index) => {
                              const globalIndex = `${categoryIndex}-${index}`;
                              const iconConfig = getProductIcon(product.name, category.name);
                              const IconComponent = iconConfig.icon;
                              const quantity = productQuantities[product.name] || 0;
                              const price = productPrices[product.name] || 0;
                              const weight = productWeights[product.name] || 0;
                              const unit = productUnits[product.name] || 'unidade';
                              const weightUnit = productWeightUnits[product.name] || 'kg';
                              
                              return (
                                <div key={globalIndex} className="p-3 bg-white border rounded-lg shadow-sm">
                                  <div className="grid grid-cols-12 gap-2 items-center">
                                    {/* Nome do produto + ícone */}
                                    <div className="col-span-3 flex items-center gap-2">
                                      <div className={`w-6 h-6 rounded-lg ${iconConfig.bgColor} flex items-center justify-center flex-shrink-0`}>
                                        <IconComponent className={`w-4 h-4 ${iconConfig.color}`} />
                                      </div>
                                      <Label className="text-xs font-medium leading-tight">{product.name}</Label>
                                    </div>
                                    
                                    {/* Quantidade */}
                                    <div className="col-span-1">
                                      <Label htmlFor={`qty-${globalIndex}`} className="text-xs text-muted-foreground">
                                        Qtd
                                      </Label>
                                      <Input
                                        className="h-8 text-xs"
                                        id={`qty-${globalIndex}`}
                                        type="number"
                                        min="0"
                                        value={quantity || ''}
                                        onChange={(e) => updateQuantity(product.name, parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                      />
                                    </div>
                                    
                                    {/* Tipo - Unidade ou Caixa */}
                                    <div className="col-span-2">
                                      <Label htmlFor={`unit-${globalIndex}`} className="text-xs text-muted-foreground">
                                        Tipo
                                      </Label>
                                      <select
                                        id={`unit-${globalIndex}`}
                                        value={unit}
                                        onChange={(e) => updateUnit(product.name, e.target.value as 'unidade' | 'caixa')}
                                        className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background"
                                      >
                                        <option value="unidade">Unidade</option>
                                        <option value="caixa">Caixa</option>
                                      </select>
                                    </div>

                                    {/* Valor */}
                                    <div className="col-span-2">
                                      <Label htmlFor={`price-${globalIndex}`} className="text-xs text-muted-foreground">
                                        Valor (USD)
                                      </Label>
                                      <Input
                                        className="h-8 text-xs"
                                        id={`price-${globalIndex}`}
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={price || ''}
                                        onChange={(e) => updatePrice(product.name, parseFloat(e.target.value) || 0)}
                                        placeholder="0.00"
                                      />
                                    </div>

                                    {/* Peso */}
                                    <div className="col-span-1">
                                      <Label htmlFor={`weight-${globalIndex}`} className="text-xs text-muted-foreground">
                                        Peso
                                      </Label>
                                      <Input
                                        className="h-8 text-xs"
                                        id={`weight-${globalIndex}`}
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={weight || ''}
                                        onChange={(e) => updateWeight(product.name, parseFloat(e.target.value) || 0)}
                                        placeholder="0"
                                      />
                                    </div>

                                    {/* Unidade de Peso */}
                                    <div className="col-span-1">
                                      <Label htmlFor={`weightunit-${globalIndex}`} className="text-xs text-muted-foreground">
                                        Un.
                                      </Label>
                                      <select
                                        id={`weightunit-${globalIndex}`}
                                        value={weightUnit}
                                        onChange={(e) => updateWeightUnit(product.name, e.target.value as 'kg' | 'lbs')}
                                        className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background"
                                      >
                                        <option value="kg">kg</option>
                                        <option value="lbs">lbs</option>
                                      </select>
                                    </div>
                                    
                                    {/* Total */}
                                    <div className="col-span-2 text-right">
                                      <Label className="text-xs text-muted-foreground">Total</Label>
                                      <div className="font-semibold text-xs bg-muted p-2 rounded text-center">
                                        ${(quantity * price).toFixed(2)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Resumo do Pedido */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h3 className="text-lg font-semibold text-primary mb-4">Resumo do Pedido</h3>
                      
                      {/* Items Summary */}
                      <div className="space-y-3 mb-6">
                        <h4 className="font-medium">Itens Selecionados:</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {products.map(product => {
                            const quantity = productQuantities[product.name] || 0;
                            const price = productPrices[product.name] || 0;
                            if (quantity > 0 && price > 0) {
                              return (
                                <div key={product.name} className="flex justify-between items-center p-2 bg-background rounded border">
                                  <span className="text-sm">{product.name}</span>
                                  <span className="text-sm font-medium">{quantity}x ${price.toFixed(2)} = ${(quantity * price).toFixed(2)}</span>
                                </div>
                              );
                            }
                            return null;
                          })}
                          {manualItems.map(item => {
                            if (item.quantity > 0 && item.unitPrice > 0) {
                              return (
                                <div key={item.id} className="flex justify-between items-center p-2 bg-background rounded border">
                                  <span className="text-sm">{item.product}</span>
                                  <span className="text-sm font-medium">{item.quantity}x ${item.unitPrice.toFixed(2)} = ${(item.quantity * item.unitPrice).toFixed(2)}</span>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                      
                      {/* Totals */}
                      <div className="space-y-3 border-t pt-4">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span className="font-semibold">${grandTotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Label htmlFor="discount" className="text-sm">Desconto (USD):</Label>
                          <Input
                            id="discount"
                            className="h-10 w-32 text-right"
                            type="number"
                            min="0"
                            step="0.01"
                            value={discount || ''}
                            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        </div>
                        
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total Final:</span>
                          <span className="text-primary">${finalTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button type="submit" size="lg" className="w-full h-12 text-base">
                      Gerar Invoice
                    </Button>
                  </div>
                )}

                {/* Navigation Buttons */}
                {currentStep < 3 && (
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Voltar
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={
                        (currentStep === 1 && !isStep1Valid) ||
                        (currentStep === 2 && !isStep2Valid)
                      }
                      className="flex items-center gap-2"
                    >
                      Próximo
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="flex justify-start">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Voltar
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="print:shadow-none">
            <Card className="shadow-invoice print:shadow-none print:border-2 print:border-primary">
              <CardContent className="p-8">
                {/* Invoice Header - Compact two-column layout */}
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-4 items-start">
                    {/* Left Column - Logo and Company Info */}
                    <div>
                      <div className="mb-2">
                        <img src={logoPrint} alt="Logotipo Don Cabral" className="h-[40px] w-auto" />
                      </div>
                      <div className="space-y-0.5 text-xs">
                        <p><strong>Don Cabral</strong></p>
                        <p>608 Mesilla Dr, Kissimmee, FL 34758, EUA</p>
                        <p>+1 (862) 930-0407</p>
                        <p>doncabral.com.br</p>
                      </div>
                    </div>
                    
                    {/* Right Column - Invoice and Client Info */}
                    <div className="text-right">
                      <h1 className="text-xl font-bold text-primary mb-3">
                        INVOICE #{invoiceData?.invoiceNumber}
                      </h1>
                      <div className="space-y-0.5 text-xs">
                        <p><strong>Cliente:</strong> {invoiceData?.clientName}</p>
                        <p><strong>Entrega:</strong> {invoiceData?.deliveryCity}</p>
                        <p><strong>Pedido:</strong> {invoiceData?.orderDate}</p>
                        <p><strong>Pagamento:</strong> {invoiceData?.paymentDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-3" />

                {/* Products Table - Compact layout */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-1.5 text-left text-xs">Produto</th>
                        <th className="border border-border p-1.5 text-center text-xs">Qtd</th>
                        <th className="border border-border p-1.5 text-center text-xs">Tipo</th>
                        <th className="border border-border p-1.5 text-center text-xs">Valor (USD)</th>
                        <th className="border border-border p-1.5 text-center text-xs">Peso (kg)</th>
                        <th className="border border-border p-1.5 text-center text-xs">Total (USD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData?.items.map((item, index) => (
                        <tr key={index}>
                          <td className="border border-border p-1.5 text-xs">{item.product}</td>
                          <td className="border border-border p-1.5 text-center text-xs">{item.quantity}</td>
                          <td className="border border-border p-1.5 text-center text-xs capitalize">{item.unit}</td>
                          <td className="border border-border p-1.5 text-center text-xs">${item.unitPrice.toFixed(2)}</td>
                          <td className="border border-border p-1.5 text-center text-xs">{item.weight || '-'}</td>
                          <td className="border border-border p-1.5 text-center text-xs">${item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted">
                        <td colSpan={5} className="border border-border p-1.5 text-right font-semibold text-xs">Subtotal</td>
                        <td className="border border-border p-1.5 text-center text-xs">${invoiceData?.grandTotal.toFixed(2)}</td>
                      </tr>
                      {invoiceData?.discount && invoiceData.discount > 0 && (
                        <tr className="bg-muted">
                          <td colSpan={5} className="border border-border p-1.5 text-right font-semibold text-red-600 text-xs">Desconto</td>
                          <td className="border border-border p-1.5 text-center text-red-600 text-xs">-${invoiceData.discount.toFixed(2)}</td>
                        </tr>
                      )}
                      <tr className="bg-primary text-primary-foreground font-bold">
                        <td colSpan={5} className="border border-border p-1.5 text-right text-sm">Total Final</td>
                        <td className="border border-border p-1.5 text-center text-sm">${invoiceData?.finalTotal.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Signatures - Compact layout */}
                <div className="flex justify-between mt-6 mb-4">
                  <div className="text-center w-2/5">
                    <div className="border-t border-foreground pt-1">
                      <p className="font-medium text-xs">{invoiceData?.clientName}</p>
                      <p className="text-xs text-muted-foreground">Assinatura do Cliente</p>
                    </div>
                  </div>
                  <div className="text-center w-2/5">
                    <div className="border-t border-foreground pt-1">
                      <p className="font-medium text-xs">Front Line Distribution</p>
                      <p className="text-xs text-muted-foreground">Assinatura da Empresa</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 print:hidden">
                  <Button 
                    onClick={handlePrint} 
                    size="lg" 
                    className="w-full h-12"
                  >
                    Exportar PDF / Imprimir
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={() => {
                        setShowInvoice(false);
                        setCurrentStep(3);
                      }} 
                      variant="outline" 
                      size="lg"
                      className="h-12"
                    >
                      Voltar
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowInvoice(false);
                        setCurrentStep(1);
                      }} 
                      variant="default" 
                      size="lg"
                      className="h-12"
                    >
                      Nova Invoice
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-2 {
            border-width: 2px !important;
          }
          .print\\:border-primary {
            border-color: hsl(var(--primary)) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceGenerator;