import {
    Box,
    Button,
    VStack,
    Heading,
    Input,
    Spinner,
    Text,
    Flex,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";
import {fetchShopStats, uploadExcelFile} from "../data/external/api";
import {AddCashierForm} from "./AddCashierForm.jsx";

// get "count" random hex numbers
const generateHexColors = (count) =>
    Array.from({ length: count }, () =>
        `#${Math.ceil(Math.random() * 0xffffff).toString(16).padStart(6, "0")}`
    );

export default function MainPage({ token }) {
    // for file input field reference
    const inputRef = useRef(null);

    const [genderData, setGenderData] = useState([]); // statistics to be received from api
    const [nationalityData, setNationalityData] = useState([]); // statistics to be received from api
    const [loading, setLoading] = useState(true); // make data loading appealing
    const [error, setError] = useState(""); // allow to demonstrate statistics loading status
    // make charts colorful
    const [genderColors, setGenderColors] = useState([]);
    const [nationalityColors, setNationalityColors] = useState([]); //

    // load initial data and prepare data for demonstration in charts, depends on token
    useEffect(() => {
        fetchShopStats(token).then(({ status, data }) => {
            if (status === 400) {
                setError("Not enough users to generate analytics.");
            } else if (status !== 200 || !data) {
                setError("Failed to load statistics.");
            } else {
                const gender = data.gender_groupby.map(([label, count]) => ({ label, count }));
                const nationality = data.nationality_groupby.map(([label, count]) => ({ label, count }));
                setGenderData(gender);
                setNationalityData(nationality);
                setGenderColors(generateHexColors(gender.length));
                setNationalityColors(generateHexColors(nationality.length));
            }
            setLoading(false);
        });
    }, [token]);

    // upload file and notify the user if the operation was successful
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const { status, data } = await uploadExcelFile(file, token);
        console.log(status, data);

        if (status === 200) {
            alert("File submitted successfully");
        } else {
            alert("Error submitting file: " + (data?.detail || "Unknown error"));
        }
    };

    // either load, or show error, or show layout
    // layout consists of statistical pie charts, catalog upload (by excel) and add cashier component
    return (
        <VStack spacing={8} p={6}>
            <Heading size="xl" textAlign="center">
                Customer Statistics
            </Heading>

            {loading ? (
                <Spinner />
            ) : error ? (
                <Text color="red.500">{error}</Text>
            ) : (
                <Flex
                    w="100%"
                    justify="center"
                    align="flex-start"
                    flexWrap="wrap"
                    p={5}
                    m={12}
                >
                    <Box w="100%" maxW="500px" h="400px">
                        <Heading size="sm" textAlign="center" mb={5}>
                            Nationality Distribution
                        </Heading>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={nationalityData}
                                    dataKey="count"
                                    nameKey="label"
                                >
                                    {nationalityData.map((_, idx) => (
                                        <Cell key={idx} fill={nationalityColors[idx]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>

                    <Box w="100%" maxW="500px" h="400px">
                        <Heading size="sm" textAlign="center" mb={5}>
                            Gender Distribution
                        </Heading>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    dataKey="count"
                                    nameKey="label"
                                >
                                    {genderData.map((_, idx) => (
                                        <Cell key={idx} fill={genderColors[idx]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Flex>
            )}

            <Box textAlign="center">
                <Input
                    type="file"
                    accept=".xlsx,.xls"
                    hidden
                    ref={inputRef}
                    onChange={handleFileChange}
                />
                <Button colorScheme="blue" onClick={() => inputRef.current?.click()}>
                    Add Excel File Catalog
                </Button>

                <Box mt={8}>
                    <AddCashierForm token={token} />
                </Box>
            </Box>
        </VStack>
    );
}
