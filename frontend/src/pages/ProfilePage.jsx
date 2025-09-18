import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const ProfilePage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const { token } = JSON.parse(localStorage.getItem('userInfo'));
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        const fetchUserProfile = async () => {
            const { data } = await axios.get('/api/users/profile', config);
            setName(data.name);
            setEmail(data.email);
        };
        fetchUserProfile();
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        try {
            const { data } = await axios.put('/api/users/profile', { name, email }, config);
            // Update local storage as well
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            userInfo.name = data.name;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            setMessage('Profile Updated Successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <Card className="stat-card">
            <Card.Body>
                <h2>User Profile</h2>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name" className="my-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="email" className="my-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <Button type="submit" variant="primary">Update Profile</Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default ProfilePage;
