'use client'
import React, { Fragment, useState } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { PageHeading } from '@/widgets';
import ReportsForm from '@/sub-components/dashboard/ReportsForm';
const ReportsLanding = () => {
  return (
 <>
   <div className="bg-primary pt-10 pb-21"></div>
   <Container fluid className="mt-n22 px-6">
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="mb-2 mb-lg-0">
                                    <h3 className="mb-0 text-white">Reports</h3>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row className="my-6">
                    <Col xl={12} lg={12} md={12} xs={12}>
                   <ReportsForm/>
                    </Col>
                </Row>

             
            </Container>
 </>
  )
}

export default ReportsLanding