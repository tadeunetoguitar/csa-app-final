import React, { useState } from 'react';
import { supabase } from '../src/integrations/supabase/client';
import { Loader2, Lock } from 'lucide-react';

interface PurchasePageProps {
  onGoToLogin: () => void;
}

// Link de pagamento da Hotmart (SUBSTITUA ESTE LINK PELO SEU LINK REAL DA HOTMART)
// NOTA: Certifique-se de que a Hotmart está configurada para redirecionar para este URL após a compra.
const HOTMART_BASE_LINK = "https://pay.hotmart.com/S103335808T?off=fatjd0zq&checkoutMode=10&bid=1765308920310";

const getHotmartPaymentLink = () => {
  // Redireciona para a página de sucesso após a compra.
  // Se possível, configure a Hotmart para incluir o email do comprador na URL de retorno (ex: &email={customer_email})
  const returnUrl = `${window.location.origin}/?purchase_success=true`; 
  const encodedReturnUrl = encodeURIComponent(returnUrl);
  
  return `${HOTMART_BASE_LINK}&return_url=${encodedReturnUrl}`;
};

export const PurchasePage: React.FC<PurchasePageProps> = ({ onGoToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = () => {
    setIsLoading(true);
    // Redireciona para o link de pagamento da Hotmart
    window.location.href = getHotmartPaymentLink();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary-blue relative overflow-hidden px-4">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.3]"
      >
        <source src="https://www.pexels.com/download/video/34220585/" type="video/mp4" />
        Seu navegador não suporta a tag de vídeo.
      </video>
      
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-lg border border-slate-200 relative z-10">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-100">
          <Lock className="h-6 w-6 text-brand-600" />
        </div>
        <h2 className="mt-6 text-2xl font-serif font-bold text-slate-900">
          Desbloqueie o Acesso Completo
        </h2>
        <p className="mt-2 text-slate-500">
          Adquira acesso vitalício ao guia interativo "Como o Subconsciente Aprende" e comece sua jornada de transformação.
        </p>
        <div className="mt-8">
          <button
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-700 hover:shadow-brand-500/30 transition-all active:scale-95 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Redirecionando...
              </>
            ) : (
              `Comprar Acesso Vitalício`
            )}
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <button 
            onClick={onGoToLogin} 
            className="text-sm text-slate-500 hover:text-brand-600 underline transition-colors block w-full"
          >
            Já comprou? Faça o login
          </button>
        </div>
      </div>
    </div>
  );
};