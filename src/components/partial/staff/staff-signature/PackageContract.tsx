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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    fullName: z.string().min(1, "Vui lòng nhập họ tên."),
    signature: z.string().min(1, "Vui lòng ký trước khi xác nhận."),
});

const PackageContract = () => {
    const userSignatureRef = useRef<SignatureCanvas>(null);
    const [, setUserSignature] = useState<string | null>(null);

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
        "https://i.postimg.cc/5tgDPXqX/signature.png";

    // Xóa chữ ký khách hàng
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
            setValue("signature", signatureData); // Cập nhật vào form
            clearErrors("signature"); // Xóa lỗi nếu có
        }
    };

    const onSubmit = (data: { fullName: string; signature: string }) => {
        console.log("Hợp đồng được ký bởi:", data.fullName);
        console.log("Chữ ký đã lưu:", data.signature);
    };

    const formattedDate = new Date().toLocaleDateString("en-EN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "linear-gradient(180deg, #f5f5f5 0%, #e0e7ff 100%)",
            }}
        >
            <Container maxWidth="md" sx={{ boxShadow: 3, background: "white", pt: 2 }}>
                <CardContent>
                    <Typography variant="h6" textAlign="center" fontWeight="bold" mb={1}>
                        ECAMS
                    </Typography>
                    <Typography variant="h5" textAlign="center" fontWeight="bold">
                        Service Package Contract
                    </Typography>
                    <List>
                        <Grid2 container spacing={2} mt={1} >
                            <ListItem>
                                <Grid2 size={{ md: 6, xs: 12 }}>
                                    <Typography display={"inline-block"} variant="body1" mr={2}>Name:</Typography>
                                    <Typography display={"inline-block"} variant="body1" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                                        Thanh Van
                                    </Typography>
                                </Grid2>
                                <Grid2 size={{ md: 6, xs: 12 }} display={"flex"} justifyContent={"end"}>
                                    <Typography display={"inline-block"} variant="body1" mr={2}>Phone:</Typography>
                                    <Typography display={"inline-block"} variant="body1" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                                        0922983212
                                    </Typography>
                                </Grid2>
                            </ListItem>
                        </Grid2>
                        <Grid2 container spacing={2} mt={1} >
                            <ListItem>
                                <Grid2 size={{ md: 6, xs: 12 }}>
                                    <Typography display={"inline-block"} variant="body1" mr={2}>Email:</Typography>
                                    <Typography display={"inline-block"} variant="body1" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                                        contract@gmail.com
                                    </Typography>
                                </Grid2>
                                <Grid2 size={{ md: 6, xs: 12 }} display={"flex"} justifyContent={"end"}>
                                    <Typography display={"inline-block"} variant="body1" mr={2}>Date of birth:</Typography>
                                    <Typography display={"inline-block"} variant="body1" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                                        22/07/2003
                                    </Typography>
                                </Grid2>
                            </ListItem>
                        </Grid2>
                        <Grid2 container spacing={2} mt={1} >
                            <ListItem>
                                <Grid2 size={{ md: 6, xs: 12 }}>
                                    <Typography display={"inline-block"} variant="body1" mr={2}>Address:</Typography>
                                    <Typography display={"inline-block"} variant="body1" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                                        TP Thu Duc, TP HCM
                                    </Typography>
                                </Grid2>
                                <Grid2 size={{ md: 6, xs: 12 }} display={"flex"} justifyContent={"end"}>
                                    <Typography display={"inline-block"} variant="body1" mr={2}>Duration:</Typography>
                                    <Typography display={"inline-block"} variant="body1" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                                        1 month
                                    </Typography>
                                </Grid2>
                            </ListItem>
                        </Grid2>
                        <Grid2 container spacing={2} mt={1} >
                            <ListItem>
                                <Grid2 size={{ md: 6, xs: 12 }}>
                                    <Typography display={"inline-block"} variant="body1" mr={2}>Package:</Typography>
                                    <Typography display={"inline-block"} variant="body1" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                                        Premium Package
                                    </Typography>
                                </Grid2>
                                <Grid2 size={{ md: 6, xs: 12 }} display={"flex"} justifyContent={"end"}>
                                    <Typography display={"inline-block"} variant="body1" mr={2}>Price:</Typography>
                                    <Typography display={"inline-block"} variant="body1" sx={{ color: "text.secondary", fontWeight: "bold" }}>
                                        150.00$
                                    </Typography>
                                </Grid2>
                            </ListItem>
                        </Grid2>
                    </List>

                    <div className="w-full border-t border-gray-300 opacity-50"></div>

                    <List>
                        <ListItem><b>Feature:</b></ListItem>
                        <ListItem>✅ Multi-step Zap</ListItem>
                        <ListItem>✅ Unlimited Premium</ListItem>
                        <ListItem>✅ Unlimited Users Team</ListItem>
                        <ListItem>✅ Advanced Admin</ListItem>
                        <ListItem>✅ Custom Data Retention</ListItem>
                    </List>

                    <div className="w-full border-t border-gray-300 opacity-50"></div>

                    <Grid2 container spacing={2} mt={1} >
                        <Grid2 size={{ md: 6, xs: 12 }}>
                            <Typography fontWeight="bold" textAlign={"center"}>
                                Chữ ký của công ty:
                            </Typography>
                            <Box
                                sx={{
                                    border: "1px solid gray",
                                    padding: 1,
                                    display: "flex",
                                    justifyContent: "center",
                                    height: 100,
                                }}
                            >
                                <img
                                    src={predefinedSignature}
                                    alt="Company Signature"
                                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                                />
                            </Box>
                        </Grid2>
                        <Grid2 size={{ md: 6, xs: 12 }} alignContent={"end"}>
                            <Typography fontWeight="bold" textAlign={"center"}>
                                Chữ ký của khách hàng:
                            </Typography>
                            <Box
                                sx={{
                                    border: "1px solid gray",
                                    padding: 1,
                                    height: 100,
                                    backgroundColor: "#fff",
                                }}
                            >
                                <SignatureCanvas
                                    ref={userSignatureRef}
                                    penColor="black"
                                    canvasProps={{
                                        style: {
                                            width: '100%',
                                            height: '100%'
                                        },
                                        className: "sigCanvas",
                                    }}
                                    onEnd={handleSignatureEnd} // Lắng nghe sự kiện vẽ xong
                                />
                            </Box>
                            {errors.signature && (
                                <Typography color="error">{errors.signature.message}</Typography>
                            )}
                            <div className="flex justify-center align-middle">
                                <Controller
                                    name="fullName"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Your Full Name"
                                            variant="standard"
                                            margin="normal"
                                            error={!!errors.fullName}
                                            helperText={errors.fullName?.message}
                                        />
                                    )}
                                />
                            </div>
                        </Grid2>
                    </Grid2>

                    <Typography textAlign="center" variant="h6" mt={3}>
                        Date: {formattedDate}
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                        <Button variant="contained" color="error" onClick={clearSignature}>
                            Xóa Và Ký Lại
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
                            Xác Nhận Chữ Ký
                        </Button>
                    </Box>
                </CardContent>
            </Container>
        </Box>
    );
};

export default PackageContract;
