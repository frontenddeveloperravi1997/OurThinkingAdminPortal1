import React, { useState } from "react";
import { Col, Row, Card, Button } from "react-bootstrap";
import { deleteOrganizationById } from "@/app/api/organization";
import { useRouter } from "next/navigation";
import CommonModal from "../dashboard/CommonModal";
import {  toast,ToastContainer } from 'react-toastify';
const DeleteOrgAccount = ({ Id, orgName }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [showCancelPop, setShowCancelPop] = useState(false);
  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
     const responseData =  await deleteOrganizationById(Id);
      if(responseData.statusCode == 200){
        toast.success('Organization deleted successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
         
          });
     
        setTimeout(() => {
              
          router.back()
             }, 3000);
      }else{
        toast.error('Oops something went wrong!', {
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
    } catch (err) {
      toast.error('Oops something went wrong!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
       
        });
      setError("Failed to delete organization.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShowCancelPop = () => {
    setShowCancelPop(true);
  };
  const handleHideCancelPop = () => {
    setShowCancelPop(false);
  };

  return (
    <>
          <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="colored"

/>
      <CommonModal
        show={showCancelPop}
        onClose={handleHideCancelPop}
        heading={"Delete Organization?"}
        body={`Are you sure you want to delete Organization:${orgName}`}
      >
        <>
          <Button variant="secondary" onClick={handleHideCancelPop}>
            No
          </Button>
          <Button
            onClick={handleDelete}
            className="btn btn-danger"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
          {error && <p className="text-danger mt-2">{error}</p>}
        </>
      </CommonModal>
      <Row>
        <Col xl={3} lg={4} md={12} xs={12}>
          <div className="mb-4 mb-lg-0">
            <h4 className="mb-1">Delete Organization</h4>
          </div>
        </Col>
        <Col xl={9} lg={8} md={12} xs={12}>
          <Card className="mb-6">
            <Card.Body>
              <div>
                <p>Delete any and all content you have</p>
                <Button
                  onClick={handleShowCancelPop}
                  className="btn btn-danger"
                >
                  Delete Account
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DeleteOrgAccount;
