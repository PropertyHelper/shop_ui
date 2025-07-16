import React, { useState } from "react";
import {
    Box,
    Button,
    Input,
    VStack,
    Text,
    Field,
} from "@chakra-ui/react";
import {sendLogInRequest} from "../data/external/api.js";

// Page to get into account
// uses api
export default function LoginPage({ setToken }) {
    const [shopNickname, setShopNickname] = useState(""); // field 1
    const [password, setPassword] = useState(""); // field 2
    const [error, setError] = useState("");

    // use api to get token or display an error
    const handleLogin = async () => {
        setError("");

        const payload = {
            nickname: shopNickname,
            password
        };
        const { status, data } = await sendLogInRequest(payload);

        if (status === 200) {
            console.log("Login successful");
            console.log(data)
            setToken(data.token);
        } else {
            console.log(data.detail.toString());
            setError(data?.detail || "Login failed");
        }
    };
    // simple form with 2 input fields layed out in a vertical way
    // also has an error indication
    return (
        <Box maxW="sm" mx="auto" mt="20">
            <VStack spacing={4}>
                <Field.Root>
                    <Field.Label>Shop Nickname</Field.Label>
                    <Input
                        value={shopNickname}
                        onChange={(e) => setShopNickname(e.target.value)}
                    />
                </Field.Root>
                <Field.Root>
                    <Field.Label>Password</Field.Label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Field.Root>

                <Button colorPalette="blue" onClick={handleLogin}>
                    Login
                </Button>

                {error && <Text color="red.500">{error}</Text>}
            </VStack>
        </Box>
    );
}
