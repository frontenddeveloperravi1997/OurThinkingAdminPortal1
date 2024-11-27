// components/DataList.js

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Table, Dropdown, Form,Button } from 'react-bootstrap';
import { MoreVertical } from 'react-feather';
import { formatDate } from '@/utils/formateDate';
import {  toast,ToastContainer } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import { useQuery, useMutation } from "@tanstack/react-query";
import { commonQuery,exportAllDomains,exportAllUsers } from "@/app/api/user";
import CommonModal from './CommonModal';
import { useRouter } from "next/navigation";
import { useMediaQuery } from 'react-responsive';
const DataList = ({ fetchData, pageNumber, setTotalPages, pageType,itemsDisplayed,totalCount }) => {
    const isMobile = useMediaQuery({
        query: '(max-width: 950px)'
    });
    
    const buttonWrap = isMobile?"d-flex gap-3 flex-column w-100 flex-wrap":"d-flex gap-3 justify-content-between align-items-center"
       const contentWrap = isMobile?"d-flex gap-3 flex-wrap w-100 flex-column":"d-flex gap-3 flex-wrap"
    const router =useRouter()
    const getStatusUrl = () => {
      switch (pageType) {
          case 'exception':
              return `ExceptionDomain`;
          case 'blacklist':
              return `BlackListDomain`;
          case 'whitelist':
              return `WhiteListDomain`;
          case 'organizationcategory': // Add this case
              return `OrganizationCategory`;
          default:
              return ``;
      }
  };
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 10;
    const [isLoading,setLoading] = useState(false)
    const [showActionPop, setShowActionPop] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [currentActionDetails,setCurrentActionDetails] =useState({
        id:"",
        status:"",
        name:""
    });
    const getAddDomainDownloadUrl = () => {
        switch (pageType) {
            case 'exception':
                return 'ExportExceptionListDomain';
            case 'blacklist':
                return 'ExportBlackListDomain';
            case 'whitelist':
                return 'ExportWhiteListDomain';
            default:
                return '/';
        }
    };
    const handleDisableEnter = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      };
      const handleUpdateStatus = (status, id) => {
        updateStatus({
          data: [id],
          status,
        });
      };
      const handleDownloadUserFile = async () => {
        setExportLoading(true);
        try {
          const response = await exportAllDomains(getAddDomainDownloadUrl());
         
          toast.success("Domain file downloaded", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setExportLoading(false);
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
          setExportLoading(false);
        }
      };
    const fetchListData = async () => {
        setLoading(true)
        try {
            const responseData = await fetchData(pageNumber);
            if(responseData?.statusCode ===200){
                setTotalPages(responseData?.data?.totalPages);
                setData(responseData?.data?.data);
                setLoading(false)
            }else{
                toast.error('Oops something went wrong!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                   
                    });
                setLoading(false)
            }
        
       
        } catch (error) {
            toast.error('Oops something went wrong!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
               
                });
            setData([]);
            setLoading(false)
        }
    };

    const {
        isPending,
        isError,
        error,
        mutate: updateStatus,
      
      } = useMutation({
        mutationFn: async (data) => {
          
           return await commonQuery("PUT", `/api/${getStatusUrl()}/StatusChange?status=${data?.status}`, data?.data);
        },
        onSuccess(data, variables, context) {
            if(data?.data?.statusCode === 200){
                toast.success('Domain status updated successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                   
                    });

                    fetchListData();
                setShowActionPop(false);
                setCurrentActionDetails({
                    id:"",
                    status:"",
                    name:""
                })

            }else{
                toast.error('Oops something went wrong!', {
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
            // fetchUsers()
        },
        onError(error, variables, context) {
          console.error(error);
          toast.error('Oops something went wrong!', {
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

    useEffect(() => {
    
        fetchListData();
    }, [fetchData, pageNumber]);
    useEffect(() => {
        const fetchOptions = async () => {
          if (searchQuery.trim() === "") {
            fetchListData();
          }
          try {
            const response = await fetchData(null, searchQuery);
    
            if (response?.statusCode === 200) {
                setData(response.data?.data);
    
              // setLoading(false)
            } 
            else if(response?.statusCode === 204){
                toast.warning('No domain found!', {
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
            else {
                toast.error('Oops something went wrong!', {
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
    
            // setOptions(response.data); // Assuming the API returns an array of options
          } catch (error) {
            toast.error('Oops something went wrong!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
               
                });
            // Handle error appropriately
          }
        };
    
        // Debounce the API call to avoid making a call for every keystroke
        const delayDebounce = setTimeout(() => {
          fetchOptions();
        }, 300);
    
        return () => clearTimeout(delayDebounce);
      }, [searchQuery]);

      const getAddDomainUrl = () => {
        switch (pageType) {
            case 'exception':
                return '/exceptionlist/create';
            case 'blacklist':
                return '/blacklist/create';
            case 'whitelist':
                return '/whitelist/create';
            case 'organizationcategory':
                return '/organizationcategory/create';
            default:
                return '/';
        }
    };

    const handleShowActionPop = (status,id, domainName) => {
     
        setShowActionPop(true);
        setCurrentActionDetails({
            id,
            status,
            name:domainName
        })
      };
      const handleHideActionPop = () => {
        setShowActionPop(false);
      };

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <Link
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            className="text-muted text-primary-hover"
        >
            {children}
        </Link>
    ));

    CustomToggle.displayName = 'CustomToggle';

    const ActionMenu = ({ itemId, pageType,domainName,categoryName }) => {
        const getUpdateUrl = () => {
            switch (pageType) {
                case 'exception':
                    return `/exceptionlist/update/${itemId}`;
                case 'blacklist':
                    return `/blacklist/update/${itemId}`;
                case 'whitelist':
                    return `/whitelist/update/${itemId}`;
                case 'organizationcategory': 
                return `/organizationcategory/update/${itemId}`;
                default:
                    return ``;
            }
        };
        return (
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                    <MoreVertical size="15px" className="text-muted" />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                    <Dropdown.Item eventKey="1" as={Link} href={getUpdateUrl()} passHref>
                        View Details
                    </Dropdown.Item>
                
        {/* {status !== "active" && (
          <Dropdown.Item
            onClick={() => handleShowActionPop("active", itemId, domainName)}
            eventKey="2"
          >
            Activate
          </Dropdown.Item>
        )}
        {status !== "disable" && (
          <Dropdown.Item
            onClick={() => handleShowActionPop("disable", itemId, domainName)}
            eventKey="3"
          >
            Disable
          </Dropdown.Item>
        )}

        {status !== "archive" && (
          <Dropdown.Item
            onClick={() => handleShowActionPop("archive", itemId, domainName)}
            eventKey="4"
          >
            Archive
          </Dropdown.Item>
        )} */}
                </Dropdown.Menu>
            </Dropdown>
        );
    };

    return (
        <>
        <CommonModal 
          show={showActionPop}
          onClose={handleHideActionPop}
          heading={`Status Update`}
          body={`
              Do you want to update status of ${currentActionDetails?.name} to ${currentActionDetails?.status}
              `}
        >
        <>
          <Button variant="secondary" onClick={handleHideActionPop}>
            No
          </Button>
          <Button
           onClick={()=> handleUpdateStatus(currentActionDetails?.status,currentActionDetails?.id)}
        
            className="btn btn-danger"
          disabled={isPending}
          >
       yes
       {(isPending) && <Spinner style={{marginLeft:"8px"}} animation="border"  size="sm"
          role="status"
          aria-hidden="true" />}
          </Button>
       
        </> 
        </CommonModal>
        <Card className="h-100">
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
            <Card.Header className="bg-white py-6">
                <div className={buttonWrap}>
                <div className={contentWrap}>
                {pageType !== 'whitelist' && (
                  <Button
                    onClick={() => router.push(getAddDomainUrl())}
                    variant="outline-dark"
                  >
                    {pageType === 'organizationcategory' ? 'Create New Organization Category' : 'Create New Domain'}
                  </Button>
                )}

                {pageType !== 'organizationcategory' && (
        <Button onClick={handleDownloadUserFile} disabled={exportLoading} variant="outline-dark">
          Export
          {exportLoading && (
            <Spinner
              style={{ marginLeft: '8px' }}
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
        </Button>
      )}
                    <div className="d-flex gap-1 flex-row align-items-center" >
              <p className="m-0">
                
                {pageType === 'organizationcategory' ? 'Categories:' : 'Domains:'}
                </p>
              <p  className="m-0">{`${itemsDisplayed} of ${totalCount}`}</p>
            </div>
                </div>
                 
                    <div className={`ms-lg-3 ${isMobile&&"w-100"}`}>
                        <Form className="d-flex align-items-center">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleDisableEnter}
                            />
                        </Form>
                    </div>
                </div>
            </Card.Header>
            {isLoading ?<div style={{height:"20vh"}} className='d-flex w-100 align-middle justify-content-center align-items-center '>
                <Spinner animation="border" role="status" variant="primary"  >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
            </div>:(<>{data?.length>0&&(    <Table responsive="xl" hover striped className="text-nowrap">
                <thead className="table-light">
                    <tr>
                        {/* <th>Sr/No.</th>
                        <th>Domain ID</th> */}
                        <th>
                        {pageType === 'organizationcategory' ? 'Category Name' : 'Domain Name'}
                        </th>
                        {/* <th>Status</th> */}
                        <th>Created Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr key={item?.domainId}>
                      {/* <td className="align-middle">{index + 1 + (pageNumber - 1) * itemsPerPage}</td> */}
                      {/* <td className="align-middle">{item?.domainId}</td> */}
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          <div className="lh-1">
                          <h5 className="mb-1">
                            {pageType === "organizationcategory" ? item?.categoryName : item?.domainName}
                          </h5>
                          </div>
                        </div>
                      </td>
                      {/* <td className="align-middle">{item?.status}</td> */}
                      <td className="align-middle">{formatDate(item?.createdDate)}</td>
                      <td className="align-middle">
                        {pageType === 'whitelist' ? null : (
                          pageType === 'organizationcategory' ? (
                            <ActionMenu 
                              itemId={item?.organizationCategoryID} 
                              pageType={pageType} 
                              categoryName={item?.categoryName} 
                            />
                          ) : (
                            <ActionMenu 
                              itemId={item?.domainId} 
                              pageType={pageType} 
                              domainName={item?.domainName} 
                            />
                          )
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody> 
            </Table>)}</>)}
            
          
        
        </Card>
        </>
    );
};

export default DataList;
