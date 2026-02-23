import React from 'react';
import type { TaskResponseDto } from '../types';
import { formatDate, getPriorityColor, getStatusColor, getStatusLabel, getPriorityLabel } from '../utils/helpers';

interface TaskCardProps {
    task: TaskResponseDto;
    onEdit: (task: TaskResponseDto) => void;
    onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
    return (
        <div className="task-card" id={`task-card-${task.id}`}>
            <div className="task-card-header">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-badges">
                    <span
                        className="badge"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                    >
                        {getPriorityLabel(task.priority)}
                    </span>
                    <span
                        className="badge"
                        style={{ backgroundColor: getStatusColor(task.status) }}
                    >
                        {getStatusLabel(task.status)}
                    </span>
                </div>
            </div>
            {task.description && (
                <p className="task-description">{task.description}</p>
            )}
            <div className="task-card-footer">
                <span className="task-date">
                    📅 {task.dueDate ? formatDate(task.dueDate) : 'Tarih yok'}
                </span>
                <div className="task-actions">
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onEdit(task)}
                        id={`edit-task-${task.id}`}
                    >
                        Düzenle
                    </button>
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(task.id)}
                        id={`delete-task-${task.id}`}
                    >
                        Sil
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
