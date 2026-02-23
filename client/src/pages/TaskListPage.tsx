import React, { useEffect, useState } from 'react';
import { taskService } from '../services/taskService';
import type { TaskResponseDto, TaskCreateDto, TaskUpdateDto } from '../types';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';

const TaskListPage: React.FC = () => {
    const [tasks, setTasks] = useState<TaskResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPriority, setFilterPriority] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<TaskResponseDto | null>(null);

    // Form state
    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formPriority, setFormPriority] = useState('Medium');
    const [formStatus, setFormStatus] = useState('Todo');
    const [formDueDate, setFormDueDate] = useState('');
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await taskService.getTasks(
                filterStatus || undefined,
                filterPriority || undefined
            );
            setTasks(data);
        } catch {
            console.error('Görevler yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [filterStatus, filterPriority]);

    const openCreateModal = () => {
        setEditingTask(null);
        setFormTitle('');
        setFormDescription('');
        setFormPriority('Medium');
        setFormStatus('Todo');
        setFormDueDate('');
        setFormError('');
        setIsModalOpen(true);
    };

    const openEditModal = (task: TaskResponseDto) => {
        setEditingTask(task);
        setFormTitle(task.title);
        setFormDescription(task.description);
        setFormPriority(task.priority);
        setFormStatus(task.status);
        setFormDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
        setFormError('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        try {
            if (editingTask) {
                const dto: TaskUpdateDto = {
                    title: formTitle,
                    description: formDescription,
                    priority: formPriority,
                    status: formStatus,
                    dueDate: formDueDate || null,
                };
                await taskService.updateTask(editingTask.id, dto);
            } else {
                const dto: TaskCreateDto = {
                    title: formTitle,
                    description: formDescription,
                    priority: formPriority,
                    dueDate: formDueDate || null,
                };
                await taskService.createTask(dto);
            }
            setIsModalOpen(false);
            fetchTasks();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setFormError(error.response?.data?.message || 'İşlem başarısız oldu.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bu görevi silmek istediğinize emin misiniz?')) return;
        try {
            await taskService.deleteTask(id);
            fetchTasks();
        } catch {
            console.error('Görev silinemedi.');
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Görevlerim</h1>
                <button className="btn btn-primary" onClick={openCreateModal} id="create-task-button">
                    + Yeni Görev
                </button>
            </div>

            <div className="filters" id="task-filters">
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                    id="filter-status"
                >
                    <option value="">Tüm Durumlar</option>
                    <option value="Todo">Yapılacak</option>
                    <option value="InProgress">Devam Ediyor</option>
                    <option value="Done">Tamamlandı</option>
                    <option value="Cancelled">İptal Edildi</option>
                </select>
                <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="filter-select"
                    id="filter-priority"
                >
                    <option value="">Tüm Öncelikler</option>
                    <option value="Low">Düşük</option>
                    <option value="Medium">Orta</option>
                    <option value="High">Yüksek</option>
                    <option value="Critical">Kritik</option>
                </select>
            </div>

            {loading ? (
                <div className="loading-spinner">Yükleniyor...</div>
            ) : tasks.length === 0 ? (
                <div className="empty-state">
                    <p>Görev bulunamadı.</p>
                    <button className="btn btn-primary" onClick={openCreateModal}>
                        İlk Görevi Oluştur
                    </button>
                </div>
            ) : (
                <div className="task-grid">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTask ? 'Görevi Düzenle' : 'Yeni Görev Oluştur'}
            >
                <form onSubmit={handleSubmit} className="task-form">
                    {formError && <div className="alert alert-error">{formError}</div>}
                    <div className="form-group">
                        <label htmlFor="task-title">Başlık</label>
                        <input
                            id="task-title"
                            type="text"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            placeholder="Görev başlığı"
                            required
                            maxLength={200}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="task-description">Açıklama</label>
                        <textarea
                            id="task-description"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            placeholder="Görev açıklaması (opsiyonel)"
                            rows={3}
                            maxLength={2000}
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="task-priority">Öncelik</label>
                            <select
                                id="task-priority"
                                value={formPriority}
                                onChange={(e) => setFormPriority(e.target.value)}
                            >
                                <option value="Low">Düşük</option>
                                <option value="Medium">Orta</option>
                                <option value="High">Yüksek</option>
                                <option value="Critical">Kritik</option>
                            </select>
                        </div>
                        {editingTask && (
                            <div className="form-group">
                                <label htmlFor="task-status">Durum</label>
                                <select
                                    id="task-status"
                                    value={formStatus}
                                    onChange={(e) => setFormStatus(e.target.value)}
                                >
                                    <option value="Todo">Yapılacak</option>
                                    <option value="InProgress">Devam Ediyor</option>
                                    <option value="Done">Tamamlandı</option>
                                    <option value="Cancelled">İptal Edildi</option>
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="task-duedate">Bitiş Tarihi</label>
                        <input
                            id="task-duedate"
                            type="date"
                            value={formDueDate}
                            onChange={(e) => setFormDueDate(e.target.value)}
                        />
                    </div>
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => setIsModalOpen(false)}
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={formLoading}
                            id="task-submit"
                        >
                            {formLoading ? 'Kaydediliyor...' : editingTask ? 'Güncelle' : 'Oluştur'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default TaskListPage;
