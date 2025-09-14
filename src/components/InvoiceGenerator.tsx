import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, X } from 'lucide-react';
import logoImage from '@/assets/logo-don-cabral.png';

interface Product {
  name: string;
  defaultPrice?: number;
}

interface InvoiceItem {
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ManualItem {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceData {
  invoiceNumber: string;
  clientName: string;
  deliveryCity: string;
  orderDate: string;
  paymentDate: string;
  items: InvoiceItem[];
  grandTotal: number;
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
    localStorage.setItem('invoiceManualItems', JSON.stringify(manualItems));
  }, [manualItems]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const items: InvoiceItem[] = [];
    let grandTotal = 0;

    products.forEach(product => {
      const quantity = productQuantities[product.name] || 0;
      const unitPrice = productPrices[product.name] || 0;
      
      if (quantity > 0 && unitPrice > 0) {
        const total = quantity * unitPrice;
        items.push({
          product: product.name,
          quantity,
          unitPrice,
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
          unitPrice: item.unitPrice,
          total
        });
        grandTotal += total;
      }
    });

    const invoice: InvoiceData = {
      ...formData,
      items,
      grandTotal
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

  const addManualItem = () => {
    const newItem: ManualItem = {
      id: Date.now().toString(),
      product: '',
      quantity: 0,
      unitPrice: 0
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-header text-primary-foreground py-8 mb-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <img src={logoImage} alt="Don Cabral Logo" className="h-20 w-auto" />
          </div>
          <p className="text-lg opacity-90">Invoice Generator</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-12">
        {!showInvoice ? (
          <Card className="shadow-invoice">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-primary">
                Gerar Nova Invoice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invoiceNumber">Número do Invoice</Label>
                    <Input
                      id="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                      placeholder="Ex: INV-001"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientName">Nome do Cliente ou Empresa</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="deliveryCity">Cidade/Estado de Entrega</Label>
                    <Input
                      id="deliveryCity"
                      value={formData.deliveryCity}
                      onChange={(e) => setFormData(prev => ({ ...prev, deliveryCity: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="orderDate">Data do Pedido</Label>
                    <Input
                      id="orderDate"
                      type="date"
                      value={formData.orderDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, orderDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="paymentDate">Data de Pagamento</Label>
                    <Input
                      id="paymentDate"
                      type="date"
                      value={formData.paymentDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentDate: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <Separator />

                <div>
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
                  
                  <div className="space-y-6 max-h-96 overflow-y-auto">
                    {productCategories.map((category, categoryIndex) => (
                      <div key={categoryIndex} className="space-y-3">
                        <h4 className="text-md font-semibold text-primary border-b pb-2">
                          {category.name}
                        </h4>
                        <div className="space-y-3">
                          {category.products.map((product, index) => {
                            const globalIndex = `${categoryIndex}-${index}`;
                            return (
                              <div key={globalIndex} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end p-3 border rounded-lg">
                                <div>
                                  <Label className="text-sm">{product.name}</Label>
                                </div>
                                <div>
                                  <Label htmlFor={`qty-${globalIndex}`} className="text-xs text-muted-foreground">
                                    Quantidade
                                  </Label>
                                  <Input
                                    id={`qty-${globalIndex}`}
                                    type="number"
                                    min="0"
                                    value={productQuantities[product.name] || ''}
                                    onChange={(e) => updateQuantity(product.name, parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`price-${globalIndex}`} className="text-xs text-muted-foreground">
                                    Valor Unitário (USD)
                                  </Label>
                                  <Input
                                    id={`price-${globalIndex}`}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={productPrices[product.name] || ''}
                                    onChange={(e) => updatePrice(product.name, parseFloat(e.target.value) || 0)}
                                    placeholder="0.00"
                                  />
                                </div>
                                <div className="text-right">
                                  <Label className="text-xs text-muted-foreground">Total</Label>
                                  <div className="font-semibold">
                                    ${((productQuantities[product.name] || 0) * (productPrices[product.name] || 0)).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    
                    {/* Manual Items */}
                    {manualItems.map((item) => (
                      <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end p-3 border rounded-lg bg-muted/30">
                        <div>
                          <Label htmlFor={`manual-product-${item.id}`} className="text-xs text-muted-foreground">
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
                          <Label htmlFor={`manual-qty-${item.id}`} className="text-xs text-muted-foreground">
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
                          <Label htmlFor={`manual-price-${item.id}`} className="text-xs text-muted-foreground">
                            Valor Unitário (USD)
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
                        <div className="text-right">
                          <Label className="text-xs text-muted-foreground">Total</Label>
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
                    ))}
                  </div>
                </div>

                <Button type="submit" variant="gradient" size="lg" className="w-full">
                  Gerar Invoice
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="print:shadow-none">
            <Card className="shadow-invoice print:shadow-none print:border-2 print:border-primary">
              <CardContent className="p-8">
                {/* Invoice Header */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-primary mb-2">
                    INVOICE #{invoiceData?.invoiceNumber}
                  </h1>
                  <div className="space-y-1 text-sm">
                    <p><strong>Empresa:</strong> Don Cabral</p>
                    <p><strong>Endereço:</strong> 180 East Mount Pleasant Ave, Livingston, NJ 07039</p>
                    <p><strong>Instagram:</strong> @doncabral</p>
                    <p><strong>Website:</strong> doncabral.com</p>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Client Information */}
                <div className="mb-8 space-y-2">
                  <p><strong>Cliente:</strong> {invoiceData?.clientName}</p>
                  <p><strong>Entrega:</strong> {invoiceData?.deliveryCity}</p>
                  <p><strong>Data do Pedido:</strong> {invoiceData?.orderDate}</p>
                  <p><strong>Data de Pagamento:</strong> {invoiceData?.paymentDate}</p>
                </div>

                {/* Products Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-3 text-left">Produto</th>
                        <th className="border border-border p-3 text-center">Qtd</th>
                        <th className="border border-border p-3 text-center">Valor Unitário (USD)</th>
                        <th className="border border-border p-3 text-center">Total (USD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData?.items.map((item, index) => (
                        <tr key={index}>
                          <td className="border border-border p-3">{item.product}</td>
                          <td className="border border-border p-3 text-center">{item.quantity}</td>
                          <td className="border border-border p-3 text-center">${item.unitPrice.toFixed(2)}</td>
                          <td className="border border-border p-3 text-center">${item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted font-bold">
                        <td colSpan={3} className="border border-border p-3 text-right">Total Geral</td>
                        <td className="border border-border p-3 text-center">${invoiceData?.grandTotal.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Signatures */}
                <div className="flex justify-between mt-16 mb-8">
                  <div className="text-center w-2/5">
                    <div className="border-t border-foreground pt-2">
                      <p className="font-medium">{invoiceData?.clientName}</p>
                      <p className="text-sm text-muted-foreground">Assinatura do Cliente</p>
                    </div>
                  </div>
                  <div className="text-center w-2/5">
                    <div className="border-t border-foreground pt-2">
                      <p className="font-medium">Don Cabral</p>
                      <p className="text-sm text-muted-foreground">Assinatura da Empresa</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 print:hidden">
                  <Button 
                    onClick={handlePrint} 
                    variant="export" 
                    size="lg" 
                    className="flex-1"
                  >
                    Exportar PDF / Imprimir
                  </Button>
                  <Button 
                    onClick={() => setShowInvoice(false)} 
                    variant="outline" 
                    size="lg"
                    className="flex-1"
                  >
                    Nova Invoice
                  </Button>
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