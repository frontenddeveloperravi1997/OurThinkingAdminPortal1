"use client";
// import node module libraries
import { Fragment, useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Users } from "@/sub-components";
import { getUsersList } from "@/app/api/user";
import PaginationUtils from "@/utils/paginationUtils";
import Spinner from "react-bootstrap/Spinner";
const UserLanding = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize,setPageSize] = useState(0)
  const [isLoading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  // Calculate the number of items displayed so far
  const itemsDisplayed = Math.min(pageNumber * pageSize, totalCount);
 // console.log("itemsDisplayed",itemsDisplayed,pageSize)
  useEffect(() => {
    const fetchTotalPages = async () => {
      setLoading(true);
      try {
        const responseData = await getUsersList(pageNumber);
        if (responseData?.statusCode === 200) {
          setTotalPages(responseData?.data?.totalPages);
          setPageSize(responseData?.data?.pageSize)
          setInitialData(
            responseData?.data?.data === null ? [] : responseData?.data?.data
          );
          setTotalCount(responseData?.data?.totalCount);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching total pages:", error);
        setLoading(false);
      }
    };

    fetchTotalPages();
  }, []);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setPageNumber(page);
    }
  };

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
                    pageNumber={pageNumber}
                    setTotalPages={setTotalPages}
                    itemsDisplayed={itemsDisplayed}
                    totalCount={totalCount}
                  />
                </Col>
              </Row>
              {initialData?.length > 0 && (
                <PaginationUtils
                  currentPage={pageNumber}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </>
      </Container>
    </Fragment>
  );
};
export default UserLanding;
