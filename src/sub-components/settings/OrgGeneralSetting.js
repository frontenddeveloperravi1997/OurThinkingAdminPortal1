import { useState, useEffect,memo } from "react";
import { Col, Row, Form, Card,InputGroup,Button  } from "react-bootstrap";
import Image from "next/image";
import Select from "react-select";
import {  toast } from 'react-toastify';
import { getWhiteListedDomain } from "@/app/api/user";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const OrgGeneralSetting = ({  
  register, errors,setValue,getValues,orgCategoryList, clearErrors,method, organizationID,
  organizationDomains,
  setOrganizationDomains,
  updateOrganizationWhitelistDomain,
  setUpdateOrganizationWhitelistDomain,
  deleteOrganizationWhitelistDomain,
  setDeleteOrganizationWhitelistDomain 
 }) => {
    const defaultValues = getValues();
    //console.log('defaultValues-->',defaultValues);
    const defaultDomainNames = getValues()?.organizationDomains;
    const defaultAssociateAddress = getValues()?.associateAddresses;
    const [updatedOrgCategoryList, setUpdatedOrgCategoryList] = useState([]);
const [selectedOrgCategory,setSelectedOrgCategory]= useState(() =>{
  if(defaultValues?.orgCategory?.label === ""){
    return null
  }else{
    return defaultValues?.orgCategory
  }
});
// const [orgStatus,setOrgStatus] = useState(defaultValues?.status);
const [associateDomains,setAssociateDomain] = useState([]);

const [associateDomainInput,setAssociateDomainInput] = useState("")
const [editingDomain, setEditingDomain] = useState({ id: "", value: "" });

const [selectedAutoLogin, setSelectedAutoLogin] = useState(
  defaultValues?.isAutoLogin
);
const [selectedIsInternalOrg, setSelectedIsInternalOrg] = useState(
  defaultValues?.isInternalOrg
);

const booleanOptions = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];


const handleSelectedIsAutoLogin = (selectedOption) => {
  console.log('selectedOption--->',selectedOption);
  setSelectedAutoLogin(selectedOption);
  setValue("isAutoLogin", selectedOption);
  console.log('isAutoLogin--->',selectedOption);
};
const handleSelectedIsInternalOrg = (selectedOption) => {
  setSelectedIsInternalOrg(selectedOption);
  setValue("isInternalOrg", selectedOption);
};

/* all the functions for Domain names  starts*/

const updateSingleDomainName = (domainName) => {

   // Convert each value to "value|value" format
   const formattedDomainNames = domainName.map(obj => obj.value).join('|');

   // Set the formatted domain names
   setValue("domainNames", formattedDomainNames);
};
const handleDomainNameInput = (e)=>{
  setAssociateDomainInput(e.target.value)
};

const handleAddDomainName = debounce(async () => {
     // check if the domain is whitelisted
    if(await getWhiteListedDomain(associateDomainInput)){
      toast.error('Domain already exist!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return ;
    }
    if(organizationDomains.find((domain) => domain.domainName.toLowerCase() == associateDomainInput.toLowerCase())){
        toast.error('Domain already exists in lists!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return ;
    }
    

    // setOrganizationDomains((prevDomains) => [
    //   ...prevDomains,
    //   { 
    //     id:0,
    //     organizationId:organizationID, 
    //     domainName:associateDomainInput,
    //     createdDate: new Date().toISOString()
    //   }
    // ]);

    if(method==="addOrg"){
      console.log('organizationDomains-->>',organizationDomains);
      setUpdateOrganizationWhitelistDomain((prevDomains) => [
        ...prevDomains,
        { 
          id:updateOrganizationWhitelistDomain.length,
          organizationId:0, 
          domainName:associateDomainInput,
          createdDate: new Date().toISOString()
        }
      ]);
    }

    if(method==="editOrg"){
      setUpdateOrganizationWhitelistDomain((prevDomains) => [
        ...prevDomains,
        { 
          id:updateOrganizationWhitelistDomain.length,
          organizationId:organizationID, 
          domainName:associateDomainInput,
          createdDate: new Date().toISOString()
        }
      ]);
    }

  if (associateDomainInput !== "") {
    setAssociateDomain((prev) => {
      const updatedDomains = [...prev, {
        isDisabled: true,
        id: associateDomainInput,
        value: associateDomainInput
      }];
      updateSingleDomainName(updatedDomains);
      //console.log('updatedDomains-->',updatedDomains);
      return updatedDomains;
    });
    // Moved outside the setState function
    setAssociateDomainInput("");
  }

},300);

function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
const handleEditDomainName = async (id, value) => {
  // setUpdateOrganizationWhitelistDomain((prevDomains) => [
  //   ...prevDomains,
  //   { 
  //     id:0,
  //     organizationId:organizationID, 
  //     domainName:id,
  //     createdDate: new Date().toISOString()
  //   }
  // ]);

  setEditingDomain({ id, value });
  setAssociateDomain((prev) =>
    prev.map((domain) =>
      domain.id === id ? { ...domain, isDisabled: false } : domain
    )
  );
};
const handleDomainValueChange = (e) => {
  //setEditingDomain({ ...editingDomain, value: e.target.value });
  setEditingDomain((prev) => ({
    ...prev,
    value: e.target.value,
  }));
};

const handleSaveDomainName = (item) => {
  
  // let whiteListDomain = getWhiteListedDomain(id)
  setUpdateOrganizationWhitelistDomain((prevDomains) => [
    ...prevDomains,
    { 
      id:item.id,
      organizationId:organizationID, 
      domainName:editingDomain.value,
      createdDate: new Date().toISOString()
    }
  ]);

  setAssociateDomain((prev) => {
    const updatedDomains = prev.map((domain) => {
      if (domain.id === item.id) {
        const newDomain = { ...domain, isDisabled: true };
        // Only update the value if editingDomain.value is valid
        if (editingDomain.value !== undefined && editingDomain.value !== null && editingDomain.value !== "") {
          newDomain.value = editingDomain.value;
        }
        return newDomain;
      }
      return domain;
    });
    updateSingleDomainName(updatedDomains);
    return updatedDomains;
  });

  setEditingDomain({ id: "", value: "" });
};

const handleDeleteDomain = (item) => {
  // check if what you want to delete exist?

  setDeleteOrganizationWhitelistDomain((prevDomains) => [
    ...prevDomains,
    { 
      id:item.id,
      organizationId:organizationID, 
      domainName:item.value,
      createdDate: new Date().toISOString()
    }
  ]);
 

  setAssociateDomain((prev) => {
    const updatedDomains = prev.filter((domain) => domain.id !== item.id);
    updateSingleDomainName(updatedDomains);
    return updatedDomains;
  });
};
//console.log("associateDomains---",associateDomains);



useEffect(() => {
  if (defaultDomainNames.length) {
    const transformData = (data) => {
        return data.map((item) => ({
          id: item.id,
          value: item.domainName,
          isDisabled: true,
        }));
    };
    setAssociateDomain(transformData(defaultDomainNames));
  } else {
    setAssociateDomain([]);
  }
}, [defaultDomainNames]);


  const handleOrgCategorySelect = (selectedOption) => {
    setSelectedOrgCategory(selectedOption);
    setValue("orgCategory", selectedOption);
  };

  useEffect(() => {
    if (orgCategoryList?.length > 0) {
      const convertingIntoFormat = orgCategoryList?.map((item) => ({
        value: item?.organizationCategoryID,
        label: item?.categoryName,
      }));
      setUpdatedOrgCategoryList(convertingIntoFormat);
    }
  }, [orgCategoryList]);

  return (
    <Row className="mb-8">
    <Col xl={3} lg={3} md={12} xs={12}>
      <div className="mb-4 mb-lg-0">
        <h4 className="mb-1">General Setting</h4>
        <p className="mb-0 fs-5 text-muted">Organization configuration settings</p>
      </div>
    </Col>
    <Col xl={9} lg={9} md={12} xs={12}>
      <Card>
        <Card.Body>
          <div>
            <div className="mb-8">
              <h4>Basic information</h4>
            </div>
           
          
              <Row className="mb-3">
                <Form.Label
                  className="col-sm-3 col-form-label form-label"
                  htmlFor="organizationName"
                >
                  Organization name
                  <span style={{color:"red"}}>*</span>
                </Form.Label>
                <Col sm={8} className="mb-3 mb-lg-0">
                  <Form.Control
                    isInvalid={!!errors.organizationName}
                    type="text"
                    placeholder="Organization Name"
                    id="organizationName"
                  
                    {...register("organizationName", {
                      required: true,
                      minLength: 1,
                      maxLength:50
                    })}
                  />
                  {errors.organizationName && <Form.Control.Feedback type="invalid">Organization name is required</Form.Control.Feedback>}
                </Col>
              </Row>
              <Row className="mb-3">
                  <Form.Label className="col-sm-3" htmlFor="orgcat">
                    Organization Category
                  </Form.Label>
                  <Col md={8} xs={12}>
                  <Select
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
                  />
                  </Col>
                </Row>
               
              <Row className="mb-3">
                <Form.Label
                  className="col-sm-3 col-form-label form-label"
                  htmlFor="domainName"
                >
                  {/* Organization Domain names */}
                  Associated Domain names
                </Form.Label>
                <Col md={8} xs={12}>
                <InputGroup>
                  <Form.Control
                  
                    type="text"
                    placeholder="Type Domain names"
                    id="domainName"
                  onChange={handleDomainNameInput}
                    value={associateDomainInput}
                  />
                 <Button variant="outline-primary" id="button-addon2" type="button" onClick={handleAddDomainName}>
          Add
        </Button>
                  </InputGroup>
                  <div className="mt-3 d-flex flex-column gap-1">
                    
                   {associateDomains?.length>0 &&associateDomains?.map((item,index)=>{
                    return(
                  <div key={index} className="mt-3 d-flex flex-row gap-2 align-items-center">
                  <Form.Control
                  
                  type="text"
                 
                  id={item?.id}
                  onChange={(e) => !item.isDisabled && handleDomainValueChange(e)}
                  value={editingDomain.id === item.id ? editingDomain.value : item.value}
                  disabled={item?.isDisabled}
                />
                {item?.isDisabled === true?( <FontAwesomeIcon
  icon={faPencilAlt}
  size="md" // Adjust the size as needed, "lg" is an example
  onClick={() => handleEditDomainName(item.id)}
  style={{ cursor: "pointer",color:"#000" }}
/>):(   <FontAwesomeIcon
  icon={faCircleCheck}
  size="md" // Adjust size as needed
  onClick={() => handleSaveDomainName(item)}
  style={{ cursor: "pointer", color: "#000" }} // Adjust color as needed
/>)}
              
              <FontAwesomeIcon
  icon={faTrash}
  size="md" // You can adjust the size as needed
  onClick={() => handleSaveDomainName(item)}
  style={{ cursor: "pointer", color:"#000" }}
/>
                 
                      </div>
                    )
                   })}
                 
                  </div>
                </Col>
              
              </Row>
              
              <Row className="mb-3">
                <Form.Label
                  className="col-sm-3 col-form-label form-label"
                  htmlFor="orgUrl"
                >
                  Organization url
                </Form.Label>
                <Col sm={8} className="mb-3 mb-lg-0">
                  <Form.Control
                    isInvalid={!!errors.orgUrl}
                    type="text"
                    placeholder="Enter Organization url"
                    id="orgUrl"
                  
                    {...register("orgUrl", {
                      required: false,
                      minLength: 2,
                      maxLength:500,
                      pattern: {
                     value: /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/[^\s]*)?(\?[^\s]*)?(\#[^\s]*)?$/,
            message: "Invalid URL"
                      }
                    })}
                  />
       {errors.orgUrl && <Form.Control.Feedback type="invalid">Invalid url</Form.Control.Feedback>}
                </Col>
              </Row>
          
              <Row className="mb-3">
                <Form.Label className="col-sm-3" htmlFor="isInternalOrg">
                  Internal Organization
                </Form.Label>
                <Col md={8} xs={12}>
                  <Select
                    options={booleanOptions}
                    onChange={handleSelectedIsInternalOrg}
                    placeholder="Select Internal org"
                    isClearable
                     value={selectedIsInternalOrg}
                  />
                </Col>
              </Row>
              {method==="editOrg" &&(
 <Row className="mb-3">
 <Form.Label
   className="col-sm-3 col-form-label form-label"
   htmlFor="autoLoginUrl"
 >
   Auto login url
 </Form.Label>
 <Col sm={8} className="mb-3 mb-lg-0">
   <Form.Control
     isInvalid={!!errors.autoLoginUrl}
     type="text"
     placeholder=""
     id="autoLoginUrl"
     as="textarea" rows={3}
     //disabled
   
     {...register("autoLoginUrl",{
       required:false,
       minLength: 2,
       maxLength:500,
       pattern: {
        value: /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/[^\s]*)?(\?[^\s]*)?(\#[^\s]*)?$/,
        message: "Invalid URL"
          }
        })}
      />
{errors.autoLoginUrl && <Form.Control.Feedback type="invalid">Invalid url</Form.Control.Feedback>}
 </Col>
</Row>
              )}
             
              <Row className="mb-3">
                <Form.Label className="col-sm-3" htmlFor="alert">
                  Auto Login
                </Form.Label>
                <Col md={8} xs={12}>
                  <Select
                    options={booleanOptions}
                    onChange={handleSelectedIsAutoLogin}
                    placeholder="Select AutoLogin"
                    isClearable
                    value={selectedAutoLogin}
                  />
                </Col>
              </Row>
          </div>
        </Card.Body>
      </Card>
    </Col>
  </Row>
  )
}

export default OrgGeneralSetting