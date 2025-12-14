import React, { useState } from 'react';
import { supabase } from '../src/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Loader2, Save, KeyRound, Brain } from 'lucide-react';

interface PasswordRecoveryViewProps {
  session: Session;
  onBack: () => void;
}

export const PasswordRecoveryView: React.FC<PasswordRecoveryViewProps> = ({ session, onBack }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!password) {
      setMessage({ type: 'error', text: 'Por favor, insira uma nova senha.' });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }
    if (password.length < 6) {
        setMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres.' });
        return;
    }

    setSaving(true);

    try {
      // Update password
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) throw authError;

      setMessage({ type: 'success', text: 'Senha atualizada! Redirecionando para o login...' });
      setPassword('');
      setConfirmPassword('');

      // Sign out and redirect to login after successful recovery
      await supabase.auth.signOut();
      setTimeout(() => onBack(), 2000);

    } catch (error: any) {
      console.error("Error updating password:", error);
      setMessage({ type: 'error', text: error.message || 'Ocorreu um erro ao salvar.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-primary-blue">
      {/* Content Container */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 relative z-10">
        <div className="p-8">
          <div className="text-center mb-6">
            <Brain className="w-10 h-10 text-brand-600 mx-auto mb-3" />
            <h1 className="text-3xl font-serif font-bold text-slate-800 leading-tight">
              Como o<br />Subconsciente<br />Aprende!
            </h1>
            <p className="text-slate-500 mt-2">Crie sua Nova Senha</p>
          </div>

          {message && (
            <div className={`p-3 rounded-md text-sm mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message.text}
            </div>
          )}

          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 text-sm text-yellow-800">
            <KeyRound className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Ação Necessária</p>
              <p className="mt-1">Você solicitou a redefinição de senha. Crie uma nova senha abaixo para continuar.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nova Senha</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Nova Senha</label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Salvar Nova Senha
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};