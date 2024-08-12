"use client";

import React, { useEffect, useState } from "react";
import {
  getUserById,
  getDropdownData,
  getFrequencyList,
  getEADDropdownData,
  getRolesData,
  getComparativeData
} from "@/app/api/user";
import { PageHeading } from "@/widgets";
import {
  DeleteAccount,
  GeneralSetting,
  Preferences,
  ActivitySetting,
} from "@/sub-components";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import ProfileEditForm from "@/sub-components/dashboard/ProfileEditForm";

const UpdateUser = ({ params }) => {
  const { id: userID } = params;
  const [user, setUser] = useState(null);
  const [frequencyList, setFrequencyList] = useState([]);
  const [regionsList, setRegionsList] = useState([]);
  const [topicList, setTopicList] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [comparativeList,setComparativeList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userID) {
          const userData = await getUserById(userID);
          const frequencyData = await getFrequencyList();
          const rolesData = await getRolesData();
           const dropDownData = await getEADDropdownData();
           //console.log('dropDownData----',dropDownData);
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
          if(userData?.statusCode ===200){
            setUser(userData?.data);
         
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
          setRegionsList(dropDownData?.RegionsAndCountry);
          //console.log('setRegionsList-',setRegionsList);
          setTopicList(dropDownData?.TopicsAndSubTopics);
          setLanguageList(dropDownData?.Languages)
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
       
        }
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
      }
    };

    fetchData();
  }, [userID]);

  if (!user) {
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
      <p>Status: {user?.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : ''}</p>

      <PageHeading heading={user.username} />
      <ActivitySetting user={user} />
      {/* <GeneralSetting user={user} /> */}
      <ProfileEditForm
        user={user}
        frequencyList={frequencyList}
        emailFrequency={user.emailFrequency}
        regionsList={regionsList}
        topicList={topicList}
        languageList={languageList}
        method="updateUser"
        roleList={roleList}
        comparativeList={comparativeList}
      />

     
      <DeleteAccount userID={userID} userEmail={user?.email} />
    </Container>
  );
};

export default UpdateUser;
