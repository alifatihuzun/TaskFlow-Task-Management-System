import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const RegisterPage: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.register({ fullName, email, password });
            navigate('/login');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Kayıt başarısız oldu.');
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
                    <h2>Kayıt Ol</h2>
                    {error && <div className="alert alert-error" id="register-error">{error}</div>}
                    <div className="form-group">
                        <label htmlFor="fullName">Ad Soyad</label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Ad Soyad"
                            required
                            minLength={2}
                        />
                    </div>
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
                            placeholder="En az 6 karakter"
                            required
                            minLength={6}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full" disabled={loading} id="register-submit">
                        {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
                    </button>
                    <p className="auth-link">
                        Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
