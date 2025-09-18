import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5 mb-5">
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <Card className="p-4">
                        <h1 className="text-center mb-4">Responder Login</h1>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={submitHandler}>
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
                            <div className="d-grid">
                                <Button type="submit" variant="primary" disabled={loading}>
                                    {loading ? 'Logging In...' : 'Login'}
                                </Button>
                            </div>
                        </Form>
                        <Row className="py-3">
                            <Col>
                                New Responder? <Link to="/register">Register Here</Link>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;
