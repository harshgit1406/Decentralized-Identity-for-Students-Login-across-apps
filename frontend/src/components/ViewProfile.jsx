import { useState } from "react";
import { Card, Button, message, Typography, Descriptions, Tag, Space } from "antd";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const { Title, Text } = Typography;

const MODULE_ADDRESS = "0x0d76dc3715a126a103d3bd6367362196c4d07e89465c82305c024b4afc4f2e2d";

function ViewProfile() {
  const { account } = useWallet();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const config = new AptosConfig({ network: Network.DEVNET });
  const aptos = new Aptos(config);

  const fetchProfile = async () => {
    if (!account) {
      message.error("Please connect your wallet first");
      return;
    }

    setLoading(true);
    try {
      const resource = await aptos.getAccountResource({
        accountAddress: account.address.toString(),
        resourceType: `${MODULE_ADDRESS}::StudentIdentity::StudentProfile`,
      });

      console.log("Profile data:", resource);
      setProfile(resource);
      message.success("Profile loaded successfully!");
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.message && error.message.includes("Resource not found")) {
        message.warning("No profile found. Please create one first.");
      } else {
        message.error("Failed to fetch profile");
      }
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Title level={4}>👤 View Student Profile</Title>
      <Button type="primary" onClick={fetchProfile} loading={loading} block>
        Load My Profile
      </Button>

      {profile && (
        <div style={{ marginTop: "20px" }}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Student ID">
              {profile.student_id}
            </Descriptions.Item>
            <Descriptions.Item label="Name">
              {profile.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {profile.email}
            </Descriptions.Item>
            <Descriptions.Item label="Institution">
              {profile.institution}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={profile.is_active ? "green" : "red"}>
                {profile.is_active ? "Active" : "Inactive"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Verified Apps">
              {profile.verified_apps && profile.verified_apps.length > 0 ? (
                <Space wrap>
                  {profile.verified_apps.map((app, index) => (
                    <Tag color="blue" key={index}>
                      {app}
                    </Tag>
                  ))}
                </Space>
              ) : (
                <Text type="secondary">No apps verified yet</Text>
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Card>
  );
}

export default ViewProfile;