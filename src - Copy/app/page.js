'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate,useIsAuthenticated } from "@azure/msal-react";
import { authScopes } from '@/authConfig';
import Link from 'next/link';
import useMounted from '@/hooks/useMounted';
import { toast, ToastContainer } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
const AdminLanding = () => {
     const router = useRouter();
     const hasMounted = useMounted();
    const isAuthenticated = useIsAuthenticated();
    const { instance, accounts, inProgress } = useMsal();
    const [isLoading,setIsLoading] = useState(false)
const handleLogin = async () =>{
  setIsLoading(true)
    try {
        const loginResponse = await instance.loginRedirect(authScopes);
        setIsLoading(false)
    } catch (error) {
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
  
}

useEffect(()=>{
    if(accounts){
    }

},[accounts]);

    useEffect(()=>{
     if(isAuthenticated===true){
        router.replace("/user")
     }
    },[isAuthenticated])
  return (
    <>
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
        <Row className="align-items-center justify-content-center g-0 min-vh-100">
        
    <Col xxl={4} lg={6} md={8} xs={12} className="py-2 py-xl-0">
      {/* Card */}
      <Card className="smooth-shadow-md">
        {/* Card body */}
        <Card.Body className="p-6">
          <div className="mb-4">
            <h1 style={{color:"#624BFF", fontWeight:"600"}}>Our Thinking Admin</h1>
            <p className="mb-6">Sign in to access Admin Panel.</p>
          </div>
          {/* Form */}
      
            <Form>
        
                <div className="d-grid">
                  <Button onClick={handleLogin} disabled={isLoading|| inProgress==="startup"} variant="primary" type="button">
                    Sign In
                    {(isLoading || inProgress==="startup") && (
              <Spinner
                style={{ marginLeft: "8px" }}
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
                    </Button>
                </div>
              
        
            </Form>


        </Card.Body>
      </Card>
    </Col>
  </Row>
    </>

  )
}

export default AdminLanding