import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantById, getRestaurantTables, getRestaurantTimeSlots, getRestaurantReservations, createTable, createTimeSlot, updateReservationStatus } from '../../services/api';

const RestaurantManagement = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [tables, setTables] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('reservations');
  const [showTableForm, setShowTableForm] = useState(false);
  const [showSlotForm, setShowSlotForm] = useState(false);

  const [tableForm, setTableForm] = useState({ table_number: '', capacity: 2 });
  const [slotForm, setSlotForm] = useState({ slot_time: '12:00', duration_minutes: 60, max_tables: 10 });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [restaurantRes, tablesRes, timeSlotsRes, reservationsRes] = await Promise.all([
        getRestaurantById(id),
        getRestaurantTables(id),
        getRestaurantTimeSlots(id),
        getRestaurantReservations(id)
      ]);
      setRestaurant(restaurantRes.data);
      setTables(tablesRes.data);
      setTimeSlots(timeSlotsRes.data);
      setReservations(reservationsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    try {
      await createTable(id, tableForm);
      alert('Table added successfully!');
      setShowTableForm(false);
      setTableForm({ table_number: '', capacity: 2 });
      loadData();
    } catch (error) {
      alert('Failed to add table');
    }
  };

  const handleAddTimeSlot = async (e) => {
    e.preventDefault();
    try {
      await createTimeSlot(id, slotForm);
      alert('Time slot added successfully!');
      setShowSlotForm(false);
      setSlotForm({ slot_time: '12:00', duration_minutes: 60, max_tables: 10 });
      loadData();
    } catch (error) {
      alert('Failed to add time slot');
    }
  };

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      await updateReservationStatus(reservationId, newStatus);
      alert('Status updated successfully!');
      loadData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (!restaurant) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{restaurant.name}</h1>

      <div style={styles.tabs}>
        <button onClick={() => setActiveTab('reservations')} style={activeTab === 'reservations' ? styles.activeTab : styles.tab}>Reservations</button>
        <button onClick={() => setActiveTab('tables')} style={activeTab === 'tables' ? styles.activeTab : styles.tab}>Tables</button>
        <button onClick={() => setActiveTab('timeslots')} style={activeTab === 'timeslots' ? styles.activeTab : styles.tab}>Time Slots</button>
      </div>

      {activeTab === 'reservations' && (
        <div>
          <h2>Reservations ({reservations.length})</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Time</th>
                  <th style={styles.th}>Table</th>
                  <th style={styles.th}>Guests</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res.id}>
                    <td style={styles.td}>{res.user_name}<br/><small>{res.user_email}</small></td>
                    <td style={styles.td}>{new Date(res.reservation_date).toLocaleDateString()}</td>
                    <td style={styles.td}>{res.slot_time}</td>
                    <td style={styles.td}>{res.table_number}</td>
                    <td style={styles.td}>{res.guest_count}</td>
                    <td style={styles.td}><span style={{...styles.statusBadge, background: res.status === 'confirmed' ? '#28a745' : '#ffa500'}}>{res.status}</span></td>
                    <td style={styles.td}>
                      {res.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatusChange(res.id, 'confirmed')} style={{...styles.actionBtn, background: '#28a745'}}>Confirm</button>
                          <button onClick={() => handleStatusChange(res.id, 'cancelled')} style={{...styles.actionBtn, background: '#dc3545'}}>Cancel</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tables' && (
        <div>
          <div style={styles.sectionHeader}>
            <h2>Tables ({tables.length})</h2>
            <button onClick={() => setShowTableForm(!showTableForm)} style={styles.addBtn}>
              {showTableForm ? 'Cancel' : '+ Add Table'}
            </button>
          </div>

          {showTableForm && (
            <form onSubmit={handleAddTable} style={styles.form}>
              <input type="text" placeholder="Table Number *" required value={tableForm.table_number} onChange={(e) => setTableForm({...tableForm, table_number: e.target.value})} style={styles.input} />
              <input type="number" placeholder="Capacity *" required min="1" value={tableForm.capacity} onChange={(e) => setTableForm({...tableForm, capacity: e.target.value})} style={styles.input} />
              <button type="submit" style={styles.submitBtn}>Add Table</button>
            </form>
          )}

          <div style={styles.grid}>
            {tables.map((table) => (
              <div key={table.id} style={styles.card}>
                <h3>Table {table.table_number}</h3>
                <p>Capacity: {table.capacity} guests</p>
                <p>Status: {table.is_available ? '🟢 Available' : '🔴 Occupied'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'timeslots' && (
        <div>
          <div style={styles.sectionHeader}>
            <h2>Time Slots ({timeSlots.length})</h2>
            <button onClick={() => setShowSlotForm(!showSlotForm)} style={styles.addBtn}>
              {showSlotForm ? 'Cancel' : '+ Add Time Slot'}
            </button>
          </div>

          {showSlotForm && (
            <form onSubmit={handleAddTimeSlot} style={styles.form}>
              <input type="time" required value={slotForm.slot_time} onChange={(e) => setSlotForm({...slotForm, slot_time: e.target.value})} style={styles.input} />
              <input type="number" placeholder="Duration (minutes)" required value={slotForm.duration_minutes} onChange={(e) => setSlotForm({...slotForm, duration_minutes: e.target.value})} style={styles.input} />
              <input type="number" placeholder="Max Tables" required value={slotForm.max_tables} onChange={(e) => setSlotForm({...slotForm, max_tables: e.target.value})} style={styles.input} />
              <button type="submit" style={styles.submitBtn}>Add Time Slot</button>
            </form>
          )}

          <div style={styles.grid}>
            {timeSlots.map((slot) => (
              <div key={slot.id} style={styles.card}>
                <h3>{slot.slot_time}</h3>
                <p>Duration: {slot.duration_minutes} minutes</p>
                <p>Max Tables: {slot.max_tables}</p>
                <p>Status: {slot.is_active ? '🟢 Active' : '🔴 Inactive'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
  title: { fontSize: '2rem', marginBottom: '2rem' },
  tabs: { display: 'flex', gap: '1rem', marginBottom: '2rem' },
  tab: { padding: '0.75rem 1.5rem', background: 'white', border: '2px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  activeTab: { padding: '0.75rem 1.5rem', background: '#667eea', color: 'white', border: '2px solid #667eea', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  addBtn: { padding: '0.75rem 1.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  form: { background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  input: { flex: 1, minWidth: '200px', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' },
  submitBtn: { padding: '0.75rem 2rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' },
  card: { background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  tableContainer: { overflowX: 'auto' },
  table: { width: '100%', background: 'white', borderCollapse: 'collapse', borderRadius: '12px', overflow: 'hidden' },
  th: { background: '#667eea', color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '600' },
  td: { padding: '1rem', borderBottom: '1px solid #eee' },
  statusBadge: { padding: '0.25rem 0.75rem', borderRadius: '20px', color: 'white', fontSize: '0.85rem', fontWeight: '600' },
  actionBtn: { padding: '0.5rem 1rem', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.85rem' },
  loading: { textAlign: 'center', padding: '4rem', fontSize: '1.2rem' },
};

export default RestaurantManagement;