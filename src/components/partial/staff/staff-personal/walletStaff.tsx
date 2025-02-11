import { Avatar, Button, Card, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import ConfirmDialog from "./confirmDialog";
import { useEffect, useState } from "react";
import { PackageList3 } from "@/api/agent/PackageAgent";
import { Package } from "@/models/Package";
import { formatPrice } from "@/lib/FormatPrice";

const WalletStaff = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    // Giả lập dữ liệu
    const user = {
        name: "Việt Hùng",
        avatar: "https://via.placeholder.com/50",
        currentPackage: {
            name: "Thẻ tháng",
            expiry: "Còn 20 ngày",
        },
        history: [
            { id: 1, name: "Thẻ tuần", date: "10/02/2024" },
            { id: 2, name: "Thẻ tháng", date: "01/02/2024" },
        ],
        suggestedPackages: [
            { id: 1, name: "Thẻ quý", price: "USD 29.99", diamonds: 3499 },
            { id: 2, name: "Thẻ năm", price: "USD 99.99", diamonds: 6999 },
            { id: 2, name: "Thẻ năm", price: "USD 99.99", diamonds: 6999 },
            { id: 2, name: "Thẻ năm", price: "USD 99.99", diamonds: 6999 },
            { id: 2, name: "Thẻ năm", price: "USD 99.99", diamonds: 6999 },
            { id: 2, name: "Thẻ năm", price: "USD 99.99", diamonds: 6999 },
            { id: 2, name: "Thẻ năm", price: "USD 99.99", diamonds: 6999 },

        ],
    };

    useEffect(() => {
        const loadPackage = async () => {
            try {
                const packageData = await PackageList3(100, 1);
                const packageList = packageData.data?.data || [];
                setPackages(packageList);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        };
        loadPackage();
    }, []);

    return (
        <Container className="p-6 rounded-lg shadow-lg">
            {/* Header */}
            <Typography variant="h5" className="font-bold text-center mb-4 text-blue-600">
                👤 My Account
            </Typography>

            {/* Thông tin user */}
            <Card className="p-4 flex items-center space-x-4 shadow-lg mt-3">
                <Avatar src={user.avatar} alt="User Avatar" sx={{ width: 60, height: 60 }} />
                <div>
                    <Typography className="font-bold text-lg">{user.name}</Typography>
                    <Typography color="textSecondary">{user.currentPackage.name} - {user.currentPackage.expiry}</Typography>
                    <Button onClick={() => setOpen(true)} variant="text" sx={{ p: 0 }}>Extend package</Button>
                </div>
            </Card>

            {/* Lịch sử đăng ký */}
            <Card className="p-4 mt-6 shadow-lg">
                <Typography className="font-bold mb-3 text-blue-500" mb={2}>📜 Registration History</Typography>
                {user.history.map((pkg) => (
                    <motion.div
                        key={pkg.id}
                        className="flex justify-between py-2 border-b hover:bg-blue-50 p-2 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                    >
                        <Typography>{pkg.name}</Typography>
                        <Typography color="textSecondary">{pkg.date}</Typography>
                    </motion.div>
                ))}
            </Card>

            {/* Gói đề xuất */}
            <Card className="p-4 mt-6 shadow-xl">
                <Typography className="font-bold mb-3 text-blue-500" mb={2}>📦 Recommend Package</Typography>

                {/* Khung scrollable */}
                <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto overflow-x-hidden pr-2">
                    {packages && packages.map((pkg, index) => (
                        <motion.div
                            key={index + 1}
                            className="p-4 border rounded-lg shadow-lg bg-white hover:bg-blue-100 transition-all"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Typography className="font-bold text-lg" mb={1}>Package Name: {pkg.packageName}</Typography>
                            <Typography color="primary" mb={1}>Duration: {pkg.duration} months</Typography>
                            <Typography className="mt-1 text-sm text-gray-500">Total 💰: {formatPrice(pkg.price)} </Typography>
                            <div className="w-full flex justify-center align-middle">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        mt: 2,
                                        justifyContent: "center",
                                        textTransform: "none",
                                        background: 'linear-gradient(to right, #136CB5, #49BBBD)',
                                        width: "40%"
                                    }}
                                >
                                    Buy now
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>

            <ConfirmDialog open={open} setOpen={setOpen} />
        </Container>
    );
};

export default WalletStaff;
