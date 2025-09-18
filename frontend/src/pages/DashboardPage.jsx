import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Badge } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import io from 'socket.io-client';
import './DashboardPage.css';

const socket = io('http://localhost:5000'); // Connect to the backend server

const DashboardPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data } = await axios.get('/api/requests');
                setRequests(data);
                if (data.length > 0) {
                    setSelectedRequest(data[0]);
                }
            } catch (err) {
                setError('Failed to fetch emergency requests.');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    useEffect(() => {
        // Listen for new requests from the server
        socket.on('newHelpRequest', (newRequest) => {
            setRequests((prevRequests) => [newRequest, ...prevRequests]);
            // If it's the first request, select it
            if (!selectedRequest) {
                setSelectedRequest(newRequest);
            }
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            socket.off('newHelpRequest');
        };
    }, [selectedRequest]);

    const handleCardClick = (request) => {
        setSelectedRequest(request);
    };

    return (
        <Container fluid className="dashboard-container">
            <Row className="h-100">
                {/* Left Column: Incident List */}
                <Col md={4} className="incident-list-col">
                    <h3 className="mb-3">Live Incidents</h3>
                    {loading && <Spinner animation="border" />}
                    {error && <p className="text-danger">{error}</p>}
                    <div className="incident-list">
                        {requests.map((req) => (
                            <Card 
                                key={req._id} 
                                className={`incident-card status-${req.status} ${selectedRequest?._id === req._id ? 'selected' : ''}`}
                                onClick={() => handleCardClick(req)}
                            >
                                <Card.Body>
                                    <Card.Title>{req.emergencyType}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        Victims: {req.victimCount}
                                    </Card.Subtitle>
                                    <Card.Text className="d-flex justify-content-between align-items-center">
                                        <small>{new Date(req.createdAt).toLocaleString()}</small>
                                        <Badge bg={req.status === 'Pending' ? 'warning' : 'primary'}>{req.status}</Badge>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                </Col>

                {/* Right Column: Map */}
                <Col md={8} className="dashboard-map-col">
                    <div className="dashboard-map-container">
                        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {requests.map((req) => (
                                <Marker
                                    key={req._id}
                                    position={[req.location.coordinates[1], req.location.coordinates[0]]}
                                >
                                    <Popup>
                                        <strong>{req.emergencyType}</strong><br/>
                                        Victims: {req.victimCount}<br/>
                                        Status: {req.status}
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardPage;
