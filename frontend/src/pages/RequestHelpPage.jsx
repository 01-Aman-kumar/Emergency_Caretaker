import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Form, Button, Alert, Row, Col, Spinner, Card, Modal } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import Webcam from 'react-webcam';
import { GeoAltFill, ExclamationTriangleFill, PeopleFill, HeartPulseFill, TelephoneFill, CameraFill, XCircle, LockFill, ArrowRepeat } from 'react-bootstrap-icons';
import './RequestHelpPage.css';

// Helper function to convert the base64 image from react-webcam to a Blob
const dataURLtoBlob = (dataurl) => {
    if (!dataurl) return null;
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

const RequestHelpPage = () => {
    const [location, setLocation] = useState(null);
    const [formData, setFormData] = useState({
        emergencyType: '',
        victimCount: '',
        medicalInfo: '',
        contactNumber: '+91'
    });
    const [errors, setErrors] = useState({});
    const [image, setImage] = useState(null); // This will hold the final Blob
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [capturedImageURL, setCapturedImageURL] = useState(null); // For preview

    const webcamRef = useRef(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => setError("Geolocation permission is required to submit an emergency request. Please enable it in your browser settings.")
        );
    }, []);

    const validateForm = useCallback(() => {
        const newErrors = {};
        if (!formData.emergencyType) newErrors.emergencyType = 'Emergency type is required.';
        if (!formData.victimCount) newErrors.victimCount = 'Number of victims is required.';
        if (!formData.contactNumber || !/^\+?[1-9]\d{1,14}$/.test(formData.contactNumber)) newErrors.contactNumber = 'A valid contact number is required.';
        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0);
    }, [formData]);

    useEffect(() => {
        validateForm();
    }, [formData, validateForm]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOpenCamera = () => {
        setCapturedImageURL(null); // Reset any previous capture
        setImage(null);
        setShowCameraModal(true);
    };

    const handleCloseCamera = () => {
        setShowCameraModal(false);
    };

    const capturePhoto = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setCapturedImageURL(imageSrc); // For preview
            }
        }
    };

    const confirmAndSetPhoto = () => {
        if (capturedImageURL) {
            const blob = dataURLtoBlob(capturedImageURL);
            setImage(blob); // Set the final image for submission
        }
        handleCloseCamera();
    };

    const retakePhoto = () => {
        setCapturedImageURL(null); // Go back to the camera view
    };

    const removeMainPhoto = () => {
        setImage(null);
        setCapturedImageURL(null);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        validateForm();
        if (!isFormValid || !location) {
            setError("Please fill out all required fields and ensure location is enabled.");
            return;
        }
        setLoading(true);
        setMessage(null);
        setError(null);
        
        const submissionData = new FormData();
        submissionData.append('latitude', location.lat);
        submissionData.append('longitude', location.lng);
        Object.entries(formData).forEach(([key, value]) => submissionData.append(key, value));
        if (image) {
            submissionData.append('image', image, 'emergency-photo.jpg');
        }

        try {
            await axios.post('/api/requests', submissionData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setMessage('Emergency request sent successfully! Help is on the way.');
            setFormData({ emergencyType: '', victimCount: '', medicalInfo: '', contactNumber: '+91' });
            removeMainPhoto();
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while sending the request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="page-background">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8} md={10}>
                            <Card className="form-container-card">
                                <h2 className="form-title">Report an Emergency</h2>
                                {message && <Alert variant="success">{message}</Alert>}
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form onSubmit={submitHandler}>
                                    <fieldset disabled={loading}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="form-label-icon"><GeoAltFill /> Your Location</Form.Label>
                                            <div className="map-container">
                                                {location ? (
                                                    <MapContainer center={[location.lat, location.lng]} zoom={15} style={{ height: '300px', borderRadius: '15px' }}>
                                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                                                        <Marker position={[location.lat, location.lng]}><Popup>Your current location</Popup></Marker>
                                                    </MapContainer>
                                                ) : (
                                                    <div style={{ height: 300 }} className="d-flex justify-content-center align-items-center bg-light rounded"><Spinner animation="border" /> <span className="ms-2">Fetching location...</span></div>
                                                )}
                                            </div>
                                        </Form.Group>

                                        <Row>
                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label className="form-label-icon"><ExclamationTriangleFill /> Emergency Type</Form.Label>
                                                    <Form.Select name="emergencyType" value={formData.emergencyType} onChange={handleInputChange} isInvalid={!!errors.emergencyType} required>
                                                        <option value="">Select type...</option><option value="Accident">Accident</option><option value="Fire">Fire</option><option value="Medical">Medical</option><option value="Crime">Crime</option><option value="Other">Other</option>
                                                    </Form.Select>
                                                    <Form.Control.Feedback type="invalid">{errors.emergencyType}</Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label className="form-label-icon"><PeopleFill /> Number of Victims</Form.Label>
                                                    <Form.Select name="victimCount" value={formData.victimCount} onChange={handleInputChange} isInvalid={!!errors.victimCount} required>
                                                        <option value="">Select number...</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5+">5+</option>
                                                    </Form.Select>
                                                    <Form.Control.Feedback type="invalid">{errors.victimCount}</Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        
                                        <Form.Group className="mb-3">
                                            <Form.Label className="form-label-icon"><HeartPulseFill /> Medical Information (Optional)</Form.Label>
                                            <Form.Control as="textarea" rows={2} name="medicalInfo" value={formData.medicalInfo} onChange={handleInputChange} placeholder="E.g., unconscious, bleeding, known conditions..." />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="form-label-icon"><TelephoneFill /> Your Contact Number</Form.Label>
                                            <Form.Control type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} isInvalid={!!errors.contactNumber} required />
                                            <Form.Control.Feedback type="invalid">{errors.contactNumber}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Label className="form-label-icon"><CameraFill /> Attach a Photo (Optional)</Form.Label>
                                            {image ? (
                                                <div className="photo-thumbnail-container">
                                                    <img src={URL.createObjectURL(image)} alt="Emergency" />
                                                    <Button variant="light" size="sm" className="remove-photo-main-btn" onClick={removeMainPhoto}><XCircle color="black" size={20} /></Button>
                                                </div>
                                            ) : (
                                                <Button variant="outline-primary" className="w-100" onClick={handleOpenCamera}>Open Camera to Add Photo</Button>
                                            )}
                                        </Form.Group>
                                        
                                        <div className="d-grid mt-4">
                                            <Button type="submit" variant="danger" className="submit-button" disabled={!isFormValid || loading}>
                                                {loading ? <><Spinner as="span" animation="border" size="sm" /> Sending Alert...</> : 'Send Emergency Alert'}
                                            </Button>
                                        </div>
                                        <p className="secure-info"><LockFill size={12} className="me-1" /> Your information is secure and only shared with responders.</p>
                                    </fieldset>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Modal show={showCameraModal} onHide={handleCloseCamera} centered size="lg" className="camera-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Camera</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="camera-view-container">
                        {!capturedImageURL ? (
                             <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width="100%"
                                mirrored={false}
                                videoConstraints={{
                                    width: 1280,
                                    height: 720,
                                    facingMode: "environment"
                                }}
                            />
                        ) : (
                            <div className="photo-preview">
                                <img src={capturedImageURL} alt="Captured" />
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {!capturedImageURL ? (
                        <Button variant="warning" className="w-100" onClick={capturePhoto}>Take Picture</Button>
                    ) : (
                        <>
                            <Button variant="secondary" onClick={retakePhoto}><ArrowRepeat size={20} /> Retake</Button>
                            <Button variant="success" onClick={confirmAndSetPhoto}>Confirm Photo</Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default RequestHelpPage;
