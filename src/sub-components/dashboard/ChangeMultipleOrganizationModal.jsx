import React,{useState,useEffect} from 'react'
import Modal from 'react-bootstrap/Modal';
import {  Col, Row, Form, Card,InputGroup,Button  } from "react-bootstrap";
import Select from "react-select";
import { commonQuery } from "@/app/api/user";
import { useQuery, useMutation } from "@tanstack/react-query";
import {  toast } from 'react-toastify';
import Spinner from "react-bootstrap/Spinner";
import { organizationList } from '@/app/api/organization';
import { updateUserAddToGroup } from '@/app/api/user';

const ChangeMultipleOrganizationModal = ({show,onClose,checkedUsers,orgCategoryList,setCheckedUsers}) => {
    const [selectedOrganization,setSelectedOrganization]= useState(null);
    const [updatedOrganizationList, setUpdatedOrganizationList] = useState([]);
    const [loading, setLoading] = useState(false); 

    const fetchUpdatedOrganizationData = async () => {
        try {
          const organizationData = await organizationList();
          if (organizationData?.statusCode === 200) {
            const formattedOrganizationData = organizationData?.data?.data.map((item) => ({
              value: item?.organizationId,
              label: item?.organizationName,
            }));
            setUpdatedOrganizationList(formattedOrganizationData);
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
        } catch (error) {
          console.log(error);
          toast.error("Failed to fetch roles!", {
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
      };

    useEffect(() => {
        fetchUpdatedOrganizationData();
    }, []);  

    const handleOrganizationSelect = (selectedOrganizationOption) => {
        // Store the selected organization object
        setSelectedOrganization(selectedOrganizationOption);
      };

    const handleHideActionPop =() =>{
        onClose()
    }

    // mutation call
    const addNewUserOrg = async () => {
      setLoading(true); // Start loading
      try {
          if (!selectedOrganization) {
              toast.error("You must select at least one organization", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
              });
              return;
          }
  
          const orgId = selectedOrganization.value;
          const userIds = Object.keys(checkedUsers).map(id => parseInt(id, 10)); 
  
          const payload = { 
              userIds,
              orgId,                
          };
          const response = await updateUserAddToGroup(payload);  
         
          if (response.statusCode === 200 || response.status === true) {
              toast.success("Successfully added user add to group!!", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
              });
  
              onClose();
          } else {
              toast.error(`Failed to update user add to group! ${response.data || ''}`, {
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
      } catch (error) {
          toast.error("An error occurred while trying to update roles!", {
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
          setLoading(false); // End loading
      }
  };      

  return (
    <Modal show={show} onHide={onClose} centered  size="lg">
    <Modal.Header closeButton>
      <Modal.Title>User add to group</Modal.Title>
    </Modal.Header>
    <Modal.Body>
                  <Row className="mb-3">
                  <Form.Label className="col-sm-3" htmlFor="orgcat">
                    Organization
                  </Form.Label>
                  <Col md={8} xs={12}>
                  <Select
                    options={updatedOrganizationList}
                    onChange={handleOrganizationSelect}
                    placeholder="Select Organization"
                    isClearable
                    value={selectedOrganization}
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999, // Increase the z-index value as needed
                      }),
                    }}
                  />
                  </Col>
                </Row>
    </Modal.Body>
    <Modal.Footer>
    <Button variant="primary" disabled={loading} onClick={addNewUserOrg}>
    Add {(loading) &&
    <Spinner style={{marginLeft: "8px"}} animation="border" size="sm" role="status" aria-hidden="true" />}
    </Button>
    <Button variant="secondary" onClick={handleHideActionPop} disabled={loading}>
        Cancel
    </Button>    
    </Modal.Footer>
  </Modal>
  )
}

export default ChangeMultipleOrganizationModal
