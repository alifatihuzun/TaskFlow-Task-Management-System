import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import type { TaskResponseDto } from '../types';
import { getStatusLabel, getPriorityLabel, getPriorityColor, getStatusColor, formatDate } from '../utils/helpers';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<TaskResponseDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await taskService.getTasks();
                setTasks(data);
            } catch {
                console.error('Görevler yüklenemedi.');
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const todoCount = tasks.filter((t) => t.status === 'Todo').length;
    const inProgressCount = tasks.filter((t) => t.status === 'InProgress').length;
    const doneCount = tasks.filter((t) => t.status === 'Done').length;
    const totalCount = tasks.length;

    const recentTasks = tasks.slice(0, 5);

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-spinner">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Hoş Geldiniz, {user?.fullName} 👋</h1>
                <p>Görev durumunuza genel bakış</p>
            </div>

            <div className="stats-grid" id="dashboard-stats">
                <div className="stat-card stat-total">
                    <div className="stat-number">{totalCount}</div>
                    <div className="stat-label">Toplam Görev</div>
                </div>
                <div className="stat-card stat-todo">
                    <div className="stat-number">{todoCount}</div>
                    <div className="stat-label">Yapılacak</div>
                </div>
                <div className="stat-card stat-progress">
                    <div className="stat-number">{inProgressCount}</div>
                    <div className="stat-label">Devam Ediyor</div>
                </div>
                <div className="stat-card stat-done">
                    <div className="stat-number">{doneCount}</div>
                    <div className="stat-label">Tamamlandı</div>
                </div>
            </div>

            <div className="section">
                <div className="section-header">
                    <h2>Son Görevler</h2>
                    <Link to="/tasks" className="btn btn-outline btn-sm">Tümünü Gör →</Link>
                </div>
                {recentTasks.length === 0 ? (
                    <div className="empty-state">
                        <p>Henüz görev bulunmuyor.</p>
                        <Link to="/tasks" className="btn btn-primary">İlk Görevi Oluştur</Link>
                    </div>
                ) : (
                    <div className="recent-tasks-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Başlık</th>
                                    <th>Öncelik</th>
                                    <th>Durum</th>
                                    <th>Bitiş Tarihi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTasks.map((task) => (
                                    <tr key={task.id}>
                                        <td className="task-title-cell">{task.title}</td>
                                        <td>
                                            <span className="badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                                                {getPriorityLabel(task.priority)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge" style={{ backgroundColor: getStatusColor(task.status) }}>
                                                {getStatusLabel(task.status)}
                                            </span>
                                        </td>
                                        <td>{formatDate(task.dueDate)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
