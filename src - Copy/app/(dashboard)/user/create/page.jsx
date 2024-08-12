'use client'
import { Container, Row, Col, Button } from 'react-bootstrap';
import React, { useEffect, useState } from "react";
// import {toast} from 'react-hot-toast'
import {
    getUserById,
    getDropdownData,
    getFrequencyList,
    getEADDropdownData,
    getRolesData,
    getComparativeData
  } from "@/app/api/user";
  import ProfileEditForm from "@/sub-components/dashboard/ProfileEditForm";
import { PageHeading } from '@/widgets';
import { toast, ToastContainer } from "react-toastify";
const CreateUser = () => {
    const [frequencyList, setFrequencyList] = useState([]);
    const [regionsList, setRegionsList] = useState([]);
    const [topicList, setTopicList] = useState([]);
    const [languageList, setLanguageList] = useState([]);
    const [isLoading,setIsLoading]=useState(false);
    const [roleList, setRoleList] = useState([]);
    const [comparativeList,setComparativeList] = useState([])
    useEffect(() => {
        const fetchData = async () => {
          try {
            setIsLoading(true)
              const frequencyData = await getFrequencyList();
    
               const dropDownData = await getEADDropdownData();
               const rolesData = await getRolesData();
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
              if(rolesData?.statusCode===200){
                setRoleList(rolesData?.data?.data);
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
              //  setComparativeData()
               setIsLoading(false)
            
          } catch (error) {
            console.error("Error fetching user details:", error);
            setIsLoading(false)
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
            
      {/* <GeneralSetting user={user} /> */}
      <ProfileEditForm
      
        frequencyList={frequencyList}
        emailFrequency={{}}
        regionsList={regionsList}
        topicList={topicList}
        languageList={languageList}
        method="addUser"
        roleList={roleList}
        comparativeList={comparativeList}
      />
        </Container>
    );
};

export default CreateUser;
