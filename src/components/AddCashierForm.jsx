import {
    Box,
    Input,
    Button,
    VStack,
    Heading, Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { addCashier } from "../data/external/api";

// component that encapsulates adding a cashier
export function AddCashierForm({ token }) {
    // similarly to login, but also add success field to show that creation was successful
    const [accountName, setAccountName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // send data via api and process response
    const handleSubmit = async () => {
        setSuccess("");
        setError("");
        const payload = { account_name: accountName, password };

        const result = await addCashier(token, payload);

        if (result.status === 200) {
            setSuccess("Cashier created")
            setAccountName("");
            setPassword("");
        } else {
            setError(result.data.detail.toString());
        }
    };

    return (
        <Box w="100%" maxW="400px" p={4} borderWidth={1} borderRadius="lg" boxShadow="md">
            <Heading size="sm" mb={4}>
                Add Cashier
            </Heading>
            <VStack spacing={3}>
                <Input
                    placeholder="Account Name"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={handleSubmit}>
                    Create
                </Button>
                {error && <Text color="red.500">{error}</Text>}
                {success && <Text color="green.500">{success}</Text>}
            </VStack>
        </Box>
    );
}
