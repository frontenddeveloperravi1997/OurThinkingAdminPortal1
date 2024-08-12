import React, { useState } from "react";
import { Col, Row, Card, Button } from "react-bootstrap";
import { deleteUserById } from "@/app/api/user";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CommonModal from "../dashboard/CommonModal";
const DeleteAccount = ({ userID, userEmail }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [showCancelPop, setShowCancelPop] = useState(false);
  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const responseData = await deleteUserById(userID);
      if (responseData.statusCode == 200) {
        toast.success("User deleted successfully!", {
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
          router.back();
        }, 3000);
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
    } catch (err) {
      setError("Failed to delete account.");
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
      {" "}
    
      <CommonModal
        show={showCancelPop}
        onClose={handleHideCancelPop}
        heading={"Delete user?"}
        body={`Are you sure you want to delete User: ${userEmail}`}
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
            {isDeleting ? "Deleting..." : "Delete User"}
          </Button>
          {error && <p className="text-danger mt-2">{error}</p>}
        </>
      </CommonModal>
      <Row>
        <Col xl={3} lg={4} md={12} xs={12}>
          <div className="mb-4 mb-lg-0">
            <h4 className="mb-1">Delete Account</h4>
          </div>
        </Col>
        <Col xl={9} lg={8} md={12} xs={12}>
          <Card className="mb-6">
            <Card.Body>
              <div>
                <p>Delete any and all content you have for this user.</p>
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

export default DeleteAccount;
