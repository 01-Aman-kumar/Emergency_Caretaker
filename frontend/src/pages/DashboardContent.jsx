import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Table, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import io from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Compass, Telephone, Building, ExclamationCircle } from 'react-bootstrap-icons';
import './DashboardContent.css';

const socket = io('http://localhost:5000');

const DashboardContent = () => {
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
            const { data } = await axios.get('/api/requests');
            setRequests(data);
        };
        fetchRequests();

        socket.on('newHelpRequest', (newRequest) => setRequests(prev => [newRequest, ...prev]));
        socket.on('requestUpdated', (updatedRequest) => setRequests(prev => prev.map(req => req._id === updatedRequest._id ? updatedRequest : req)));

        return () => {
            socket.off('newHelpRequest');
            socket.off('requestUpdated');
        };
    }, []);
    
    useEffect(() => {
        // Automatically select the first pending request if none is selected
        if (!selectedRequest && requests.length > 0) {
            const firstPending = requests.find(r => r.status === 'Pending');
            if (firstPending) setSelectedRequest(firstPending);
            else setSelectedRequest(requests.find(r => r.status !== 'Resolved'));
        }
        updateStats(requests);
    }, [requests]);


    const updateStats = (currentRequests) => {
        setStats({
            total: currentRequests.length,
            completed: currentRequests.filter(r => r.status === 'Resolved').length,
            pending: currentRequests.filter(r => r.status === 'Pending').length,
        });
    };

    const handleShowDetails = (req) => setSelectedRequest(req);
    const handleAcceptRequest = async (reqId) => await axios.put(`/api/requests/${reqId}`, { status: 'In Progress' });

    const handleNavigation = () => {
        if (selectedRequest) {
            const { coordinates } = selectedRequest.location;
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}`, '_blank');
        }
    };
    
    const handleCall = () => {
        if (selectedRequest) {
            window.location.href = `tel:${selectedRequest.contactNumber}`;
        }
    };

    return (
        <>
            <Row>
                <Col lg={4} md={6} className="mb-4"><Card className="stat-card"><h4>Current Status</h4><p className="mb-1">Location: Yathart, sector-110</p><p>Vehicle: Ambulance #ER-205</p><Badge bg="success">Available</Badge></Card></Col>
                <Col lg={4} md={6} className="mb-4"><Card className="stat-card"><h4>Today's Activity</h4><h3>{stats.total} <small>Requests</small></h3><p>{stats.completed} Completed, {stats.pending} Pending</p></Card></Col>
                <Col lg={4} md={12} className="mb-4">
                    <Card className="stat-card">
                        <h4>Quick Actions</h4>
                        <Row>
                            <Col><Button variant="outline-primary" className="w-100" onClick={handleNavigation} disabled={!selectedRequest}><Compass /> Navigation</Button></Col>
                            <Col><Button variant="outline-success" className="w-100" onClick={handleCall} disabled={!selectedRequest}><Telephone /> Call Victim</Button></Col>
                        </Row>
                        <Row className="mt-2">
                             <Col><Button variant="outline-info" className="w-100" disabled><Building /> Hospital Info</Button></Col>
                             <Col><Button variant="outline-danger" className="w-100" disabled><ExclamationCircle /> Emergency</Button></Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            
            <Card className="stat-card mb-4">
                <h4>Active Emergency Requests</h4>
                <Table hover responsive className="mt-3">
                    <thead><tr><th>Status</th><th>Incident</th><th>Details</th><th>Actions</th></tr></thead>
                    <tbody>
                        {requests.filter(r => r.status !== 'Resolved').map(req => (
                            <tr key={req._id} className="incident-row" onClick={() => handleShowDetails(req)}>
                                <td><Badge pill bg={req.status === 'Pending' ? 'warning' : 'primary'}>{req.status}</Badge></td>
                                <td><strong>{req.emergencyType}</strong><br/><small>#ER-{req._id.slice(-6)}</small></td>
                                <td>{req.victimCount} victims</td>
                                <td>
                                    {req.status === 'Pending' && <Button variant="primary" size="sm" onClick={(e) => {e.stopPropagation(); handleAcceptRequest(req._id);}}>Accept</Button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            <Card className="stat-card">
                <h4 className="mb-3">Response Map</h4>
                <div className="response-map-card">
                    <MapContainer center={selectedRequest ? [selectedRequest.location.coordinates[1], selectedRequest.location.coordinates[0]] : [20.5937, 78.9629]} zoom={selectedRequest ? 13 : 5} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {requests.filter(req => req.status !== 'Resolved').map(req => (
                            <Marker key={req._id} position={[req.location.coordinates[1], req.location.coordinates[0]]}>
                                <Popup><strong>{req.emergencyType}</strong><br/>Status: {req.status}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </Card>
        </>
    );
};

export default DashboardContent;
