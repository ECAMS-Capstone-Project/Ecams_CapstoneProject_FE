import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
    Box,
    Button,
    CardContent,
    Typography,
    List,
    ListItem,
    TextField,
    Container,
    Grid2,
    CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { paymentPackage } from "@/api/staff/PaymentAPI";
import { StatusCodeEnum } from "@/lib/statusCodeEnum";

const schema = z.object({
    fullName: z.string().min(1, "Vui lòng nhập họ tên."),
    signature: z.string().min(1, "Vui lòng ký trước khi xác nhận."),
});

const PackageContract = () => {
    const userSignatureRef = useRef<SignatureCanvas>(null);
    const [, setUserSignature] = useState<string | null>(null);
    const location = useLocation();
    const { selectedPlan, paymentMethod } = location.state || {};
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {
        control,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            fullName: "",
            signature: "",
        },
    });

    const predefinedSignature =
        "https://res.cloudinary.com/ecams/image/upload/v1738675298/ecams_signature.png";

    const clearSignature = () => {
        userSignatureRef.current?.clear();
        setUserSignature(null);
        setValue("signature", "");
        setValue("fullName", "");
    };

    const handleSignatureEnd = () => {
        if (userSignatureRef.current && !userSignatureRef.current.isEmpty()) {
            const signatureData = userSignatureRef.current.toDataURL();
            setUserSignature(signatureData);
            setValue("signature", signatureData);
            clearErrors("signature");
        }
    };

    const formattedDate = new Date().toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const dataURLtoFile = (dataUrl: string, filename: string) => {
        const arr = dataUrl.split(",");
        const mime = arr[0].match(/:(.*?);/)?.[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const onSubmit = async (data: { fullName: string; signature: string }) => {
        if (user && selectedPlan && paymentMethod) {
            setIsLoading(true);
            try {
                const signatureFile = dataURLtoFile(data.signature, "signature.png");
                const formData = new FormData();
                formData.append("SignatureFile", signatureFile);
                formData.append("PackageId", selectedPlan.packageId);
                formData.append("PaymentMethodId", "59b3cf1a-4ed7-469a-a551-5196755a12ad");
                formData.append("StaffId", user.staffId);

                const response = await paymentPackage(formData);
                console.log(paymentMethod);
                console.log(response);

                if (response.statusCode == StatusCodeEnum.CREATED && response.data) {
                    toast.success("Payment successful");
                    if (paymentMethod == "VnPay") {
                        // For VNPAY: redirect using the data directly
                        if (typeof response.data === 'string') {
                            window.location.replace(response.data);
                        } else {
                            toast.error("Invalid response data");
                        }
                    } else if (paymentMethod == "1") {
                        // For PAYOS: redirect using the checkoutUrl
                        if (typeof response.data !== 'string' && response.data.checkoutUrl) {
                            window.location.replace(response.data.checkoutUrl);
                        } else {
                            toast.error("Invalid response data");
                        }
                    }
                } else {
                    toast.error("Payment failed");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    };


    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f5f5f5" }}>
            <Container maxWidth="md" sx={{ boxShadow: 3, background: "white", pt: 2, pb: 3 }}>
                <CardContent>
                    <Typography variant="h6" textAlign="center" fontWeight="bold" mb={1}>
                        Platform ECAMS
                    </Typography>
                    <Typography variant="h5" textAlign="center" fontWeight="bold">
                        PREVIEW SERVICE CONTRACT
                    </Typography>

                    <Typography variant="body1" mt={3} mb={2}>
                        <b>Party A (Company):</b> ECAMS - Software Service Provider.
                    </Typography>
                    <Typography variant="body1">
                        <b>Party B (Customer):</b> <span style={{ fontWeight: "bold", color: "blue" }}>{user?.fullname}</span>
                    </Typography>
                    <div className="w-full border-t border-gray-300 opacity-50 mt-3"></div>
                    <List>
                        <ListItem><b>Article 1: Contract Content</b></ListItem>
                        <ListItem><span>🎯 Party A provides the <b>{selectedPlan?.packageName}</b> service package to Party B for a period of <b>{selectedPlan?.duration} month</b>.</span></ListItem>

                        <ListItem><b>Article 2: Rights and Responsibilities</b></ListItem>
                        <ListItem>✅ Party B has the right to use premium service features.</ListItem>
                        <ListItem>✅ Party A is responsible for maintaining stable service operations.</ListItem>
                        <ListItem><span>✅ Party B is responsible for full payment of <b>${selectedPlan?.price}.00</b>.</span></ListItem>

                        <ListItem><b>Article 3: Payment Terms</b></ListItem>
                        <ListItem>💰 Party B shall make payments through supported methods.</ListItem>
                        <ListItem>💰 Party A will suspend the service if Party B fails to make timely payments.</ListItem>

                        <ListItem><b>Article 4: Contract Cancellation Policy</b></ListItem>
                        <ListItem>🚫 Party B may request contract cancellation but will not receive a refund.</ListItem>

                        <ListItem><b>Article 5: Contract Validity</b></ListItem>
                        <ListItem>📅 The contract is effective from {formattedDate} and ends after 1 month.</ListItem>
                    </List>

                    <div className="w-full border-t border-gray-300 opacity-50 mt-2 mb-4"></div>

                    <Grid2 container spacing={2} mt={1}>
                        <Grid2 size={{ md: 6, xs: 12 }}>
                            <Typography fontWeight="bold" textAlign={"center"}>
                                Company Signature:
                            </Typography>
                            <Box sx={{ border: "1px solid gray", padding: 1, display: "flex", justifyContent: "center", height: 100 }}>
                                <img src={predefinedSignature} alt="Company Signature" style={{ maxHeight: "100%", maxWidth: "100%" }} />
                            </Box>
                        </Grid2>

                        <Grid2 size={{ md: 6, xs: 12 }}>
                            <Typography fontWeight="bold" textAlign={"center"}>
                                Customer Signature:
                            </Typography>
                            <Box sx={{ border: "1px solid gray", padding: 1, height: 100, backgroundColor: "#fff" }}>
                                <SignatureCanvas ref={userSignatureRef} penColor="black" canvasProps={{ style: { width: "100%", height: "100%" } }} onEnd={handleSignatureEnd} />
                            </Box>
                            {errors.signature && <Typography color="error">{errors.signature.message}</Typography>}
                            <div className="w-full flex justify-center">
                                <Controller
                                    name="fullName"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} label="Your Full Name" variant="standard" margin="normal" error={!!errors.fullName} helperText={errors.fullName?.message} />
                                    )}
                                />
                            </div>
                        </Grid2>
                    </Grid2>

                    <Typography textAlign="center" variant="h6" mt={3}>
                        Contract Signing Date: {formattedDate}
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                        <Button variant="contained" color="error" onClick={clearSignature}>
                            Clear and Re-sign
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit(onSubmit)}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Confirm Signature"}
                        </Button>
                    </Box>
                </CardContent>
            </Container>
        </Box>
    );
};

export default PackageContract;
