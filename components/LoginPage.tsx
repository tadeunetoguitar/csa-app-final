import React, { useState } from 'react';
import { supabase } from '../src/integrations/supabase/client';
import { Brain, Loader2, ArrowLeft } from 'lucide-react';

type AuthView = 'sign_in' | 'sign_up' | 'forgot_password';

export const LoginPage: React.FC = () => {
  const [view, setView] = useState<AuthView>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Novo estado para nome completo
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (view === 'sign_in') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (view === 'sign_up') {
        if (!fullName.trim()) {
          setMessage({ type: 'error', text: 'O campo Nome Completo é obrigatório.' });
          setLoading(false);
          return;
        }
        
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: fullName.trim(), // Enviando o nome completo como metadado
            }
          }
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Confirmação enviada! Verifique seu e-mail para ativar sua conta.' });
      }
    } catch (error: any) {
      const errorMessage = 
        error.message.includes('Invalid login credentials') ? 'E-mail ou senha inválidos.' :
        error.message.includes('User already registered') ? 'Este e-mail já está em uso.' :
        error.message.includes('Password should be at least 6 characters') ? 'A senha deve ter no mínimo 6 caracteres.' :
        'Ocorreu um erro. Tente novamente.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 1. Verificar se o usuário existe usando a função RPC
      const { data: userExists, error: rpcError } = await supabase.rpc('user_exists', { p_email: email });
      if (rpcError) throw rpcError;

      if (userExists) {
        // 2. Se existir, enviar o e-mail de recuperação
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (resetError) throw resetError;
        setMessage({ type: 'success', text: 'Link de redefinição enviado! Verifique seu e-mail.' });
      } else {
        // 3. Se não existir, mostrar a mensagem de erro personalizada
        setMessage({ type: 'error', text: 'O e-mail em questão não está cadastrado no sistema.' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Ocorreu um erro ao processar sua solicitação.' });
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (view) {
      case 'forgot_password':
        return (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Enviar Instruções'}
            </button>
          </form>
        );
      case 'sign_up':
        return (
          <form onSubmit={handleAuthAction} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Nome Completo</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Criar Conta'}
            </button>
          </form>
        );
      case 'sign_in':
      default:
        return (
          <form onSubmit={handleAuthAction} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
            </button>
          </form>
        );
    }
  };

  const getTitle = () => {
    switch (view) {
      case 'sign_in': return 'Acesse sua conta';
      case 'sign_up': return 'Crie sua conta';
      case 'forgot_password': return 'Recuperar Senha';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-primary-blue">
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

      {/* Content Container (z-index to ensure it's on top) */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 relative z-10">
        <div className="p-8">
          <div className="text-center mb-6">
            <Brain className="w-10 h-10 text-brand-600 mx-auto mb-3" />
            <h1 className="text-3xl font-serif font-bold text-slate-800 leading-tight">
              Como o<br />Subconsciente<br />Aprende!
            </h1>
            <p className="text-slate-500 mt-2">{getTitle()}</p>
          </div>

          {message && (
            <div className={`p-3 rounded-md text-sm mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message.text}
            </div>
          )}

          {renderForm()}

          <div className="mt-6 text-center text-sm">
            {view === 'sign_in' && (
              <>
                <button onClick={() => { setView('forgot_password'); setMessage(null); }} className="font-medium text-brand-600 hover:text-brand-500">
                  Esqueceu sua senha?
                </button>
                <p className="mt-2 text-slate-500">
                  Não tem uma conta?{' '}
                  <button onClick={() => { setView('sign_up'); setMessage(null); }} className="font-medium text-brand-600 hover:text-brand-500">
                    Crie sua conta
                  </button>
                </p>
              </>
            )}
            {view === 'sign_up' && (
              <p className="text-slate-500">
                Já tem uma conta?{' '}
                <button onClick={() => { setView('sign_in'); setMessage(null); }} className="font-medium text-brand-600 hover:text-brand-500">
                  Faça o login
                </button>
              </p>
            )}
            {view === 'forgot_password' && (
              <button onClick={() => { setView('sign_in'); setMessage(null); }} className="font-medium text-brand-600 hover:text-brand-500 flex items-center gap-2 mx-auto">
                <ArrowLeft className="w-4 h-4" /> Voltar para o Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};