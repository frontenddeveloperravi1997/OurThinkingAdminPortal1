import React,{useState} from 'react'
// import {toast} from 'react-hot-toast'
import { useForm } from "react-hook-form";
import { Col, Row, Form, Card, Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { commonQuery } from "@/app/api/user";
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from "@tanstack/react-query";
import {  toast,ToastContainer } from 'react-toastify';
import CommonModal from './CommonModal';
const CategorySystemForm = ({pageName,isEdit,category={}}) => {
const router = useRouter()

const [categoryCreated,setCategoryCreated] = useState(false)
   // mutation call

   const {
    isPending,
    isError,
    error,
    mutate: createNewCategory,
    data,
  } = useMutation({
    mutationFn: async (data) => {
      //('data--', data);
    
      const apiEndpoint = isEdit
        ? `/api/Organization/UpdateOrganizationCategory?id=${data.organizationCategoryID}`
        : '/api/Organization/CreateOrganizationCategory';
    
      return await commonQuery(isEdit ? 'PUT' : 'POST', apiEndpoint, data);
    },
    onSuccess(data, variables, context) {
  
      if(data?.status == 200){
        setCategoryCreated(true)
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
        
          toast.success('Organization category created successfully!!', {
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
          categoryName:category?.categoryName||"",
          status:category?.status||""
    
        },
      });
    const defaultValues = getValues();
    // const [userStatus,setUserStatus] = useState(defaultValues?.status);
    // const handleStatusChange = (event) => {
    //     setUserStatus(event.target.value)
    //     setValue('status',event.target.value)       
    //   };

      const [showCancelPop,setShowCancelPop] = useState(false)
    

      const onSubmit = (data) => {
          //console.log(data);
          //console.log('isEdit-->',isEdit);
          if(isEdit===true){
            createNewCategory({
              organizationCategoryID:category?.organizationCategoryID,
              categoryName: data?.categoryName,
              // status: data?.status,
              createdDate: category?.createdDate,
              // updatedDate: new Date().toUTCString()
              updatedDate: new Date().toISOString()
            })
          }else{
            createNewCategory({
              categoryName: data?.categoryName,
              // status: data?.status,
              // createdDate: new Date().toUTCString(),
              createdDate:new Date().toISOString(),
              updatedDate: null
            })
          }
      
        
      }

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
            <h4 className="mb-1">Organization Category Information</h4>
            <p className="mb-0 fs-5 text-muted">Organization Category information</p>
        </div>
    </Col>
    <Col xl={9} lg={9} md={12} xs={12}>
        <Card>
            <Card.Body>
                <div>
                    <div className="mb-8">
                        <h4>Add Organization Category</h4>
                    </div>
 
    <Row className="mb-3">
                                    <Form.Label className="col-sm-3 col-form-label form-label" htmlFor="categoryName">Organization category name<span style={{color:"red"}}>*</span></Form.Label>
                                    <Col sm={8} className="mb-3 mb-lg-0">
                                        <Form.Control type="text"    {...register("categoryName", {
                        required: true,
                        minLength: 2,
                     
                      })}   isInvalid={!!errors.categoryName} placeholder="Organization category name" id="categoryName"  />
                      {errors.categoryName && <Form.Control.Feedback type="invalid">Organization category name is required</Form.Control.Feedback>}
                                    </Col>
                                </Row>

                                {/* <Row className="mb-3">
                  <Form.Label className="col-md-3" htmlFor="default">
                    Status<span style={{color:"red"}}>*</span>
                  </Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Check
                      id="customRadioInline1"
                      className="form-check-inline"
                    >
                      <Form.Check.Input
                        type="radio"
                        name="status"
                        value="active"
                        checked={userStatus === "active"}
                        onChange={handleStatusChange}
                      />
                      <Form.Check.Label>Active</Form.Check.Label>
                    </Form.Check>
                    <Form.Check
                      id="customRadioInline2"
                      className="form-check-inline"
                    >
                      <Form.Check.Input
                        type="radio"
                        name="status"
                        value="archive"
                        checked={userStatus === "archive"}
                        onChange={handleStatusChange}
                      />
                      <Form.Check.Label>Archive</Form.Check.Label>
                    </Form.Check>
                    <Form.Check
                      id="customRadioInline3"
                      className="form-check-inline"
                    >
                      <Form.Check.Input
                        type="radio"
                        name="status"
                        value="disable"
                        checked={userStatus === "disable"}
                        onChange={handleStatusChange}
                      />
                      <Form.Check.Label>Disable</Form.Check.Label>
                    </Form.Check>
                  </Col>
                </Row> */}
   
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
             disabled={isPending || categoryCreated}
          >
         
             {isEdit===true?"Save Changes":"Add"}

              {(isPending) &&  <Spinner style={{marginLeft:"8px"}} animation="border"  size="sm"
          role="status"
          aria-hidden="true" />}
          
          </Button>
          <Button
          className="btn btn-danger"
            type="button"
           disabled={categoryCreated}
             onClick={handleShowCancelPop}
          >
           
             Cancel

       
          
          </Button>
        
        </Col>
      </Row>
        </form>
  )
}

export default CategorySystemForm