import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import useAuth from "@/hooks/useAuth";
import { handleResponse } from "@/api/representative/PaymentAPI";
import { StatusCodeEnum } from "@/lib/statusCodeEnum";
import { HandleResponse } from "@/models/Payment";

function WaitingCheckout() {
  const { user } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const hasProcessedPayment = useRef(false); // Flag để ngăn gọi lại processPayment
  const [loading, setLoading] = useState(true); // Trạng thái để hiển thị CircularProgress

  useEffect(() => {
    const queryParams = window.location.search;
    const urlParams = new URLSearchParams(queryParams);

    const vnp_OrderInfo = urlParams.get("vnp_OrderInfo");
    const vnp_ResponseCode = urlParams.get("vnp_ResponseCode");
    const vnp_TransactionNo = urlParams.get("vnp_TransactionNo");

    const pos_orderCode = urlParams.get("orderCode");
    const pos_status = urlParams.get("status");

    const processPayment = async () => {
      let data: HandleResponse = {
        representativeId: user?.representativeId ?? '',
        transactionInfo: '',
        transactionNumber: '',
        isSuccess: false,
      };
      let isSuccess = false;

      if (vnp_OrderInfo && vnp_ResponseCode && vnp_TransactionNo && user) {
        // Xử lý thanh toán VNPAY
        isSuccess = vnp_ResponseCode === "00";
        data = {
          representativeId: user.representativeId,
          transactionInfo: vnp_OrderInfo,
          transactionNumber: vnp_TransactionNo,
          isSuccess,
        };
      } else if (pos_orderCode && pos_status && user) {
        // Xử lý thanh toán PAYOS
        isSuccess = !(pos_status === "CANCELLED");
        data = {
          representativeId: user.representativeId,
          transactionInfo: isSuccess ? "Buy Successfully" : "Buy Failed",
          transactionNumber: pos_orderCode,
          isSuccess,
        };
      }

      const status = isSuccess ? "success" : "fail";

      if (data && user?.representativeId) {
        try {
          const postMethod = await handleResponse(data);
          if (postMethod.statusCode === StatusCodeEnum.SUCCESS) {
            setPaymentStatus(status);
            if (isSuccess) {
              setTimeout(() => {
                window.location.href = "/representative";
              }, 2000);
            } else {
              console.log("Error");
            }
          } else {
            console.log("There was an error processing");
          }
        } catch (error) {
          console.error(error);
        }
      }

      setPaymentStatus(status);
      setLoading(false); // Đổi trạng thái loading khi hoàn tất
    };

    if (user?.representativeId && !hasProcessedPayment.current) {
      processPayment();
      hasProcessedPayment.current = true;
    }
  }, [user]);

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      {paymentStatus === "success" && (
        <Box className="status-payment">
          <Alert
            severity="success"
            style={{ fontSize: "35px", display: "flex", alignItems: "center" }}
          >
            Payment Successfully
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
            Payment Failed
          </Alert>
        </Box>
      )}

      <Box className="buttonLoading" marginTop={4}>
        <Box className="buttonItem" marginBottom={2}>
          <Link to="/staff">
            <Button variant="contained">Back to home page</Button>
          </Link>
        </Box>
        <Box className="buttonItem">
          <Link to="/view-package">
            <Button variant="contained">Back to package</Button>
          </Link>
        </Box>
      </Box>

      {loading && <CircularProgress sx={{ marginTop: "50px" }} />}
    </Container>
  );
}

export default WaitingCheckout;
