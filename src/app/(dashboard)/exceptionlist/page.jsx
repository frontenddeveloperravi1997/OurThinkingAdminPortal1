// pages/exceptionlist.js

'use client'

import React, { Fragment, useState,useEffect } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import DataList from '@/sub-components/dashboard/DataList';
import { fetchExceptionList } from '@/app/api/datalist';
import Spinner from "react-bootstrap/Spinner";
const ExceptionListLanding = () => {
    const [totalPages, setTotalPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);
    const [isLoading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState([]);
    const [totalCount,setTotalCount] = useState(null)
    const [pageSize,setPageSize] = useState(0)
    const itemsDisplayed = Math.min(pageNumber * pageSize, totalCount);
    
    useEffect(() => {
        const fetchTotalPages = async () => {
            setLoading(true);
            try {
                const responseData = await fetchExceptionList(pageNumber);
                if(responseData?.statusCode ===200){
                    setTotalPages(responseData?.data?.totalPages);
                    setPageSize(responseData?.data?.pageSize)
                    setInitialData(
                        responseData?.data?.data === null ? [] : responseData?.data?.data
                      );
                      setTotalCount(responseData?.data?.totalCount)
                      setLoading(false);
                }else{
                    setLoading(false);
                }
            
            
            } catch (error) {
                console.error('Error fetching total pages:', error);
                setLoading(false);
            }
        };

        //fetchTotalPages();
    }, []);
    return (
        <Fragment>
            <div className="bg-primary pt-10 pb-21"></div>
            <Container fluid className="mt-n22 px-6">
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="mb-2 mb-lg-0">
                                    <h3 className="mb-0 text-white">Exception List</h3>
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
               <Row className="my-6">
                    <Col xl={12} lg={12} md={12} xs={12}>
                        <DataList
                            fetchData={fetchExceptionList}
                            pageType="exception"
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

export default ExceptionListLanding;
