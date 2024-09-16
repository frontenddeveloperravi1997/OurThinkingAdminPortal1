import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Row, Form, Card, Button } from "react-bootstrap";
import GeneralSetting from "../settings/GeneralSetting";
import Preferences from "../settings/Preferences";
import { v4 as uuidv4 } from "uuid";
import Alert from "react-bootstrap/Alert";
// import {toast} from 'react-hot-toast'
import Spinner from "react-bootstrap/Spinner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { commonQuery } from "@/app/api/user";
import { useRouter } from "next/navigation";
// import { productPermissionsArr } from "@/utils/formateDate";
import { toast } from "react-toastify";
import CommonModal from "./CommonModal";
const ProfileEditForm = ({
  user,
  frequencyList,
  emailFrequency,
  regionsList,
  topicList,
  languageList,
  method,
  roleList,
  comparativeList,
}) => {
  const router = useRouter();
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showCancelPop, setShowCancelPop] = useState(false);
  const [emailValidLoading, setEmailValidLoading] = useState(false);
  const [isEmailExist, setIsEmailExist] = useState(null);
  const [productPermissionsArr, setProductPermissionsArr] = useState([]);
  const [userCreated,setUserCreated] = useState(false)
  // mutation call

  const {
    isPending,
    isError,
    error,
    mutate: createNewUser,
    data,
  } = useMutation({
    mutationFn: async (data) => {
      return await commonQuery("POST", `/api/User`, data);
    },
    onSuccess(data, variables, context) {
      if (data?.data?.statusCode == 200) {
        setUserCreated(true)
        toast.success("User created successfully!!", {
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
          router.back();
        }, 5000);
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
    },
    onError(error, variables, context) {
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
    },
  });

  const {
    isPending: isEditPending,
    mutate: updateUser,
  } = useMutation({
    mutationFn: async (data) => {
      return await commonQuery("PUT", `/api/User/${user?.userID}`, data);
    },
    onSuccess(data, variables, context) {     
      if (data?.data?.statusCode == 200) {
        setUserCreated(true)
        toast.success("User updated successfully!!", {
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
          router.back();
        }, 5000);
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
    },
    onError(error, variables, context) {
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
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
    getValues,
    watch,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      organization: {
        value: user?.organization?.organizationID || "",
        label: user?.organization?.organizationName || "",
      },
      emailFreq: {
        value: emailFrequency?.subscriptionFrequencyID || "",
        label: emailFrequency?.subscriptionFrequency || "",
      },
      instantAlert: {
        value: user?.subscribeToInstantAlert,
        label: user?.subscribeToInstantAlert === true ? "Yes" : "No",
      },
      countryId: user?.subscriptions?.[0]?.countryID || "",
      topicId: user?.subscriptions?.[0]?.topicID || "",
      language: user?.subscriptions?.[0]?.languageID || "",
      productPermission: [],
      usersInRoles: [],
    },
  });
  const emailWatch = watch("email");

  const onSubmit = (data) => {
    const updatedPermissions = productPermissionsArr.map((permission) => {
      const newPermission = { ...permission };
      data.productPermission.forEach((item) => {
        if (newPermission[item.value] !== undefined) {
          newPermission[item.value] = true;
        }
      });
      return newPermission;
    });
  
    const dataInstantAlert = data.instantAlert;
    const dataEmailFreq = data.emailFreq;
    const isLanguage = data.language !== "";
    const isTopic = data.topicId !== "";
    const isCountry = data.countryId !== "";
    const isProductPermission = data.productPermission !== "";
    const isUsersInRoles = data.usersInRoles !=="";
    const allEmpty = !isLanguage && !isTopic && !isCountry;
    const allFilled = isLanguage && isTopic && isCountry;
    const anyNotEmpty = !isLanguage || !isTopic || !isCountry;
  
    const transformedRoles =
    data?.usersInRoles?.length > 0
      ? data.usersInRoles.map((role) => ({
          roleId: role.value,
          userId: user?.userID,
        }))
      : null;
    const commonPayload = {
      userID: user?.userID,
      username: user?.username,
      email: data.email,
      emailFrequencyID: data.emailFreq?.value,
      subscriptions: data.topicId === "" ? null : [{
        subscriptionID: user?.subscriptions?.[0]?.subscriptionID,
        userID: user?.subscriptions?.[0]?.userID,
        topicID: data.topicId,
        countryID: data.countryId,
        languageID: data.language,
      }],
      emailNotifications: user?.emailNotifications,
      firstName: data.firstName,
      lastName: data.lastName,
      contactId: user?.contactId,
      createdDate: user?.createdDate,
      lastLoginDate: user?.lastLoginDate,
      invitationDate: user?.invitationDate,
      modifiedDate: new Date().toISOString(),
      exceptionDomain: user?.exceptionDomain,
      subscribeToInstantAlert: data.instantAlert?.label === "No" ? false : true,
      unsubscribeFromAlerts: data.instantAlert?.label === "No" ? true : false,
      organizationID: data.organization?.value === "" ? null : data.organization?.value,
      emailFrequency: user?.emailFrequency,
      comparativeGuides: updatedPermissions?.[0],
      usersInRoles: transformedRoles,
      organization: user?.organization,
      email_Verification: user?.email_Verification,
    };
  
    if (dataEmailFreq?.label === "Never" && dataInstantAlert?.label === "No" && allEmpty) {
      updateUser(commonPayload);
    } else if (dataEmailFreq?.label === "Never" && dataInstantAlert?.label === "Yes" && allEmpty) {
      setShowError(true);
      setErrorMsg("Please select Country, Topic and Language");
      toast.warning("If you select a country, topic, or language, please make sure to select the other two as well.", {
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
    else if (!dataEmailFreq?.label && dataInstantAlert?.label && allEmpty) {
      updateUser(commonPayload);
    } else if (!dataEmailFreq?.label && dataInstantAlert?.label && allFilled) {
      updateUser(commonPayload);
    } else if (dataEmailFreq?.label  && dataInstantAlert?.label && allFilled) {
      updateUser(commonPayload);
    } else if (dataEmailFreq?.label !== "Never" && dataInstantAlert?.label && allEmpty) {
      setShowError(true);
      setErrorMsg("Please select Country, Topic and Language");
      toast.warning("If you select a country, topic, or language, please make sure to select the other two as well.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      if (method === "addUser") {
        createNewUser({ ...commonPayload, userID: 0, contactId: uuidv4(), createdDate: new Date().toISOString() });
      } else if (method === "updateUser") {
        updateUser({ ...commonPayload, userID: user?.userID });
      }
    }
  };
  
  

  const checkEmailExists = async (email) => {
    setEmailValidLoading(true);
    try {
      const response = await commonQuery(
        "GET",
        `/api/User/CheckUserExists?email=${email}`,
        data
      );
      setEmailValidLoading(false);
      setIsEmailExist(response?.data);
    } catch (error) {
      setEmailValidLoading(false);
    }
  };

  useEffect(() => {
    if (emailWatch && emailWatch?.includes("@")) {
      const timer = setTimeout(() => {
        checkEmailExists(emailWatch);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [emailWatch]);


  const handleShowCancelPop = () => {
    setShowCancelPop(true);
  };
  const handleHideCancelPop = () => {
    setShowCancelPop(false);
  };

  const handleCancelForm = () => {
    router.back();
  };

  useEffect(() => {
    if (comparativeList && comparativeList?.length > 0) {
      const transformedData = comparativeList.reduce((acc, curr) => {
        acc[curr.label] = false;
        return acc;
      }, {});
      setProductPermissionsArr([transformedData]);
     
    }
  }, [comparativeList]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
   
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
      <GeneralSetting
        user={user}
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
        isDisabled={Boolean(method === "updateUser")}
        emailValidLoading={method === "updateUser" ? false : emailValidLoading}
        isEmailExist={method === "updateUser" ? null : isEmailExist}
        clearErrors={clearErrors}
      />
      <Preferences
        frequencyList={frequencyList}
        emailFrequency={user?.emailFrequency}
        regionsList={regionsList}
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
        topicList={topicList}
        languageList={languageList}
        roleList={roleList}
        defaultPermission={user?.comparativeGuides}
        isUserRoles={true}
        defaultRoles={(user && user?.usersInRoles) || []}
        comparativeList={comparativeList}
      />
      <Row className="mb-8">
        <Col md={{ offset: 3, span: 11 }} xs={12} className="mt-2 d-flex gap-4">
          <Button
            variant="primary"
            type="submit"
            disabled={isPending || isEditPending || userCreated}
          >
            {/* <div className="d-flex align-item justify-content:center gap-2"> */}
            {method === "updateUser" ? "Save Changes" : "Add"}

            {(isPending || isEditPending) && (
              <Spinner
                style={{ marginLeft: "8px" }}
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
            {/* </div> */}
          </Button>
          <Button
            className="btn btn-danger"
            type="button"
            onClick={handleShowCancelPop}
            disabled={userCreated}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </form>
  );
};

export default ProfileEditForm;  
