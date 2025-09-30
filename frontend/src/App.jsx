import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Layout, Typography, Space, Card } from "antd";
import CreateProfile from "./components/CreateProfile";
import VerifyApp from "./components/VerifyApp";
import ViewProfile from "./components/ViewProfile";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import "./App.css";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

function App() {
  const { connected, account } = useWallet();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        background: "#1890ff"
      }}>
        <Title level={3} style={{ color: "white", margin: 0 }}>
          🎓 Student Identity DApp
        </Title>
        <WalletSelector />
      </Header>

      <Content style={{ padding: "50px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {!connected ? (
            <Card>
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Title level={2}>Welcome to Student Identity System</Title>
                <Text>
                  Connect your Petra wallet to create your decentralized student identity
                  and access educational applications across the ecosystem.
                </Text>
                <Text type="secondary">
                  📌 Make sure you're on Aptos Devnet
                </Text>
              </Space>
            </Card>
          ) : (
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Card>
                <Text strong>Connected Address: </Text>
                <Text code>{account?.address?.toString()}</Text>
              </Card>
              
              <CreateProfile />
              <VerifyApp />
              <ViewProfile />
            </Space>
          )}
        </div>
      </Content>
    </Layout>
  );
}

export default App;