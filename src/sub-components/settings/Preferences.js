// import node module libraries
import { Col, Row, Form, Card } from "react-bootstrap";
import { useEffect, useState, useRef, memo } from "react";
import MultiSelectDropdown from "@/sub-components/dashboard/MultiSelectDropdown";
import MultiCheckAccordion from "@/sub-components/dashboard/MultiCheckAccordion";
// import widget as custom components
import { FormSelect } from "../../widgets";
import Select from "react-select";
import MultiCheckTopicSelection from "../dashboard/MultiCheckTopicSelection";
import { getRolesData } from '@/app/api/user';

const Preferences = ({
  frequencyList,
  emailFrequency,
  regionsList,
  register,
  errors,
  setValue,
  getValues,
  topicList,
  languageList,
  isEmailFrequency=true,
  isAlert=true,
  isUserRoles=false,
  roleList=[],
  orgKeyContactList=[],
  isKeyContact=false,
  defaultPermission,
  defaultRoles=[],
  comparativeList
}) => {
 
  // Ref to track if the effect has already run
  const hasEffectRun = useRef(false);
  const productPermissionRef = useRef(false);
  const defaultValues = getValues();
  const initialSelection = {};
defaultValues.countryId.split('|').forEach(item => {
  const [region, country] = item.split('#');
  if (!initialSelection[region]) {
    initialSelection[region] = {};
  }
  initialSelection[region][country] = true;
});
//console.log('initialSelection--',initialSelection);
  
  const selectedLanguage = defaultValues?.language;
  const selectedFirmContacts = defaultValues?.firmContact && new Set(defaultValues?.firmContact?.split('|'));

//  const defaultProductPermission=defaultValues.productPermissions
  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Spanish", label: "Spanish" },
    { value: "Arabic", label: "Arabic" },
  ];



  const alertOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [updatedFrequencyList, setUpdatedFrequencyList] = useState([]);
  //console.log('defaultValues?.emailFreq?.value-->',defaultValues?.emailFreq?.value)
  const [selectedFreq, setSelectedFreq] = useState(()=>{  
    // if(defaultValues?.emailFreq?.value === ""){
    //   return null
    // }else{
    //  return defaultValues?.emailFreq
    // }
    return defaultValues?.emailFreq
  });
  const [selectedAlert, setSelectedAlert] = useState(
    defaultValues?.instantAlert
  );
  const [updatedLanguageList, setUpdatedLanguageList] = useState([]);
  const [updatedRoleList, setUpdatedRoleList] = useState([]);
  const [viewRoleList, setViewRoleList] = useState([]);
  const [updatedKeyContactList, setUpdatedKeyContactList] = useState([]);
 
  const [selectedPermissions,setSelectedPermissions]= useState([]);
  const [selectedRoles,setSelectedRoles]= useState([])
  const [selectedKeyContacts,setSelectedKeyContacts]= useState([])


  const handleFrequencySelect = (selectedOption) => { 
    setSelectedFreq(selectedOption);
    setValue("emailFreq", selectedOption);
  };

  const handleAlertSelect = (selectedOption) => {
    setSelectedAlert(selectedOption);
    setValue("instantAlert", selectedOption);
  };

  const handleLanguageSelect = (selectedOption) => {
    setSelectedLanguages(selectedOption);

    const selectedLabelsString =
      selectedOption?.map((option) => option.label).join("|") || "";
    setValue("language", selectedLabelsString);
  };

  const handlePermissionSelect = (selectedOption) => {
   
     setSelectedPermissions(selectedOption);
     setValue("productPermission",selectedOption)
   
  };
  const handleRoleSelect = (selectedOption) => {
   
    setSelectedRoles(selectedOption);
     setValue("usersInRoles",selectedOption)
  
 };
 const handleKeyContactSelect = (selectedOption) => {
   
  setSelectedKeyContacts(selectedOption);
  const selectedKeyString =
  selectedOption?.map((option) => option.value).join("|") || "";
   setValue("firmContact",selectedKeyString)

};
 


  useEffect(() => {
    if (frequencyList?.length > 0) {
      const convertingIntoFromat = frequencyList?.map((item) => ({
        value: item?.subscriptionFrequencyID,
        label: item?.subscriptionFrequency,
      }));
      setUpdatedFrequencyList(convertingIntoFromat);
    }
  }, [frequencyList]);

  useEffect(() => {
    if (languageList?.length > 0) {
      const convertingIntoFromat = languageList?.map((item) => ({
        value: item?.relatedLanguageID,
        label: item?.relatedLanguage,
      }));
      setUpdatedLanguageList(convertingIntoFromat);
    }
  }, [languageList]);

  useEffect(() => {
    // Ensure the effect runs only once by checking the ref
    if (!hasEffectRun.current && updatedLanguageList.length > 0) {
      const selectedLabels = selectedLanguage.split("|");
      const defaultSelectedOptions = updatedLanguageList.filter((option) =>
        selectedLabels.includes(option.label)
      );
      setSelectedLanguages(defaultSelectedOptions);

      // Set the ref to true after the effect has run
      hasEffectRun.current = true;
    }
  }, [updatedLanguageList, selectedLanguage]);




 useEffect(()=>{
  if(orgKeyContactList?.length>0){
    const convertingIntoFormat = orgKeyContactList?.map((item) => ({
      value: item?.contactsID,
      label: item?.contactName,
    }));
    setUpdatedKeyContactList(convertingIntoFormat);

  }

 },[orgKeyContactList]);


 useEffect(()=>{
  if(defaultPermission &&Object.keys(defaultPermission)?.length>0){
  
    const formatted = Object?.entries(defaultPermission)
  .filter(([key, value]) => value)
  .map(([key]) => ({ label: key, value: key }));

  setSelectedPermissions(formatted);
  setValue("productPermission",formatted)
  }

 },[defaultPermission]);

 useEffect(()=>{
  if(roleList?.length>0){
    const convertingIntoFormat = roleList?.map((item) => ({
      value: item?.roleID,
      label: item?.roleName,
    }));
    setUpdatedRoleList(convertingIntoFormat);
  }

 },[])

 useEffect(()=>{
    if(defaultRoles && defaultRoles?.length>0){
      const convertingIntoFormat = defaultRoles?.map((item) => ({
        value: item?.roles?.roleID,
        label: item?.roles?.roleName,
      }));
      setSelectedRoles(convertingIntoFormat);
      setValue("usersInRoles",convertingIntoFormat) 
    }
  },[]);
 
  useEffect(() => {
    if (!selectedFirmContacts) return;
    // Filter and transform the contacts
    const selected = orgKeyContactList
      .filter(contact => selectedFirmContacts.has(contact.contactsID))
      .map(contact => ({
        value: contact.contactsID,
        label: contact.contactName
      }));
    setSelectedKeyContacts(selected);
  }, []);
  

  const fetchRolesData = async () => {
    try {
      const rolesData = await getRolesData();
      if (rolesData?.statusCode === 200) {
        const formattedRoles = rolesData?.data?.data.map((item) => ({
          value: item?.roleID,
          label: item?.roleName,
        }));
        setViewRoleList(formattedRoles);
      } else {
        toast.error("", {
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
      toast.error("", {
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
    fetchRolesData();
  }, []);


  return (
    <Row className="mb-8">
      <Col xl={3} lg={4} md={12} xs={12}>
        <div className="mb-4 mb-lg-0">
          <h4 className="mb-1">Preferences</h4>
          <p className="mb-0 fs-5 text-muted">Configure your preferences </p>
        </div>
      </Col>
      <Col xl={9} lg={8} md={12} xs={12}>
        <Card id="preferences">
          <Card.Body>
            <div className="mb-6">
              <h4 className="mb-1">Preferences</h4>
            </div>
        {isEmailFrequency &&(   <Row className="mb-3">
                <Form.Label className="col-sm-3" htmlFor="alert">
                  Email Frequency
                </Form.Label>
                <Col md={8} xs={12}>
                  <Select
                    options={updatedFrequencyList}
                    onChange={handleFrequencySelect}
                    placeholder="Select Email Frequency"
                    isClearable
                    value={selectedFreq}
                  />
                </Col>
              </Row>)}
           
{isAlert &&(  <Row className="mb-3">
                <Form.Label className="col-sm-3" htmlFor="alert">
                  Instant Alert
                </Form.Label>
                <Col md={8} xs={12}>
                  <Select
                    options={alertOptions}
                    onChange={handleAlertSelect}
                    placeholder="Select Instant Alert"
                    isClearable
                    value={selectedAlert}
                  />
                </Col>
              </Row>)}
            

              <Row className="mb-3">
                <Form.Label className="col-md-3" htmlFor="language">
                  Language
                </Form.Label>
                <Col md={8} xs={12}>
                  <Select
                    options={updatedLanguageList}
                    onChange={handleLanguageSelect}
                    placeholder="Select Languages"
                    isClearable
                    isMulti
                    value={selectedLanguages}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Form.Label className="col-md-3" htmlFor="language">
                  Countries
                </Form.Label>
                <Col md={8} xs={12}>
                  <MultiCheckAccordion
                    regionsList={regionsList}
                    initialSelection={defaultValues?.countryId}
                    setValue={setValue}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Form.Label className="col-md-3" htmlFor="language">
                  Topics
                </Form.Label>
                <Col md={8} xs={12}>
                  <MultiCheckTopicSelection
                    topicList={topicList}
                    initialSelection={defaultValues?.topicId}
                    setValue={setValue}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Form.Label className="col-md-3" htmlFor="language">
                  Product Permission
                </Form.Label>
                <Col md={8} xs={12}>
                <Select
                    options={comparativeList}
                    onChange={handlePermissionSelect}
                    placeholder="Select Permission"
                    isClearable
                    isMulti
                    value={selectedPermissions}
                  />
                </Col>
              </Row>
              {isKeyContact &&(  <Row className="mb-3">
                <Form.Label className="col-md-3" htmlFor="language">
                  Firm Contact
                </Form.Label>
                <Col md={8} xs={12}>
                <Select
                    options={updatedKeyContactList}
                    onChange={handleKeyContactSelect}
                    placeholder="Select internal people"
                    isClearable
                    isMulti
                    value={selectedKeyContacts}
                  />
                </Col>
              </Row>)}

              {isUserRoles &&(  <Row className="mb-3">
                <Form.Label className="col-md-3" htmlFor="language">
                  User roles
                </Form.Label>
                <Col md={8} xs={12}>
                <Select
                    options={viewRoleList}
                    onChange={handleRoleSelect}
                    placeholder="Select roles"
                    isClearable
                    isMulti
                    value={selectedRoles}
                  />
                </Col>
              </Row>)}
            
        
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default memo(Preferences);
