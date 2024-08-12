'use client'

import React, { useEffect, useState } from 'react';
import { organizationById ,   organizationCategoryList,organizationKeyContact} from '@/app/api/organization';
import {

  getFrequencyList,
  getEADDropdownData,
  getComparativeData
} from "@/app/api/user";
import { PageHeading } from '@/widgets'
import { DeleteOrgAccount, GeneralOrgSetting, Preferences } from '@/sub-components'

import { Container, Row, Col, Button } from 'react-bootstrap';
import OrganizationForm from '@/sub-components/dashboard/OrganizationForm';
import { toast, ToastContainer } from "react-toastify";

const UpdateOrg = ({ params }) => {
  const { id: organizationId } = params;
  const [organization, setOrganization] = useState(null);
  const [frequencyList, setFrequencyList] = useState([]);
  const [regionsList, setRegionsList] = useState([]);
  const [topicList, setTopicList] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const [orgCategoryList, setOrgCategoryList] = useState([]);
  const [orgKeyContactList, setOrgKeyContactList] = useState([]);
  const [isLoading,setIsLoading]=useState(false);
  const [comparativeList,setComparativeList] = useState([])
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        if (organizationId) {
          const organizationData = await organizationById(organizationId);
          const frequencyData = await getFrequencyList();
          const orgCategoryData = await organizationCategoryList()
          const dropDownData = await getEADDropdownData();
        
        const orgKeyContactData = await organizationKeyContact();
        const comparativeData= await getComparativeData();
        
          if(comparativeData?.statusCode===200){
            const formattedData = comparativeData?.data?.map(item => ({
              label: item,
              value: item
            }));
            setComparativeList(formattedData)
           }else{
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

          if(organizationData?.statusCode===200){
            setOrganization(organizationData?.data);
          }else{
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
          if(frequencyData?.statusCode===200){
            setFrequencyList(frequencyData?.data);
          }else{
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
          if(orgCategoryData?.statusCode===200){
            setOrgCategoryList(orgCategoryData?.data?.data);
          }else{
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
        
           setRegionsList(dropDownData?.RegionsAndCountry);
           setTopicList(dropDownData?.TopicsAndSubTopics);
           setLanguageList(dropDownData?.Languages);
       
         
          setOrgKeyContactList(orgKeyContactData)
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching user details:', error);
        setIsLoading(false);
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
    };

    fetchData();
  }, [organizationId]);



  if (!organization) {
    return <div>Loading...</div>;
  }


  return (
    <Container fluid className="p-6">
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
      <p>Status : {organization.status}</p>
      <PageHeading heading={organization.organizationName} />
    <OrganizationForm   method="editOrg"
    org={organization}
          regionsList={regionsList}
          topicList={topicList}
          languageList={languageList}
          frequencyList={frequencyList}
          orgCategoryList={orgCategoryList}
          orgKeyContactList={orgKeyContactList}
          comparativeList={comparativeList}
          />

      
      <DeleteOrgAccount Id={organizationId} orgName={organization.organizationName} />

    </Container>
  );
};

export default UpdateOrg;