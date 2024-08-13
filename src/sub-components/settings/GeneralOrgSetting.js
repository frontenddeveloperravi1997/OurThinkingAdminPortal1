import { useState, useEffect } from "react";
import { Col, Row, Form, Card } from "react-bootstrap";
import { FormSelect } from "@/widgets";

import MultiSelectDropdown from "@/sub-components/dashboard/MultiSelectDropdown";

const GeneralOrgSetting = ({ organization }) => {
  const [formData, setFormData] = useState({
    organizationName: "",
    availableDomains: "",
    status: "",
    associatedAddress: "",
    organizationCategory: "",
    productPermissions: "",
    firmContact: "",
    autoLogin: "",
    internalOrganization: "",
  });

  useEffect(() => {
    if (organization) {
      setFormData({
        organizationName: organization.organizationName || "",
        availableDomains: organization.availableDomains || "",
        status: organization.status || "",
        associatedAddress: organization.associatedAddress || "",
        organizationCategory: organization.organizationCategory || "",
        productPermissions: organization.productPermissions || "",
        firmContact: organization.firmContact || "",
        autoLogin: organization.autoLogin || "",
        internalOrganization: organization.internalOrganization || "",
      });
    }
  }, [organization]);

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Spanish", label: "Spanish" },
    { value: "Arabic", label: "Arabic" },
  ];

  const emailFrequency = [
    { value: "Never", label: "Never" },
    { value: "Daily", label: "Daily" },
    { value: "Weekly", label: "Weekly" },
    { value: "Fortnightly", label: "Fortnightly" },
    { value: "Monthly", label: "Monthly" },
  ];

  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleStatusChange = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      status: event.target.value,
    }));
  };

  return (
    <Row className="mb-8">
      <Col xl={3} lg={3} md={12} xs={12}>
        <div className="mb-4 mb-lg-0">
          <h4 className="mb-1">General Setting</h4>
          <p className="mb-0 fs-5 text-muted">Profile configuration settings</p>
        </div>
      </Col>
      <Col xl={9} lg={9} md={12} xs={12}>
        <Card>
          <Card.Body>
            <div>
              <div className="mb-8">
                <h4>Basic information</h4>
              </div>
              <Form>
                <Row className="mb-3">
                  <Form.Label
                    className="col-sm-3 col-form-label form-label"
                    htmlFor="orgName"
                  >
                    Organization name
                  </Form.Label>
                  <Col sm={8} className="mb-3 mb-lg-0">
                    <Form.Control
                      type="text"
                      placeholder="Organization name"
                      id="orgName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Label className="col-sm-3" htmlFor="orgcat">
                    Organization Category
                  </Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control
                      as={FormSelect}
                      placeholder="Select Organization Category"
                      id="orgcat"
                      options={emailFrequency}
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Label className="col-md-3" htmlFor="default">
                    Status
                  </Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Check
                      id="customRadioInline1"
                      className="form-check-inline"
                    >
                      <Form.Check.Input
                        type="radio"
                        name="status"
                        value="active"
                        checked={formData.status === "active"}
                        onChange={handleStatusChange}
                      />
                      <Form.Check.Label>Active</Form.Check.Label>
                    </Form.Check>
                    <Form.Check
                      id="customRadioInline2"
                      className="form-check-inline"
                    >
                      <Form.Check.Input
                        type="radio"
                        name="status"
                        value="archive"
                        checked={formData.status === "archive"}
                        onChange={handleStatusChange}
                      />
                      <Form.Check.Label>Archive</Form.Check.Label>
                    </Form.Check>
                    <Form.Check
                      id="customRadioInline3"
                      className="form-check-inline"
                    >
                      <Form.Check.Input
                        type="radio"
                        name="status"
                        value="disabled"
                        checked={formData.status === "disabled"}
                        onChange={handleStatusChange}
                      />
                      <Form.Check.Label>Disable</Form.Check.Label>
                    </Form.Check>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Label className="col-sm-3" htmlFor="productPermit">
                    Product Permissions
                  </Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control
                      as={FormSelect}
                      placeholder="Select Product Permissions"
                      id="productPermit"
                      options={emailFrequency}
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Label className="col-md-3" htmlFor="domainName">
                    Associated Domain Names
                  </Form.Label>
                  <Col md={8} xs={12}>
                    <MultiSelectDropdown
                      options={languageOptions}
                      selectedOptions={selectedLanguages}
                      setSelectedOptions={setSelectedLanguages}
                    />
                    <div className="mt-3">
                      <h5>Selected Domain Names:</h5>
                      <ul>
                        {selectedLanguages.map((value) => {
                          const option = languageOptions.find(
                            (opt) => opt.value === value
                          );
                          return <li key={value}>{option?.label}</li>;
                        })}
                      </ul>
                    </div>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Label className="col-md-3" htmlFor="language">
                    Associated Addresses
                  </Form.Label>
                  <Col md={8} xs={12}>
                    <MultiSelectDropdown
                      options={languageOptions}
                      selectedOptions={selectedLanguages}
                      setSelectedOptions={setSelectedLanguages}
                    />
                    <div className="mt-3">
                      <h5>Selected Addresses:</h5>
                      <ul>
                        {selectedLanguages.map((value) => {
                          const option = languageOptions.find(
                            (opt) => opt.value === value
                          );
                          return <li key={value}>{option?.label}</li>;
                        })}
                      </ul>
                    </div>
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

export default GeneralOrgSetting;
