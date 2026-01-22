import React, { useState } from 'react';
import { Calendar as CalendarIcon, List, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import './OwnerDashboard.css';

const Reservations = () => {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const [activeTab, setActiveTab] = useState('upcoming');

    // Mock Data
    const reservations = [
        { id: 1, name: 'John Doe', people: 4, date: '2023-11-20', time: '19:00', status: 'confirmed', table: 'T-4' },
        { id: 2, name: 'Sarah Smith', people: 2, date: '2023-11-20', time: '20:30', status: 'pending', table: '-' },
        { id: 3, name: 'Michael Brown', people: 6, date: '2023-11-21', time: '18:00', status: 'confirmed', table: 'T-8' },
        { id: 4, name: 'Emily Davis', people: 3, date: '2023-11-21', time: '19:30', status: 'cancelled', table: '-' },
    ];

    const filteredReservations = reservations.filter(res => {
        if (activeTab === 'upcoming') return res.status !== 'cancelled';
        if (activeTab === 'history') return res.status === 'cancelled' || res.status === 'completed';
        return true;
    });

    return (
        <div className="reservations-frame">
            <header className="frame-header">
                <div>
                    <h2 className="frame-title">Reservations</h2>
                    <p className="frame-subtitle">Manage table bookings</p>
                </div>
                <div className="view-toggle">
                    <button
                        className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                    >
                        <List size={20} />
                    </button>
                    <button
                        className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                        onClick={() => setViewMode('calendar')}
                    >
                        <CalendarIcon size={20} />
                    </button>
                </div>
            </header>

            {/* List View */}
            {viewMode === 'list' && (
                <div className="reservations-list-view">
                    <div className="tabs">
                        <button
                            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setActiveTab('upcoming')}
                        >
                            Upcoming
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                            onClick={() => setActiveTab('history')}
                        >
                            History
                        </button>
                    </div>

                    <div className="reservations-grid">
                        {filteredReservations.map(res => (
                            <div key={res.id} className="reservation-card">
                                <div className="res-header">
                                    <span className="res-time">{res.time}</span>
                                    <span className={`res-status status-${res.status}`}>{res.status}</span>
                                </div>
                                <h3 className="res-name">{res.name}</h3>
                                <div className="res-details">
                                    <div className="res-detail-item">
                                        <CalendarIcon size={16} />
                                        <span>{res.date}</span>
                                    </div>
                                    <div className="res-detail-item">
                                        <Users size={16} />
                                        <span>{res.people} Guests</span>
                                    </div>
                                    <div className="res-detail-item">
                                        <div className="table-badge">{res.table !== '-' ? res.table : 'Unassigned'}</div>
                                    </div>
                                </div>
                                <div className="res-actions">
                                    <button className="res-action-btn accept">Assign Table</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Calendar View Placeholder */}
            {viewMode === 'calendar' && (
                <div className="calendar-view-placeholder">
                    <CalendarIcon size={48} color="#cbd5e1" />
                    <p>Calendar View Integration Coming Soon</p>
                </div>
            )}
        </div>
    );
};

export default Reservations;
