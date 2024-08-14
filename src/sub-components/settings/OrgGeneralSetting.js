import { useState, useEffect,memo } from "react";
import { Col, Row, Form, Card,InputGroup,Button  } from "react-bootstrap";
import Image from "next/image";
import Select from "react-select";
const OrgGeneralSetting = ({  register, errors,setValue,getValues,orgCategoryList, clearErrors,method }) => {
    const defaultValues = getValues();
    const defaultDomainNames = getValues()?.domainNames;
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
// const [associateAddress,setAssociateAddress] = useState([]);
// const [associateAddressInput,setAssociateAddressInput] = useState("")
// const [editingAddress, setEditingAddress] = useState({ id: "", value: "" });
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
  setSelectedAutoLogin(selectedOption);
  setValue("isAutoLogin", selectedOption);
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
const handleAddDomainName = () => {

  if (associateDomainInput !== "") {
    setAssociateDomain((prev) => {
      const updatedDomains = [...prev, {
        isDisabled: true,
        id: associateDomainInput,
        value: associateDomainInput
      }];
      updateSingleDomainName(updatedDomains);
      return updatedDomains;
    });
    // Moved outside the setState function
    setAssociateDomainInput("");
  }
}

const handleEditDomainName = (id, value) => {
  setEditingDomain({ id, value });
  setAssociateDomain((prev) =>
    prev.map((domain) =>
      domain.id === id ? { ...domain, isDisabled: false } : domain
    )
  );
};
const handleDomainValueChange = (e) => {
  setEditingDomain({ ...editingDomain, value: e.target.value });
};
const handleSaveDomainName = (id) => {
  setAssociateDomain((prev) => {
    const updatedDomains = prev.map((domain) => {
      if (domain.id === id) {
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

const handleDeleteDomain = (id) => {
  setAssociateDomain((prev) => {
    const updatedDomains = prev.filter((domain) => domain.id !== id);
    updateSingleDomainName(updatedDomains);
    return updatedDomains;
  });
};
console.log("associateDomains---",associateDomains);



useEffect(() => {
  if (typeof defaultDomainNames === 'string' && defaultDomainNames.trim() !== '') {
    const transformData = (data) => {
      return data
        .split('|') 
        .map((item) => item.trim()) 
        .filter((item, index, self) => item && self.indexOf(item) === index) 
        .map((item) => ({
          id: item,
          value: item,
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
                {item?.isDisabled === true?(   <Image
                  alt="edit"
                  width={20}
                  height={20}
                  src='/images/icons/pencil.png'
                  onClick={() => handleEditDomainName(item.id)}
                  style={{cursor:"pointer"}}
                />):(   <Image
                  alt="edit"
                  width={20}
                  height={20}
                  src='/images/icons/correct.png'
                  onClick={() => handleSaveDomainName(item.id)}
                  style={{cursor:"pointer"}}
                />)}
              
                 <Image style={{cursor:"pointer"}} alt="avatar" width={20}  height={20} src='/images/icons/delete.png' onClick={() => handleDeleteDomain(item.id)}  />
                 
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
     disabled
   
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