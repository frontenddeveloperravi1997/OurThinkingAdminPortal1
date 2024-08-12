import { useState, useEffect } from 'react';
import { Col, Row, Form, Card, Button } from 'react-bootstrap';
import { formatDate } from '@/utils/formateDate';

const OrganizationCategorySetting = ({ category }) => {
    const [createdDate, setCreatedDate] = useState(new Date().toISOString());
    const [updatedDate, setUpdatedDate] = useState(new Date().toISOString());

    const [formData, setFormData] = useState({
        categoryName: '',
        status: '',
        createdDate: '',
        updatedDate: '',
    });

    useEffect(() => {
        if (category) {
            setFormData({
                categoryName: category.categoryName || '',
                status: category.status || '',
                createdDate: category.createdDate || '',
                updatedDate: category.updatedDate || ''
            });
        }
    }, [category]);

    const handleStatusChange = (event) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            status: event.target.value
        }));
    };

    return (
        <Row className="mb-8">
            <Col xl={3} lg={3} md={12} xs={12}>
                <div className="mb-4 mb-lg-0">
                    <h4 className="mb-1">Organization Category Information</h4>
                    <p className="mb-0 fs-5 text-muted">Organization category information</p>
                </div>
            </Col>
            <Col xl={9} lg={9} md={12} xs={12}>
                <Card>
                    <Card.Body>
                        <div>
                            <div className="mb-8">
                                <h4>Add Organization Category</h4>
                            </div>
                            <Form>
                                <Row className="mb-3">
                                    <Form.Label className="col-sm-3 col-form-label form-label" htmlFor="categoryName">Category Name</Form.Label>
                                    <Col sm={8} className="mb-3 mb-lg-0">
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Category name" 
                                            id="categoryName" 
                                            value={formData.categoryName} 
                                            required 
                                        />
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Label className="col-md-3" htmlFor="status">Status</Form.Label>
                                    <Col md={8} xs={12}>
                                        <Form.Check id="statusActive" className="form-check-inline">
                                            <Form.Check.Input
                                                type="radio"
                                                name="status"
                                                value="active"
                                                checked={formData.status === 'active'}
                                                onChange={handleStatusChange}
                                            />
                                            <Form.Check.Label>Active</Form.Check.Label>
                                        </Form.Check>
                                        <Form.Check id="statusArchive" className="form-check-inline">
                                            <Form.Check.Input
                                                type="radio"
                                                name="status"
                                                value="archive"
                                                checked={formData.status === 'archive'}
                                                onChange={handleStatusChange}
                                            />
                                            <Form.Check.Label>Archive</Form.Check.Label>
                                        </Form.Check>
                                        <Form.Check id="statusDisabled" className="form-check-inline">
                                            <Form.Check.Input
                                                type="radio"
                                                name="status"
                                                value="disabled"
                                                checked={formData.status === 'disabled'}
                                                onChange={handleStatusChange}
                                            />
                                            <Form.Check.Label>Disabled</Form.Check.Label>
                                        </Form.Check>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Label className="col-sm-3">Created Date</Form.Label>
                                    <Col sm={8} className="mb-3 mb-lg-0">
                                        <Form.Control
                                            type="text"
                                            className="text-muted"
                                            placeholder="Created date"
                                            value={formData.createdDate ? formatDate(formData.createdDate) : formatDate(new Date(createdDate).toLocaleString())}
                                            readOnly
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Label className="col-sm-3">Last Updated Date</Form.Label>
                                    <Col sm={8} className="mb-3 mb-lg-0">
                                        <Form.Control
                                            type="text"
                                            className="text-muted"
                                            placeholder="Updated date"
                                            value={formData.updatedDate ? formatDate(formData.updatedDate) : formatDate(new Date(updatedDate).toLocaleString())}
                                            readOnly
                                        />
                                    </Col>
                                </Row>

                                <Row className="mb-8">
                                    <Col md={{ offset: 3, span: 11 }} xs={12} className="mt-2">
                                        <Button variant="primary" type="submit">
                                            Add Category
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default OrganizationCategorySetting;
