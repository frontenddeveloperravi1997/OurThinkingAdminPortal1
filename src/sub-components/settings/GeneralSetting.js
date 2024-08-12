import { useState, useEffect } from "react";
import { Col, Row, Form, Card, InputGroup } from "react-bootstrap";
import { FormSelect } from "@/widgets";
import OrganizationSearch from "../dashboard/OrganizationSearch";
import Spinner from "react-bootstrap/Spinner";
const GeneralSetting = ({
  user,
  register,
  errors,
  setValue,
  getValues,
  isDisabled,
  emailValidLoading,
  isEmailExist,
  clearErrors
}) => {
  const defaultValues = getValues();



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
                    htmlFor="firstName"
                  >
                    Full name
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={4} className="mb-3 mb-lg-0">
                    <Form.Control
                      type="text"
                      placeholder="First name"
                      isInvalid={!!errors.firstName}
                      id="firstName"
                      {...register("firstName", {
                        required: true,
                        minLength: 1,
                      })}
                    />
                    {errors.firstName && (
                      <Form.Control.Feedback type="invalid">
                        First name is required
                      </Form.Control.Feedback>
                    )}
                  </Col>
                  <Col sm={4}>
                    <Form.Control
                      type="text"
                      placeholder="Last name"
                      isInvalid={!!errors.lastName}
                      id="lastName"
                      {...register("lastName", {
                        required: true,
                        minLength: 1,
                      })}
                    />
                    {errors.lastName && (
                      <Form.Control.Feedback type="invalid">
                        Last name is required
                      </Form.Control.Feedback>
                    )}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label
                    className="col-sm-3 col-form-label form-label"
                    htmlFor="email"
                  >
                    Email
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col md={8} xs={12}>
                    <InputGroup style={{ position: "relative" }}>
                      <Form.Control
                        isInvalid={
                          !!errors.email ||
                          (isEmailExist && isEmailExist === true)
                        }
                        type="email"
                        placeholder="Email"
                        id="email"
                        disabled={isDisabled}
                        {...register("email", {
                          required: true,
                          pattern:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        })}
                      />
                      {emailValidLoading && (
                        <div
                          style={{
                            position: "absolute",
                            right: "5%",
                            top: "25%",
                          }}
                        >
                          <Spinner
                            variant="primary"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </InputGroup>

                    {errors.email?.type ==="pattern" && (
                      <p style={{margin:"0", marginTop:"0.25rem", color:"#dc3545", fontSize:"0.875em"}}>
                      Please follow email pattern
                    </p>
                    )}
                       {errors.email && (
                      <p style={{margin:"0", marginTop:"0.25rem", color:"#dc3545", fontSize:"0.875em"}}>
                      Email is required
                    </p>
                    )}
                    {isEmailExist && isEmailExist === true && (
                      <p style={{margin:"0", marginTop:"0.25rem", color:"#dc3545", fontSize:"0.875em"}}>
                        Email already exist,Please type another email
                      </p>
                    )}
                  </Col>
                </Row>
            
            

               

              
                <Row className="align-items-center mb-3">
                  <Form.Label className="col-sm-3" htmlFor="zipcode">
                    Organization Name
                  </Form.Label>
                  <Col md={8} xs={12}>
                    <OrganizationSearch
                      defaultlabel={defaultValues?.organization?.label}
                      defaultValue={defaultValues?.organization?.value}
                      setValue={setValue}
                    />
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

export default GeneralSetting;
