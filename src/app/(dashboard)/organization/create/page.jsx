'use client'
import { Container, Row, Col, Button } from 'react-bootstrap';
import { PageHeading } from '@/widgets';
import { GeneralOrgSetting, Preferences } from '@/sub-components';
import OrganizationForm from '@/sub-components/dashboard/OrganizationForm';
import React, { useEffect, useState } from "react";
import {
    getUserById,
    getDropdownData,
    getFrequencyList,
    getEADDropdownData,
    getComparativeData
  } from "@/app/api/user";
  import {
    organizationCategoryList,
    organizationKeyContact
  } from "@/app/api/organization";
  import { toast, ToastContainer } from "react-toastify";
const CreateOrganization = () => {
    const [frequencyList, setFrequencyList] = useState([]);
    const [regionsList, setRegionsList] = useState([]);
    const [topicList, setTopicList] = useState([]);
    const [languageList, setLanguageList] = useState([]);
    const [orgCategoryList, setOrgCategoryList] = useState([]);
    const [orgKeyContactList, setOrgKeyContactList] = useState([]);
    const [comparativeList,setComparativeList] = useState([])
    const [isLoading,setIsLoading]=useState(false);
    useEffect(() => {
        const fetchData = async () => {
          try {
            setIsLoading(true)
           
              const orgCategoryData = await organizationCategoryList()
              const dropDownData = await getEADDropdownData();
            
           const orgKeyContactData = await organizationKeyContact()
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
         
              
           if(orgCategoryData?.statusCode === 200){
            setOrgCategoryList(orgCategoryData?.data);
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
               setIsLoading(false)
            
          } catch (error) {
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
            setIsLoading(false)
          }
        };
    
        fetchData();
      }, []);
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
            <PageHeading heading="General" />
         <OrganizationForm
         org={{}}
          method="addOrg"
          regionsList={regionsList}
          topicList={topicList}
          languageList={languageList}
          frequencyList={[]}
          orgCategoryList={orgCategoryList}
          orgKeyContactList={orgKeyContactList}
          comparativeList={comparativeList}
         />
          
        </Container>
    );
};

export default CreateOrganization;
