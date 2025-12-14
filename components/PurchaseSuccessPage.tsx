import React, { useState } from 'react';
import { CheckCircle, Mail, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../src/integrations/supabase/client';

interface PurchaseSuccessPageProps {
  onGoToLogin: () => void;
}

export const PurchaseSuccessPage: React.FC<PurchaseSuccessPageProps> = ({ onGoToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!email) {
      setMessage({ type: 'error', text: 'Por favor, insira seu e-mail de compra.' });
      setLoading(false);
      return;
    }

    try {
      // 1. Verificar se o usuário existe (para evitar spam de reset)
      const { data: userExists, error: rpcError } = await supabase.rpc('user_exists', { p_email: email });
      if (rpcError) throw rpcError;

      if (userExists) {
        // 2. Se existir, enviar o e-mail de recuperação/criação de senha
        // Usamos resetPasswordForEmail para que o usuário possa definir a senha imediatamente.
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (resetError) throw resetError;
        
        setMessage({ type: 'success', text: 'Link de criação de senha enviado! Verifique seu e-mail.' });
        setEmailSent(true);
      } else {
        // Se o usuário não existe, é provável que o webhook ainda não tenha processado a compra.
        // Damos uma mensagem de espera, mas ainda guiamos para o login.
        setMessage({ type: 'error', text: 'Ainda não encontramos seu cadastro. Por favor, aguarde 1 minuto e tente novamente, ou clique em "Ir para a página de Login" e use o link enviado por e-mail.' });
      }
    } catch (error: any) {
      console.error("Error sending password reset:", error);
      setMessage({ type: 'error', text: 'Ocorreu um erro ao processar sua solicitação.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-lg border border-slate-200 animate-fadeIn">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="mt-6 text-2xl font-serif font-bold text-slate-900">
          Pagamento Aprovado!
        </h2>
        <p className="mt-2 text-slate-500">
          Parabéns por sua compra. Sua jornada de transformação começa agora.
        </p>
        
        <div className="mt-6 text-left bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                    <h3 className="font-bold text-blue-900">Próximo Passo: Crie sua Senha</h3>
                    <p className="text-sm text-blue-700 mt-1">
                        Para acessar o conteúdo, você precisa definir uma senha.
                    </p>
                </div>
            </div>
        </div>

        <div className="mt-6">
          {message && (
            <div className={`p-3 rounded-md text-sm mb-4 flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message.type === 'error' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {message.text}
            </div>
          )}
          
          {!emailSent ? (
            <form onSubmit={handleSendPasswordReset} className="space-y-4">
              <p className="text-sm text-slate-600 text-left">
                Insira o e-mail usado na compra para receber o link de criação de senha imediatamente:
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Seu e-mail de compra"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-slate-800"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all font-medium disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Receber Link de Senha'}
              </button>
            </form>
          ) : (
            <p className="text-sm text-green-700 font-medium mt-4">
              Verifique sua caixa de entrada (e spam) agora para definir sua senha.
            </p>
          )}
        </div>

        <div className="mt-8">
          <button
            onClick={onGoToLogin}
            className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-medium"
          >
            Ir para a página de Login
          </button>
        </div>
      </div>
    </div>
  );
};