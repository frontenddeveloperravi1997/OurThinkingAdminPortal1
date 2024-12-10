"use client";
// import node module libraries
import { Fragment, useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Users } from "@/sub-components";
import { getUsersList } from "@/app/api/user";

import Spinner from "react-bootstrap/Spinner";
const UserLanding = () => {
  
  const [isLoading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState([]);


  

  return (
    <Fragment>
      <div className="bg-primary pt-10 pb-21"></div>
      <Container fluid className="mt-n22 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="mb-2 mb-lg-0">
                  <h3 className="mb-0  text-white">Users</h3>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <>
          {isLoading ? (
            <div
              style={{ height: "20vh" }}
              className="d-flex w-100 align-middle justify-content-center align-items-center "
            >
              <Spinner animation="border" role="status" variant="light">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <> 
              {" "}
              <Row className="my-6">
                <Col xl={12} lg={12} md={12} xs={12}>
                  <Users
                  />
                </Col>
              </Row>
              
            </>
          )}
        </>
      </Container>
    </Fragment>
  );
};
export default UserLanding;