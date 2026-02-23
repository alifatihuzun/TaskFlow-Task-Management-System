import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await authService.login({ email, password });
            login(result);
            navigate('/');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Giriş başarısız oldu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">📋</span>
                    <h1>TaskFlow</h1>
                    <p>Kurumsal Görev Yönetim Sistemi</p>
                </div>
                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>Giriş Yap</h2>
                    {error && <div className="alert alert-error" id="login-error">{error}</div>}
                    <div className="form-group">
                        <label htmlFor="email">E-posta</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ornek@sirket.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Şifre</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full" disabled={loading} id="login-submit">
                        {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                    </button>
                    <p className="auth-link">
                        Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
