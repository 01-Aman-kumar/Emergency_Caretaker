import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post('/api/auth/register', { name, email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5 mb-5">
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <Card className="p-4">
                        <h1 className="text-center mb-4">Responder Registration</h1>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={submitHandler}>
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="confirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <div className="d-grid">
                                <Button type="submit" variant="success" disabled={loading}>
                                    {loading ? 'Registering...' : 'Register'}
                                </Button>
                            </div>
                        </Form>
                        <Row className="py-3">
                            <Col>
                                Already have an account? <Link to="/login">Login Here</Link>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterPage;
