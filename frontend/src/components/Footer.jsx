import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-dark">
            <Container>
                <Row>
                    <Col sm={6} md={3} item>
                        <h3>Services</h3>
                        <ul>
                            <li><LinkContainer to="/request-help"><a href="#">Emergency Reporting</a></LinkContainer></li>
                            <li><a href="#">Live Tracking</a></li>
                            <li><a href="#">Volunteer Network</a></li>
                        </ul>
                    </Col>
                    <Col sm={6} md={3} item>
                        <h3>About</h3>
                        <ul>
                            <li><a href="#">Our Mission</a></li>
                            <li><a href="#">Team</a></li>
                            <li><a href="#">Careers</a></li>
                        </ul>
                    </Col>
                    <Col md={6} item text>
                        <h3>Emergency Assistance</h3>
                        <p>Our mission is to provide immediate, life-saving connections between accident victims and the nearest available help. We leverage technology to reduce response times and save lives.</p>
                    </Col>
                    <Col item social className="social-icons mt-4">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                    </Col>
                </Row>
                <p className="copyright">Emergency Assistance © {new Date().getFullYear()}</p>
            </Container>
        </footer>
    );
};

export default Footer;
