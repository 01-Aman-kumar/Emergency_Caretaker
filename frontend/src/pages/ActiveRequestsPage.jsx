import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import io from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './ActiveRequestsPage.css';

const socket = io('http://localhost:5000');

const ActiveRequestsPage = () => {
    const [allRequests, setAllRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [filter, setFilter] = useState('All');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
            const { data } = await axios.get('/api/requests');
            setAllRequests(data);
        };
        fetchRequests();

        socket.on('newHelpRequest', (newRequest) => {
            setAllRequests(prev => [newRequest, ...prev]);
        });
        
        socket.on('requestUpdated', (updatedRequest) => {
            setAllRequests(prev => prev.map(req => req._id === updatedRequest._id ? updatedRequest : req));
        });

        return () => {
            socket.off('newHelpRequest');
            socket.off('requestUpdated');
        };
    }, []);

    useEffect(() => {
        const active = allRequests.filter(req => req.status !== 'Resolved');
        if (filter === 'All') {
            setFilteredRequests(active);
        } else {
            setFilteredRequests(active.filter(req => req.status === filter));
        }
    }, [allRequests, filter]);

    const handleShowDetails = (req) => {
        setSelectedRequest(req);
        setShowModal(true);
    };

    const handleUpdateStatus = async (reqId, newStatus) => {
        await axios.put(`/api/requests/${reqId}`, { status: newStatus });
        if (showModal) setShowModal(false);
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Pending': return 'warning';
            case 'In Progress': return 'info';
            case 'On Scene': return 'primary';
            default: return 'secondary';
        }
    };

    const getNextAction = (status) => {
        switch (status) {
            case 'Pending': return { action: 'In Progress', label: 'Accept' };
            case 'In Progress': return { action: 'On Scene', label: 'Arrived on Scene' };
            case 'On Scene': return { action: 'Resolved', label: 'Mark as Resolved' };
            default: return null;
        }
    };

    return (
        <>
            <Card className="stat-card">
                <Card.Body>
                    <Card.Title>Active Emergency Requests</Card.Title>
                    <div className="filter-bar">
                        <Form.Label className="me-2">Filter by Status:</Form.Label>
                        <Form.Select style={{width: '200px'}} value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="All">All Active</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="On Scene">On Scene</option>
                        </Form.Select>
                    </div>

                    <Table responsive borderless className="active-requests-table">
                        <thead>
                            <tr><th>Status</th><th>Incident</th><th>Victims</th><th>Reported At</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map(req => (
                                <tr key={req._id} onClick={() => handleShowDetails(req)}>
                                    <td><Badge pill bg={getStatusVariant(req.status)}>{req.status}</Badge></td>
                                    <td><strong>{req.emergencyType}</strong><br /><small className="text-muted">ID: {req._id.slice(-6)}</small></td>
                                    <td>{req.victimCount}</td>
                                    <td>{new Date(req.createdAt).toLocaleTimeString()}</td>
                                    <td className="action-buttons">
                                        <Button variant="outline-secondary" size="sm" onClick={(e) => {e.stopPropagation(); handleShowDetails(req);}}>Details</Button>
                                        {getNextAction(req.status) && (
                                            <Button variant="primary" size="sm" onClick={(e) => {e.stopPropagation(); handleUpdateStatus(req._id, getNextAction(req.status).action);}}>
                                                {getNextAction(req.status).label}
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Details Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton><Modal.Title>Incident Details</Modal.Title></Modal.Header>
                <Modal.Body>
                    {selectedRequest && (
                        <Row>
                            <Col md={6}>
                                <h4>{selectedRequest.emergencyType} <Badge bg={getStatusVariant(selectedRequest.status)}>{selectedRequest.status}</Badge></h4>
                                <p><strong>Contact:</strong> {selectedRequest.contactNumber}</p>
                                <p><strong>Victims:</strong> {selectedRequest.victimCount}</p>
                                <p><strong>Medical Info:</strong> {selectedRequest.medicalInfo || 'N/A'}</p>
                                {selectedRequest.image && <img src={`http://localhost:5000${selectedRequest.image}`} alt="Incident" className="img-fluid rounded" />}
                            </Col>
                            <Col md={6}>
                                <MapContainer center={[selectedRequest.location.coordinates[1], selectedRequest.location.coordinates[0]]} zoom={15} style={{ height: '300px', width: '100%' }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={[selectedRequest.location.coordinates[1], selectedRequest.location.coordinates[0]]} />
                                </MapContainer>
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {selectedRequest && getNextAction(selectedRequest.status) && (
                        <Button variant="success" onClick={() => handleUpdateStatus(selectedRequest._id, getNextAction(selectedRequest.status).action)}>
                            {getNextAction(selectedRequest.status).label}
                        </Button>
                    )}
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ActiveRequestsPage;
