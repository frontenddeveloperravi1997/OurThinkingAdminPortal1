import React, { useState } from "react";
import { Card, Table, Dropdown, Form, Button } from "react-bootstrap";
import { saveAs } from "file-saver";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DownloadCloud,Download } from "react-feather";
import {
  commonQuery,
  exportAllUsers,
  exportAllOrgReport,
  exportAllOrgAuditReport,
  exportAllContentReport
} from "@/app/api/user";
import Spinner from "react-bootstrap/Spinner";
import { toast, ToastContainer } from "react-toastify";
import { useMediaQuery } from 'react-responsive';
const ReportsForm = () => {
  const isMobile = useMediaQuery({
    query: '(max-width: 768px)'
});
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState("");

  const handleDownloadUser = async () => {
    setButtonLoading("user");
    setIsLoading(true);
    try {
      const response = await exportAllUsers();
      toast.success("User file downloaded", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setIsLoading(false);
      setButtonLoading("");
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
      setIsLoading(false);
      setButtonLoading("");
    }
  };

  const handleDownloadOrg = async () => {
    setButtonLoading("org");
    setIsLoading(true);
    try {
      const response = await exportAllOrgReport();
      toast.success("Organization file downloaded successfully!!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setIsLoading(false);
      setButtonLoading("");
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
      setIsLoading(false);
      setButtonLoading("");
    }
  };
  const handleDownloadOrgAudit = async () => {
    setButtonLoading("audit");
    setIsLoading(true);
    try {
      const response = await exportAllOrgAuditReport();
      toast.success("Organization user audit file downloaded", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setIsLoading(false);
      setButtonLoading("");
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
      setIsLoading(false);
      setButtonLoading("");
    }
  };
  const handleDownloadContent = async () => {
    setButtonLoading("content");
    setIsLoading(true);
    try {
      const response = await exportAllContentReport();
     
      toast.success("Content report file downloaded", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setIsLoading(false);
      setButtonLoading("");
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
      setIsLoading(false);
      setButtonLoading("");
    }
  };

  return (
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
        <div className="d-flex gap-3 flex-wrap">
          <Button
            onClick={handleDownloadUser}
            disabled={isLoading}
              variant="outline-dark"
          >
           Users report
           <Download color="#624BFF" size="20px" className="text-muted mx-2"/>
            {isLoading && buttonLoading === "user" && (
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
            onClick={handleDownloadOrg}
            disabled={isLoading}
            variant="outline-dark"
          >
            Organization report
            <Download color="#624BFF" size="20px" className="text-muted mx-2"/>
            {isLoading && buttonLoading === "org" && (
              <Spinner
                style={{ marginLeft: "8px" }}
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </Button>
          <Button onClick={handleDownloadOrgAudit} disabled={isLoading}      variant="outline-dark">
             Organization user audit report
             <Download color="#624BFF" size="20px" className="text-muted mx-2"/>
            {isLoading && buttonLoading === "audit" && (
              <Spinner
                style={{ marginLeft: "8px" }}
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </Button>
          <Button onClick={handleDownloadContent} disabled={isLoading}      variant="outline-dark">
            Content report
            <Download color="#624BFF" size="20px" className="text-muted mx-2"/>
            {isLoading && buttonLoading === "content" && (
              <Spinner
                style={{ marginLeft: "8px" }}
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </Button>
          <div className="ms-lg-3 d-none d-md-none d-lg-block"></div>
        </div>
      </Card.Header>
    </Card>
  );
};

export default ReportsForm;
