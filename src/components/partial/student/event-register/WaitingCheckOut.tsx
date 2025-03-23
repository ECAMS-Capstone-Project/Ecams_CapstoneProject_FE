/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import useAuth from "@/hooks/useAuth";
import { handleResponse } from "@/api/representative/PaymentAPI";
import { handleEventResponse } from "@/api/student/EventRegistrationAgent";
import { StatusCodeEnum } from "@/lib/statusCodeEnum";
import { HandleResponse, StudentHandleResponse } from "@/models/Payment";

function WaitingCheckout() {
  const { user } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const hasProcessedPayment = useRef(false);
  const [loading, setLoading] = useState(true);
  const [isEventRegistration, setIsEventRegistration] = useState(false);

  useEffect(() => {
    const queryParams = window.location.search;
    const urlParams = new URLSearchParams(queryParams);

    const vnp_OrderInfo = urlParams.get("vnp_OrderInfo");
    const vnp_ResponseCode = urlParams.get("vnp_ResponseCode");
    const vnp_TransactionNo = urlParams.get("vnp_TransactionNo");

    const pos_orderCode = urlParams.get("orderCode");
    const pos_status = urlParams.get("status");
    console.log("vnp_OrderInfo:", vnp_OrderInfo);

    // Kiểm tra nếu OrderInfo hoặc OrderCode có từ khóa "Event" hoặc bất kỳ chuỗi nào xác định sự kiện
    const isEventReg = Boolean(
      vnp_OrderInfo?.toLowerCase().includes("pay") ||
        pos_orderCode?.toLowerCase().includes("pay")
    );

    setIsEventRegistration(isEventReg);

    if (user && !hasProcessedPayment.current) {
      processPayment(
        vnp_OrderInfo,
        vnp_ResponseCode,
        vnp_TransactionNo,
        pos_orderCode,
        pos_status
      );
      hasProcessedPayment.current = true;
    }
  }, [user]);

  const processPayment = async (
    vnp_OrderInfo: string | null,
    vnp_ResponseCode: string | null,
    vnp_TransactionNo: string | null,
    pos_orderCode: string | null,
    pos_status: string | null
  ) => {
    let isSuccess = false;
    let data: HandleResponse | StudentHandleResponse;

    // Kiểm tra nếu OrderInfo hoặc OrderCode có từ khóa "Event"
    const isEventReg = Boolean(
      vnp_OrderInfo?.toLowerCase().includes("pay") ||
        pos_orderCode?.toLowerCase().includes("pay")
    );

    if (vnp_OrderInfo && vnp_ResponseCode && vnp_TransactionNo && user) {
      // Xử lý thanh toán VNPAY
      isSuccess = vnp_ResponseCode === "00";
      if (isEventReg) {
        // const eventId = vnp_OrderInfo.split("_")[1];
        // if (!eventId) {
        //   console.error("Event ID not found in OrderInfo");
        //   return
        data = {
          studentId: user.userId,
          transactionInfo: vnp_OrderInfo,
          transactionNumber: vnp_TransactionNo,
          isSuccess,
        };
        console.log("Event registration data:", data);
      } else {
        data = {
          representativeId: user.representativeId,
          transactionInfo: vnp_OrderInfo,
          transactionNumber: vnp_TransactionNo,
          isSuccess,
        };
      }
    } else if (pos_orderCode && pos_status && user) {
      // Xử lý thanh toán PAYOS
      isSuccess = !(pos_status === "CANCELLED");
      if (isEventReg) {
        data = {
          studentId: user.userId,
          transactionInfo: isSuccess
            ? "Registration Successfully"
            : "Registration Failed",
          transactionNumber: pos_orderCode,
          isSuccess,
        };
      } else {
        data = {
          representativeId: user.representativeId,
          transactionInfo: isSuccess ? "Buy Successfully" : "Buy Failed",
          transactionNumber: pos_orderCode,
          isSuccess,
        };
      }
    } else {
      return;
    }

    const status = isSuccess ? "success" : "fail";

    try {
      let response;
      if (isEventReg) {
        // Khi thanh toán là sự kiện
        response = await handleEventResponse(data as StudentHandleResponse);
      } else {
        // Khi thanh toán là gói
        response = await handleResponse(data as HandleResponse);
      }

      console.log("Response:", response); // Log response để kiểm tra

      if (response.statusCode === StatusCodeEnum.SUCCESS) {
        setPaymentStatus(status);
        if (isSuccess) {
          setTimeout(() => {
            if (isEventReg) {
              window.location.href = "/student/student-events";
            } else {
              window.location.href = "/representative";
            }
          }, 2000);
        } else {
          console.log("Error processing the payment.");
        }
      } else {
        console.log("There was an error processing the payment.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }

    setPaymentStatus(status);
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      {paymentStatus === "success" && (
        <Box className="status-payment">
          <Alert
            severity="success"
            style={{ fontSize: "35px", display: "flex", alignItems: "center" }}
          >
            {isEventRegistration
              ? "Event Registration Successful"
              : "Payment Successfully"}
          </Alert>
        </Box>
      )}

      {paymentStatus === "fail" && (
        <Box className="status-payment">
          <Alert
            severity="error"
            style={{
              fontSize: "35px",
              display: "flex",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {isEventRegistration
              ? "Event Registration Failed"
              : "Payment Failed"}
          </Alert>
        </Box>
      )}

      <Box className="buttonLoading" marginTop={4}>
        <Box className="buttonItem" marginBottom={2}>
          <Link to={isEventRegistration ? "/student" : "/representative"}>
            <Button variant="contained">Back to home page</Button>
          </Link>
        </Box>
        <Box className="buttonItem">
          <Link to={isEventRegistration ? "/student/event" : "/view-package"}>
            <Button variant="contained">
              {isEventRegistration ? "Back to events" : "Back to package"}
            </Button>
          </Link>
        </Box>
      </Box>

      {loading && <CircularProgress sx={{ marginTop: "50px" }} />}
    </Container>
  );
}

export default WaitingCheckout;
