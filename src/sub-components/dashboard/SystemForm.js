import React,{useState} from 'react'
import { useForm } from "react-hook-form";
import { Col, Row, Form, Card, Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { commonQuery } from "@/app/api/user";
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from "@tanstack/react-query";
import {  toast,ToastContainer } from 'react-toastify';
import CommonModal from './CommonModal';
import { isWhiteListDomainExists } from '@/app/api/datalist';
import { isBlackListDomainExists } from '@/app/api/datalist';
import { isExceptionListDomainExists } from '@/app/api/datalist';


const SystemForm = ({pageName,isEdit,domain={}}) => {
const router = useRouter()
const [domainCreated,setDomainCreated] = useState(false)
   
   const {
    isPending,
    isError,
    error,
    mutate: createNewDomain,
    data,
  } = useMutation({
    mutationFn: async (data) => {
     // console.log('data-->',data);
      return await commonQuery(isEdit===true?"PUT":"POST", `/api/${pageName}`, data);
    },
    onSuccess(data, variables, context) {
  
      if(data?.status == 200){
        setDomainCreated(true)
         if(isEdit === true){
        
          toast.success('Successfully updated', {
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
                 }, 5000);
         }else{
        
          toast.success('Domain name created successfully!! ', {
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
                 }, 5000);
         }

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

 
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
      } = useForm({
        defaultValues: {
          domainName:domain?.domainName||"",
          status:domain?.status||""
    
        },
      });
    const defaultValues = getValues();
      const [showCancelPop,setShowCancelPop] = useState(false)
    

      const onSubmit = async (data) => {
        //console.log(data);
        //console.log('isEdit-->', isEdit);
    
        try {
            const domainExists = await isWhiteListDomainExists(data?.domainName);
            const blackListDomainExists = await isBlackListDomainExists(data?.domainName);
            const exceptionListDomainExists = await isExceptionListDomainExists(data?.domainName);
    
            if (domainExists) {
              toast.error('Domain name already exists')
              return
            }

            if (blackListDomainExists) {
              toast.error('Domain name already exists')
              return
            }

            if(exceptionListDomainExists) {
              toast.error('Domain name already exists')
              return
            }
   
            if (isEdit === true) {
                createNewDomain({
                    domainId: domain?.domainId,
                    domainName: data?.domainName,
                    createdDate: domain?.createdDate,
                    updatedDate: new Date().toISOString(),
                });
            } else {
                createNewDomain({
                    domainName: data?.domainName,
                    createdDate: new Date().toISOString(),
                    updatedDate: null,
                });
            }
        } catch (error) {
            console.error("Error checking domain existence:", error);
            // Handle error scenario, e.g., show an error message to the user
        }
    };
    

      const handleShowCancelPop = () =>{
        setShowCancelPop(true)
      }
      const handleHideCancelPop = () =>{
        setShowCancelPop(false)
      }
    
      const handleCancelForm = () =>{
        router.back()
      }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
   heading={"Cancel changes?"}
   body={"All the save changes will be lost"}
>
<>
  <Button variant="secondary" onClick={handleHideCancelPop}>
        No
      </Button>
      <Button variant="primary" onClick={handleCancelForm}>
        Yes
      </Button>
  </>
</CommonModal>
    <Row className="mb-8">
    <Col xl={3} lg={3} md={12} xs={12}>
        <div className="mb-4 mb-lg-0">
            <h4 className="mb-1">Domain Information</h4>
            <p className="mb-0 fs-5 text-muted">Domain information</p>
        </div>
    </Col>
    <Col xl={9} lg={9} md={12} xs={12}>
        <Card>
            <Card.Body>
                <div>
                    <div className="mb-8">
                        <h4>Add Domain</h4>
                    </div>
 
    <Row className="mb-3">
                                    <Form.Label className="col-sm-3 col-form-label form-label" htmlFor="domainName">Domain name<span style={{color:"red"}}>*</span></Form.Label>
                                    <Col sm={8} className="mb-3 mb-lg-0">
                                        <Form.Control type="text"    {...register("domainName", {
                        required: true,
                        minLength: 2,
                     
                      })}   isInvalid={!!errors.domainName} placeholder="Domain name" id="domainName"  />
                      {errors.domainName && <Form.Control.Feedback type="invalid">Domain name is required</Form.Control.Feedback>}
                                    </Col>
                                </Row>                         
   
    </div>
                    </Card.Body>
                </Card>
            </Col>
        
        </Row>
        <Row className="mb-8">
        <Col md={{ offset: 3, span: 11 }} xs={12} className="mt-2 d-flex gap-4">
          <Button
            variant="primary"
            type="submit"
             disabled={isPending || domainCreated}
          >
         
             {isEdit===true?"Save Changes":"Add"}

              {(isPending) &&  <Spinner style={{marginLeft:"8px"}} animation="border"  size="sm"
          role="status"
          aria-hidden="true" />}
          
          </Button>
          <Button
          className="btn btn-danger"
            type="button"
           disabled={domainCreated}
             onClick={handleShowCancelPop}
          >           
             Cancel
          </Button>
        </Col>
      </Row>
        </form>
  )
}

export default SystemForm