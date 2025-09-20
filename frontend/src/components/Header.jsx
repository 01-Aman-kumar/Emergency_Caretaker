import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // Import the new CSS file

const Header = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        const handleScroll = () => {
            // Set scrolled state to true if user scrolls more than 10 pixels
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        // Add the event listener when the component mounts
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <header>
            {/* 
              - The 'sticky="top"' prop makes the header stick to the top.
              - The className dynamically adds the 'scrolled' class based on the scroll position.
            */}
            <Navbar 
                bg='transparent'
                variant={isScrolled ? 'light' : 'dark'} 
                expand="lg" 
                collapseOnSelect 
                fixed="top"
                className={isScrolled ? 'scrolled' : ''}
            >
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand className='fw-bold demo text-black'>
                          <i className="fa-solid fa-truck-medical m-1 text-danger"></i>
                          Jeevan</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                             {userInfo && userInfo.role === 'Responder' ? (
                                <NavDropdown title={userInfo.name} id="username" className='text-danger'>
                                    <LinkContainer to="/dashboard">
                                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link>
                                        <Button variant="outline-primary" className="ms-2">Responder Login</Button>
                                    </Nav.Link>
                                </LinkContainer>
                            )}
                            <LinkContainer to="/request-help">
                                <Nav.Link>
                                    <Button variant="danger" className="ms-2">Request Help</Button>
                                </Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
