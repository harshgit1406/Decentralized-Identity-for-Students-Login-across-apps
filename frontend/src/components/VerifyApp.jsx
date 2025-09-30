import { useState } from "react";
import { Card, Form, Input, Button, message, Typography } from "antd";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const { Title } = Typography;

const MODULE_ADDRESS = "0x0d76dc3715a126a103d3bd6367362196c4d07e89465c82305c024b4afc4f2e2d";

function VerifyApp() {
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
          function: `${MODULE_ADDRESS}::StudentIdentity::verify_for_app`,
          typeArguments: [],
          functionArguments: [values.appName],
        },
      };

      const response = await signAndSubmitTransaction(transaction);
      await aptos.waitForTransaction({ transactionHash: response.hash });
      
      message.success(`Successfully verified for ${values.appName}!`);
      console.log("Transaction hash:", response.hash);
    } catch (error) {
      console.error("Error verifying app:", error);
      message.error(error.message || "Failed to verify for app");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Title level={4}>✅ Verify for Educational App</Title>
      <Form
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Application Name"
          name="appName"
          rules={[{ required: true, message: "Please input the app name!" }]}
        >
          <Input placeholder="e.g., Canvas LMS, Google Classroom, Khan Academy" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Verify Identity
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default VerifyApp;