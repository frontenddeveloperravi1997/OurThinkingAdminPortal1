import React,{useState,memo} from 'react'
import { useRouter } from "next/navigation";
import {  toast,ToastContainer } from 'react-toastify';
import { Col, Row, Card, Button } from "react-bootstrap";
import CommonModal from '../dashboard/CommonModal';
import { useQuery, useMutation } from "@tanstack/react-query";
import Spinner from "react-bootstrap/Spinner";
import { commonQuery } from "@/app/api/user";
const DeleteSystem = ({pageName,domainName,domainId}) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [showCancelPop, setShowCancelPop] = useState(false);
 // delete
 const {
    isPending:isLoading,
   
    mutate: deleteDomain,
   
  } = useMutation({
    mutationFn: async (data) => {
      return await commonQuery("DELETE", `/api/${pageName}/${domainId}`, data);
    },
    onSuccess(data, variables, context) {
      if(data?.data?.statusCode == 200){
        toast.success('Successfully deleted!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
         
          });
          setShowCancelPop(false)
        setTimeout(() => {
              
          router.back()
             }, 5000);
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
  
    
    },
    onError(error, variables, context) {
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
     heading={"Delete Domain?"}
     body={`Are you sure you want to delete domain:${domainName}`}
>
<>
          <Button variant="secondary" onClick={handleHideCancelPop}>
            No
          </Button>
          <Button
             onClick={()=>deleteDomain()}
            className="btn btn-danger"
            disabled={isDeleting}
          >
           Delete
           {(isLoading) &&  <Spinner style={{marginLeft:"8px"}} animation="border"  size="sm"
          role="status"
          aria-hidden="true" />}
          </Button>
         
        </> 
</CommonModal>
<Row>
        <Col xl={3} lg={4} md={12} xs={12}>
          <div className="mb-4 mb-lg-0">
            <h4 className="mb-1">Delete Domain</h4>
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
  )
}

export default memo(DeleteSystem)