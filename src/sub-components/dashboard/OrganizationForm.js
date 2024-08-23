import React, { useEffect, useState, memo } from "react";
import { useForm } from "react-hook-form";
import { Col, Row, Form, Card, Button } from "react-bootstrap";
import OrgGeneralSetting from "../settings/OrgGeneralSetting";
import Preferences from "../settings/Preferences";
import { useQuery, useMutation } from "@tanstack/react-query";
import { commonQuery } from "@/app/api/user";
import { useRouter } from "next/navigation";
// import {toast} from 'react-hot-toast'
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";
// import { isOrganizationListDomainExists } from '@/app/api/datalist';
// import { productPermissionsArr } from "@/utils/formateDate";
import CommonModal from "./CommonModal";
const OrganizationForm = ({
  frequencyList,
  orgCategoryList,
  regionsList,
  topicList,
  languageList,
  method,
  org,
  orgKeyContactList,
  comparativeList,
}) => {

  const router = useRouter();

  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showCancelPop, setShowCancelPop] = useState(false);
  const [productPermissionsArr, setProductPermissionsArr] = useState([]);
  const [orgCreated, setOrgCreated] = useState(false);

  const [organizationDomains, setOrganizationDomains] = useState([]);
  const [
    updateOrganizationWhitelistDomain,
    setUpdateOrganizationWhitelistDomain,
  ] = useState([]);
  const [
    deleteOrganizationWhitelistDomain,
    setDeleteOrganizationWhitelistDomain,
  ] = useState([]);
  // mutation call

  const {
    isPending,
    isError,
    error,
    mutate: createNewOrg,
    data,
  } = useMutation({
    mutationFn: async (data) => {
      return await commonQuery(
        "POST",
        `/api/Organization/CreateOrganization`,
        data
      );
    },
    onSuccess(data, variables, context) {
      if (data?.data?.statusCode == 200) {
        setOrgCreated(true);
        toast.success("Organization created successfully!!", {
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
      console.error(error);
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

    mutate: editOrganization,
  } = useMutation({
    mutationFn: async (data) => {
      return await commonQuery(
        "PUT",
        `/api/Organization/UpdateOrganization`,
        data
      );
    },
    onSuccess(data, variables, context) {
      if (data?.data?.statusCode == 200) {
        setOrgCreated(true);
        toast.success("Organization updated!", {
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
    getValues,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      organizationName: org?.organizationName || "",
      orgCategory: {
        value: org?.organizationCategory?.organizationCategoryID || "",
        label: org?.organizationCategory?.categoryName || "",
      },
      countryId: org?.organizationSubscriptions?.country || "",
      topicId: org?.organizationSubscriptions?.topics || "",
      language: org?.organizationSubscriptions?.languages || "",
      domainNames: org?.availableDomains || "",
      organizationDomains: org?.organizationDomains || "",
      associateAddresses: org?.associatedAddress || "",
      orgUrl: org?.organizationURL || "",
      isInternalOrg: {
        value: org?.internalOrganization ? true : false,
        label: org?.internalOrganization ? "Yes" : "No",
      },
      isAutoLogin: {
        value: org?.autoLogin ? true : false,
        label: org?.autoLogin ? "Yes" : "No",
      },
      autoLoginUrl: org?.autoLoginURL || "",
      productPermission: [],
      firmContact: org?.firmContact || "",
    },
  });

  const onSubmit = (data) => {
    //   try {
    //     const organizationtDomainExists = isOrganizationListDomainExists(data?.domainName);
    //     console.log('organizationtDomainExists',organizationtDomainExists);
    //     if(organizationtDomainExists) {
    //       toast.error('Domain name already exists')
    //       return
    //     }
    // } catch (error) {
    //     console.error("Error checking domain existence:", error);
    //     // Handle error scenario, e.g., show an error message to the user
    // }
    const whitelistDomains = [
      {
        id: 0,
        domainName: "string",
        organizationId: org?.organizationID || 0,
        createdDate: new Date().toISOString(),
      }
    ];
    const updatedPermissions = productPermissionsArr?.map((permission) => {
      const newPermission = { ...permission };
      data?.productPermission?.forEach((item) => {
        if (newPermission[item.value] !== undefined) {
          newPermission[item.value] = true;
        }
      });
      return newPermission;
    });


    const isLanguage = data?.language === "";
    const isTopic = data?.topicId === "";
    const isCountry = data?.countryId === "";
    const anyNotEmpty = !isLanguage || !isTopic || !isCountry;
    const allEmpty = isLanguage && isTopic && isCountry;
    const allFilled = !isLanguage && !isTopic && !isCountry;
    if (anyNotEmpty && !(allEmpty || allFilled)) {
      setShowError(true);
      setErrorMsg("Please select Country,Topic and Language");
      toast.warning(
        "If you select a country, topic, or language, please make sure to select the other two as well.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } else {
      if (method === "addOrg") {
        createNewOrg({
          organizationName: data?.organizationName,
          availableDomains: data?.domainNames,
          organizationCategoryID: data?.orgCategory?.value,
          organizationCategory: null,
          firmContact: data?.firmContact === "" ? null : data?.firmContact,
          organizationURL: data?.orgUrl === "" ? null : data?.orgUrl,
          internalOrganization: data?.isInternalOrg?.value,
          // autoLogin: data?.isAutoLogin?.value,
          // createdDate: new Date().toUTCString(),
          createdDate: new Date().toISOString(),
          comparativeGuides: updatedPermissions?.[0],
          cG_CrossBorderRealEstateMap: false,
          cG_RegulatoryHeatmapForRetailBankingAndFintech: false,
          organizationUsers: null,
          organizationSubscriptions:
            data?.topicId === ""
              ? null
              : {
                  subscriptionID: 0,
                  organizationID: 0,
                  Topics: data?.topicId,
                  Country: data?.countryId,
                  Languages: data?.language,
                },
          organizationDomains,
          updateOrganizationWhitelistDomain,
          deleteOrganizationWhitelistDomain,
        });
      } else if ((method = "editOrg")) {
          editOrganization({
            organizationName: data?.organizationName,
            availableDomains: data?.domainNames,
            organizationCategoryID: data?.orgCategory?.value,
            organizationCategory: null,
            firmContact:data?.firmContact === ""?null:data?.firmContact,
            organizationURL: data?.orgUrl ===""?null:data?.orgUrl,
            internalOrganization: data?.isInternalOrg?.value,
            autoLogin: data?.isAutoLogin?.value,
            // createdDate: new Date().toUTCString(),
            createdDate: new Date().toISOString(),
            comparativeGuides: updatedPermissions?.[0],
            cG_CrossBorderRealEstateMap: false,
            cG_RegulatoryHeatmapForRetailBankingAndFintech: false,
            organizationUsers: null,
            organizationSubscriptions:data?.topicId ===""?null:
              {
                subscriptionID:  org?.organizationSubscriptions?.subscriptionID??0,
                organizationID: org?.organizationID,
                Topics: data?.topicId,
                Country: data?.countryId,
                Languages: data?.language,
              },
            
              organizationID: org?.organizationID,
              updateOrganizationWhitelistDomain,
              deleteOrganizationWhitelistDomain,
        });
      }
    }
  };

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
      <OrgGeneralSetting
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
        organizationID={org.organizationID}
        orgCategoryList={orgCategoryList}
        clearErrors={clearErrors}
        method={method}
        organizationDomains={organizationDomains}
        setOrganizationDomains={setOrganizationDomains}
        updateOrganizationWhitelistDomain={updateOrganizationWhitelistDomain}
        setUpdateOrganizationWhitelistDomain={
          setUpdateOrganizationWhitelistDomain
        }
        deleteOrganizationWhitelistDomain={deleteOrganizationWhitelistDomain}
        setDeleteOrganizationWhitelistDomain={
          setDeleteOrganizationWhitelistDomain
        }
      />
      <Preferences
        frequencyList={frequencyList}
        emailFrequency={[]}
        regionsList={regionsList}
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
        topicList={topicList}
        languageList={languageList}
        isAlert={false}
        isEmailFrequency={false}
        isUserRoles={false}
        orgKeyContactList={orgKeyContactList}
        isKeyContact={true}
        defaultPermission={org?.comparativeGuides}
        comparativeList={comparativeList}
      />
      <Row className="mb-8">
        <Col md={{ offset: 3, span: 11 }} xs={12} className="mt-2 d-flex gap-4">
          <Button
            variant="primary"
            type="submit"
            disabled={isPending || isEditPending || orgCreated}
          >
            {method === "addOrg" ? "Add" : "Save Changes"}

            {(isPending || isEditPending) && (
              <Spinner
                style={{ marginLeft: "8px" }}
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </Button>
          <Button
            className="btn btn-danger"
            type="button"
            disabled={orgCreated}
            onClick={handleShowCancelPop}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </form>
  );
};

export default memo(OrganizationForm);