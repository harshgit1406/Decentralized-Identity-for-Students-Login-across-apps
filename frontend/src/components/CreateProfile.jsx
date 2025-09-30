import { useState } from "react";
import { Card, Form, Input, Button, message, Typography } from "antd";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const { Title } = Typography;

const MODULE_ADDRESS = "0x0d76dc3715a126a103d3bd6367362196c4d07e89465c82305c024b4afc4f2e2d";

function CreateProfile() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [loading, setLoading] = useState(false);

  const config = new AptosConfig({ network: Network.DEVNET });
  const aptos = new Aptos(config);

  const onFinish = async (values) => {
    if (!account) {
      message.error("Please connect your wallet first");
      return;
    }

    setLoading(true);
    try {
      const transaction = {
        data: {
          function: `${MODULE_ADDRESS}::StudentIdentity::create_student_profile`,
          typeArguments: [],
          functionArguments: [
            values.studentId,
            values.name,
            values.email,
            values.institution,
          ],
        },
      };

      const response = await signAndSubmitTransaction(transaction);
      await aptos.waitForTransaction({ transactionHash: response.hash });
      
      message.success("Profile created successfully!");
      console.log("Transaction hash:", response.hash);
    } catch (error) {
      console.error("Error creating profile:", error);
      message.error(error.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Title level={4}>📝 Create Student Profile</Title>
      <Form
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Student ID"
          name="studentId"
          rules={[{ required: true, message: "Please input your student ID!" }]}
        >
          <Input placeholder="e.g., STU123456" />
        </Form.Item>

        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input placeholder="e.g., John Doe" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="e.g., john@university.edu" />
        </Form.Item>

        <Form.Item
          label="Institution"
          name="institution"
          rules={[{ required: true, message: "Please input your institution!" }]}
        >
          <Input placeholder="e.g., Stanford University" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Create Profile
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default CreateProfile;