import React,{useState,useEffect} from 'react'
import Modal from 'react-bootstrap/Modal';
import {  Col, Row, Form, Card,InputGroup,Button  } from "react-bootstrap";
import Select from "react-select";
import { commonQuery } from "@/app/api/user";
import { useQuery, useMutation } from "@tanstack/react-query";
import {  toast } from 'react-toastify';
import Spinner from "react-bootstrap/Spinner";
import { organizationCategoryList } from "@/app/api/organization";
const ChangeGroupModal = ({show,onClose,checkedUsers,setCheckedUsers}) => {
    const [selectedOrgCategory,setSelectedOrgCategory]= useState(null);
    const [updatedOrgCategoryList, setUpdatedOrgCategoryList] = useState([]);
    const [orgCategoryList, setOrgCategoryList] = useState([]);
    const [isPending, setIsPending] = useState(false);
    //console.log('updatedOrgCategoryList',updatedOrgCategoryList);
    const handleOrgCategorySelect = (selectedOption) => {
        setSelectedOrgCategory(selectedOption);
      };
    const handleHideActionPop =() =>{
        onClose()
    }

    // mutation call

const {
    isPending: isSubmitting,
    isError,
    error,
    mutate: addOrgCategory,
    data,
  } = useMutation({
    mutationFn: async (data) => {
      return await commonQuery("PUT", `/api/Organization/AddCategoryToOrganization?orgCategoryId=${selectedOrgCategory?.value}`, data);
    },
    onSuccess(data, variables, context) {
      if(data?.data?.statusCode == 200){
        setCheckedUsers({})
        onClose()
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
      console.error(error);
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

  const addNewCategory = () =>{
    const getCheckedUsers = Object.keys(checkedUsers)
    .filter((key) => checkedUsers[key].isChecked)
    .map((key) => Number(key));
    addOrgCategory(getCheckedUsers)
  }
    useEffect(() => {
      const fetchOrgCategoryList = async () => {
        setIsPending(true);
        const orgCategoryData = await organizationCategoryList();
        setOrgCategoryList(orgCategoryData?.data?.data);
        if (orgCategoryData?.statusCode === 200) {
          if (orgCategoryData?.data?.data.length > 0) {
            const convertingIntoFormat = orgCategoryData.data.data.map((item) => ({
              value: item?.organizationCategoryID,
              label: item?.categoryName,
            }));
            setUpdatedOrgCategoryList(convertingIntoFormat);
          }
        }
        setIsPending(false);
      }
      fetchOrgCategoryList();
      }, []);
  return (
    <Modal show={show} onHide={onClose} centered  size="lg">
    <Modal.Header closeButton>
      <Modal.Title>Change Group</Modal.Title>
    </Modal.Header>
    <Modal.Body>
                  <Row className="mb-3">
                  <Form.Label className="col-sm-3" htmlFor="orgcat">
                    Organization Category
                  </Form.Label>
                  <Col md={8} xs={12}>
                  {(isPending) && <Spinner style={{marginLeft:"8px"}} animation="border"  size="sm" role="status" aria-hidden="true" />}
                  {!isPending && <Select
                    options={updatedOrgCategoryList}
                    onChange={handleOrgCategorySelect}
                    placeholder="Select Organization Category"
                    isClearable
                    value={selectedOrgCategory}
                    
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999, // Increase the z-index value as needed
                      }),
                    }}
                  />}
                  </Col>
                </Row>
    </Modal.Body>
    <Modal.Footer>
    <Button
            variant="primary"
            disabled={isPending}
            onClick={addNewCategory}
          >
       
       Add

            {(isPending) && <Spinner style={{marginLeft:"8px"}} animation="border"  size="sm"
          role="status"
          aria-hidden="true" />}
        
          </Button>
    <Button variant="secondary" onClick={handleHideActionPop} disabled={isPending}>
            Cancel
          </Button>

    
    </Modal.Footer>
  </Modal>
  )
}

export default ChangeGroupModal