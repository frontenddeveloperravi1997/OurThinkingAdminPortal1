import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Col, Row, Form, Button, Spinner } from 'react-bootstrap';
import { getRolesData } from '@/app/api/user';
import { bulkTagging } from "@/app/api/user";
import { toast, ToastContainer } from "react-toastify";

const ChangeBulkTaggingModal = ({ show, onClose, checkedUsers, setValue }) => {
    const [inputValue, setInputValue] = useState('');
    const [roleList, setRoleList] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // New loading state
    
    const handleHideActionPop = () => {
        onClose();
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleAddClick = async () => {
        setIsLoading(true);

        //console.log("Entered Tags:", inputValue);
    
        const validFormat = /^([A-Za-z\s]+#[A-Za-z\s]+|[A-Za-z\s]+)(\|([A-Za-z\s]+#[A-Za-z\s]+|[A-Za-z\s]+))*\|?$/;
    
        if (!validFormat.test(inputValue)) {
            toast.error("The input value is invalid.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setIsLoading(false);
            return;
        }
    
        if (!inputValue) {
            toast.error("You must enter a tag value!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setIsLoading(false);
            return;
        }
    
        try {
            const userIds = Object.keys(checkedUsers);
            console.log({ userIds, topics: inputValue });
    
            const response = await bulkTagging({ userIds, topics: inputValue });
            console.log(response);
    
            if (response?.statusCode === 200) {
                toast.success("Tags added successfully!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                handleHideActionPop();
            } else {
                throw new Error("Failed to add tags");
            }
        } catch (error) {
            console.error(error); // Log error for debugging
            toast.error(error.message || "Oops something went wrong!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        } finally {
            setIsLoading(false); // Stop the loader
        }
    };
    

    useEffect(() => {
        const fetchData = async () => {
            const rolesData = await getRolesData();
            if (rolesData?.statusCode === 200) {
                setRoleList(rolesData?.data?.data);
            } else {
                toast.error("Oops something went wrong!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
        }
        fetchData();
    }, []);

    return (
        <Modal show={show} onHide={onClose} centered  size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Change Bulk Tagging</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-3">
                    <Form.Label className="col-md-3" htmlFor="tags">
                        Topics                        
                    </Form.Label>
                    <Col md={8} xs={12}>
                    
                        <Form.Control
                            type="text"
                            placeholder="Enter tags"
                            value={inputValue}
                            onChange={handleInputChange}
                        />
                    <div className="instructions-for-user">
                    <h5>Note: Please enter the values in below format</h5>
                    <div>
                    <h6>Parent#Child|Parent#Child|</h6>
                    </div>
                    </div>
                    
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleAddClick} disabled={isLoading}>
                    {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Add"}
                </Button>
                <Button variant="secondary" onClick={handleHideActionPop} disabled={isLoading}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ChangeBulkTaggingModal;
