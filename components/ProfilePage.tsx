import React, { useState, useEffect } from 'react';
import { supabase } from '../src/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Loader2, Save, User, KeyRound, AlertCircle, CheckCircle } from 'lucide-react';
import { PasswordRecoveryView } from './PasswordRecoveryView';

interface ProfilePageProps {
  session: Session;
  onBack: () => void;
  isRecovery?: boolean;
}

// Função para formatar o número de telefone
const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  
  const digitsOnly = value.replace(/\D/g, '');
  const truncated = digitsOnly.slice(0, 11);
  
  let result = '';
  if (truncated.length > 0) {
    result = `(${truncated.slice(0, 2)}`;
  }
  if (truncated.length > 2) {
    result += `) ${truncated.slice(2, 7)}`;
  }
  if (truncated.length > 7) {
    result += `-${truncated.slice(7)}`;
  }
  
  return result;
};

export const ProfilePage: React.FC<ProfilePageProps> = ({ session, onBack, isRecovery = false }) => {
  if (isRecovery) {
    return <PasswordRecoveryView session={session} onBack={onBack} />;
  }

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', session.user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setFullName(data.full_name || '');
          setPhone(data.phone || '');
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setMessage({ type: 'error', text: 'Não foi possível carregar seus dados.' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [session.user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }
    if (password && password.length < 6) {
        setMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres.' });
        return;
    }

    setSaving(true);

    try {
      // Update profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName, phone })
        .eq('id', session.user.id);
      if (profileError) throw profileError;

      // Update password only if provided
      if (password) {
        const { error: authError } = await supabase.auth.updateUser({ password });
        if (authError) throw authError;
      }

      setMessage({ type: 'success', text: 'Dados atualizados com sucesso!' });
      setPassword('');
      setConfirmPassword('');

    } catch (error: any) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: error.message || 'Ocorreu um erro ao salvar.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhone(formattedPhoneNumber);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 lg:py-16 animate-fadeIn">
      <header className="mb-10 border-b border-slate-200 pb-6">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-3">
          Minha Conta
        </h1>
        <p className="text-lg text-slate-500">
          Gerencie seus dados e sua senha.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3"><User className="w-5 h-5 text-brand-600"/> Dados Pessoais</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
              <input 
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input 
                type="email"
                value={session.user.email}
                disabled
                className="w-full p-3 bg-slate-100 border border-slate-300 rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Telefone (Opcional)</label>
              <input 
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={15}
                placeholder="(XX) XXXXX-XXXX"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3"><KeyRound className="w-5 h-5 text-brand-600"/> Alterar Senha</h2>
          <p className="text-sm text-slate-500 mb-4">Deixe em branco se não quiser alterar a senha.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nova Senha</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Nova Senha</label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-4">
            <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-medium"
            >
                Voltar
            </button>
            <div className="flex items-center gap-4">
                {message && (
                    <div className={`flex items-center gap-2 text-sm font-medium p-2 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {message.text}
                    </div>
                )}
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-700 hover:shadow-brand-500/30 transition-all active:scale-95 font-medium disabled:opacity-70"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Salvar
                </button>
            </div>
        </div>
      </form>
    </div>
  );
};