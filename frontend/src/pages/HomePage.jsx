import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaBell, FaAmbulance, FaLaptopMedical, FaMapMarkedAlt, FaRoute } from 'react-icons/fa';
import { BsChatQuoteFill } from 'react-icons/bs';
import { Fade, Slide } from "react-awesome-reveal"; // Import animation components
import './HomePage.css';

const HomePage = () => {
    return (
        <>
            {/* --- Hero Section --- */}
            <div className="hero-section">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            {/* The cascade prop makes each element inside fade in one after another */}
                            <Fade direction="down" cascade damping={0.1} triggerOnce>
                                <h1>Immediate Emergency Assistance</h1>
                                <p>Connecting accident victims with the nearest emergency services and volunteers in real-time.</p>
                                <div>
                                    <LinkContainer to="/request-help" className='me-3'><Button variant="danger" size="lg">
                                        <i className="fa-solid fa-circle-plus me-1"></i>
                                        Request Help</Button></LinkContainer>
                                    <LinkContainer to="/login"><Button variant="primary" size="lg">
                                        <i className="fa-solid fa-user-shield m-1"></i>
                                        Responder Login</Button></LinkContainer>
                                </div>
                            </Fade>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* --- How It Works Section --- */}
            <section className="how-it-works-section">
                <Container>
                    <Fade direction="down" triggerOnce>
                        <h2>How It Works</h2>
                    </Fade>
                    <Row>
                        {/* Each column will slide in from the bottom with a slight delay */}
                        <Col md={4} className="text-center">
                            <Slide direction="up" delay={100} triggerOnce>
                                <div className="step-card">
                                    <div className="step-icon"><FaLaptopMedical /></div>
                                    <h4>1. Report Emergency</h4>
                                    <p>A user submits an emergency request with their location and critical details in seconds.</p>
                                </div>
                            </Slide>
                        </Col>
                        <Col md={4} className="text-center">
                            <Slide direction="up" delay={200} triggerOnce>
                                <div className="step-card">
                                    <div className="step-icon"><FaBell /></div>
                                    <h4>2. We Connect Help</h4>
                                    <p>The system instantly alerts the nearest available responders and volunteers.</p>
                                </div>
                            </Slide>
                        </Col>
                        <Col md={4} className="text-center">
                            <Slide direction="up" delay={300} triggerOnce>
                                <div className="step-card">
                                    <div className="step-icon"><FaAmbulance /></div>
                                    <h4>3. Help Arrives</h4>
                                    <p>Responders accept the request and are routed to the scene for immediate assistance.</p>
                                </div>
                            </Slide>
                        </Col>
                    </Row>
                </Container>
            </section>

             <div className="features-section">
                <Container>
                    <h2>Key Features</h2>
                    <Row>
                        <Col md={4} className="mb-4">
                            <Card className="feature-card">
                                <Card.Body>
                                    <FaBell className="feature-icon icon-red" />
                                    <h4>Instant Alerts</h4>
                                    <p>Immediate notification system to nearby emergency services and volunteers when an accident is reported.</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="feature-card">
                                <Card.Body>
                                    <FaMapMarkedAlt className="feature-icon icon-blue" />
                                    <h4>Real-Time Tracking</h4>
                                    <p>Live tracking of emergency vehicles and volunteers on route to the accident location.</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="feature-card">
                                <Card.Body>
                                    <FaRoute className="feature-icon icon-green" />
                                    <h4>Priority Routing</h4>
                                    <p>Optimized routes calculated for fastest response time based on current traffic conditions.</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* --- Testimonials Section --- */}
            <section className="testimonials-section">
                <Container>
                    <h2>What People Are Saying</h2>
                    <Row>
                        <Col md={6} lg={4} className="mb-4">
                            <Card className="testimonial-card h-100">
                                <Card.Body>
                                    <blockquote className="blockquote mb-0">
                                        <p><BsChatQuoteFill className="me-2" /> When my car broke down in a remote area, this app connected me with help in minutes. A true lifesaver!</p>
                                        <footer className="blockquote-footer">Jane D., <cite title="Source Title">Accident Victim</cite></footer>
                                    </blockquote>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} lg={4} className="mb-4">
                             <Card className="testimonial-card h-100">
                                <Card.Body>
                                    <blockquote className="blockquote mb-0">
                                        <p><BsChatQuoteFill className="me-2" /> As a paramedic, the real-time alerts and location data are invaluable. It has drastically cut down our response time.</p>
                                        <footer className="blockquote-footer">John S., <cite title="Source Title">Paramedic</cite></footer>
                                    </blockquote>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} lg={4} className="mb-4">
                             <Card className="testimonial-card h-100">
                                <Card.Body>
                                    <blockquote className="blockquote mb-0">
                                        <p><BsChatQuoteFill className="me-2" /> The ability to see exactly where we need to go and accept requests on the fly has revolutionized our workflow.</p>
                                        <footer className="blockquote-footer">Mike R., <cite title="Source Title">Volunteer Responder</cite></footer>
                                    </blockquote>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
</section>
            
            {/* --- Trusted By Section --- */}
            <section className="trusted-by-section">
                <Container>
                    <Fade direction="up" cascade damping={0.1} triggerOnce>
                        <h5>Trusted By Leading Emergency Services</h5>
                        <div className="logo-container">
                            <img src="https://via.placeholder.com/150x60.png?text=City+EMS" alt="City EMS" />
                            <img src="https://via.placeholder.com/150x60.png?text=Metro+Hospital" alt="Metro Hospital" />
                            <img src="https://via.placeholder.com/150x60.png?text=County+Fire+Dept" alt="County Fire Dept" />
                            <img src="https://via.placeholder.com/150x60.png?text=State+Patrol" alt="State Patrol" />
                        </div>
                    </Fade>
                </Container>
            </section>

            {/* --- Final CTA Section --- */}
            <section className="cta-section">
                <Container>
                     <Fade direction="up" cascade damping={0.2} triggerOnce>
                        <h3>Ready to Make a Difference?</h3>
                        <p>Join our network of responders or get peace of mind knowing help is just a click away.</p>
                        <div>
                            <LinkContainer to="/request-help"><Button variant="light" size="lg">
                                <i className="fa-solid fa-circle-plus me-1"></i>
                                Request Help</Button></LinkContainer>
                            <LinkContainer to="/login"><Button variant="outline-light" size="lg" className="ms-3">
                                <i className="fa-solid fa-user-shield m-1"></i>
                                Become a Responder</Button></LinkContainer>
                        </div>
                    </Fade>
                </Container>
            </section>
        </>
    );
};

export default HomePage;
