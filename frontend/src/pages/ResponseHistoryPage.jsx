import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Form, Modal, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import './ActiveRequestsPage.css'; // We can reuse the same styles
import './ResponseHistoryPage.css';

const ResponseHistoryPage = () => {
    const [resolvedRequests, setResolvedRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            const { data } = await axios.get('/api/requests');
            const resolved = data.filter(req => req.status === 'Resolved');
            setResolvedRequests(resolved);
        };
        fetchHistory();
    }, []);

    const handleShowDetails = (req) => {
        setSelectedRequest(req);
        setShowModal(true);
    };

    const filteredHistory = resolvedRequests.filter(req => 
        req.emergencyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req._id.slice(-6).includes(searchTerm)
    );

    return (
        <>
            <Card className="stat-card">
                <Card.Body>
                    <Card.Title>Response History</Card.Title>
                    <div className="filter-bar">
                        <Form.Control
                            type="text"
                            placeholder="Search by type or ID..."
                            style={{ width: '300px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Table responsive borderless className="active-requests-table history-table">
                        <thead>
                            <tr><th>Status</th><th>Incident ID</th><th>Emergency Type</th><th>Date Resolved</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filteredHistory.map(req => (
                                <tr key={req._id} onClick={() => handleShowDetails(req)}>
                                    <td><Badge pill bg="success">{req.status}</Badge></td>
                                    <td>#ER-{req._id.slice(-6)}</td>
                                    <td>{req.emergencyType}</td>
                                    <td>{new Date(req.updatedAt).toLocaleDateString()}</td>
                                    <td>
                                        <Button variant="outline-secondary" size="sm" onClick={(e) => {e.stopPropagation(); handleShowDetails(req);}}>
                                            View Details
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Details Modal (Read-Only) */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Archived Incident Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRequest && (
                         <Row>
                            <Col md={6}>
                                <h4>{selectedRequest.emergencyType} <Badge bg="success">{selectedRequest.status}</Badge></h4>
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
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ResponseHistoryPage;
