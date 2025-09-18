import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const SettingsPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    
    const { token } = JSON.parse(localStorage.getItem('userInfo'));
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await axios.put('/api/users/profile', { password }, config);
            setMessage('Password Updated Successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <Card className="stat-card">
            <Card.Body>
                <h2>Change Password</h2>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="password">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="confirmPassword" className="my-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </Form.Group>
                    <Button type="submit" variant="primary">Update Password</Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default SettingsPage;
