import React, { useState, memo } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { Col, Row, Card, Button } from 'react-bootstrap';
import CommonModal from '../dashboard/CommonModal';
import { useMutation } from '@tanstack/react-query';
import Spinner from 'react-bootstrap/Spinner';
import { commonQuery } from '@/app/api/user';

const DeleteOrganizationCategory = ({ pageName, categoryName, organizationCategoryID }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [showCancelPop, setShowCancelPop] = useState(false);

  // delete
  const {
    isLoading,
    mutate: deleteOrganizationCategory,
  } = useMutation({
    mutationFn: async (data) => {
      
      return await commonQuery('DELETE', `/api/Organization/OrganizationCategory/${organizationCategoryID}`, data);
    },
    onSuccess(data, variables, context) {
      if (data?.data?.statusCode === 200) {
        toast.success('Successfully deleted!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        setShowCancelPop(false);
        setTimeout(() => {
          router.back();
        }, 5000);
      } else {
        toast.error('Oops, something went wrong!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
    },
    onError(error, variables, context) {
      toast.error('Oops, something went wrong!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    },
  });

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
        heading={'Delete Organization Category?'}
        body={`Are you sure you want to delete Organization Category: ${categoryName}?`}
      >
        <>
          <Button variant="secondary" onClick={handleHideCancelPop}>
            No
          </Button>
          <Button
            onClick={() => deleteOrganizationCategory({ id: organizationCategoryID })}
            className="btn btn-danger"
            disabled={isDeleting}
          >
            Delete
            {isLoading && (
              <Spinner style={{ marginLeft: '8px' }} animation="border" size="sm" role="status" aria-hidden="true" />
            )}
          </Button>
        </>
      </CommonModal>
      <Row>
        <Col xl={3} lg={4} md={12} xs={12}>
          <div className="mb-4 mb-lg-0">
            <h4 className="mb-1">Delete Organization Category</h4>
          </div>
        </Col>
        <Col xl={9} lg={8} md={12} xs={12}>
          <Card className="mb-6">
            <Card.Body>
              <div>
                <p>Delete any and all content associated with this organization category.</p>
                <Button onClick={handleShowCancelPop} className="btn btn-danger">
                  Delete Category
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default memo(DeleteOrganizationCategory);
