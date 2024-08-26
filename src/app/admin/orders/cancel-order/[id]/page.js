"use client";
import apiRequest from "@/context/apiRequest";
import {
  Button,
  Flex,
  Typography,
  Form,
  Input,
  Col,
  Row,
  Radio,
  Divider,
  Select,
  message,
  Image,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AiTwotoneLeftCircle } from "react-icons/ai";
import moment from "moment";
const Page = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const router = useRouter();
  const [userId, setUserId] = useState();
  const [complainRespond, setComplainRespond] = useState("");
  useEffect(() => {
    const fetchUserId = async () => {
      const storage = await localStorage.getItem("@admin");
      setUserId(JSON.parse(storage).user_id);
    };
    fetchUserId();
  }, []);
  const contractData = useQuery({
    queryKey: ["contract"],
    queryFn: async () => {
      const response = await apiRequest(
        process.env.NEXT_PUBLIC_URL,
        {
          method: "get",
          url: `contract?contract_id=${params.id}`,
        },
        router
      );
      return response;
    },
    enabled: params.id ? true : false,
  });
  const contractMutation = useMutation({
    mutationKey: ["cancelContractMsg"],
    mutationFn: async (data) => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "post",
        url: `cancelContractReq`,
        data,
      });
      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        message.success(e.message);
        contractData.refetch();
        setComplainRespond("");
      } else {
        message.error(e.message);
      }
    },
  });
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  const handleInputChange = (e) => {
    setComplainRespond(e.target.value);
  };
  const handleSubmit = async () => {
    if (complainRespond.length > 0) {
      const data = {
        contract_id: parseInt(params.id),
        user_id: parseInt(userId),
        message: complainRespond,
      };
      await contractMutation.mutate(data);
    } else {
      message.open({ type: "warning", content: "Please fill the input field" });
    }
  };

  return (
    <div>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBlock: "1rem" }}
      >
        <Flex align="middle" justify="middle">
          <Button
            htmlType="button"
            style={{ marginRight: 5 }}
            type="dashed"
            size="large"
            icon={
              <AiTwotoneLeftCircle style={{ paddingBottom: 2 }} size={28} />
            }
            onClick={() => router.back()}
          />
          <Col>
            <Typography.Title level={2} style={{ padding: 0, marginBottom: 0 }}>
              Order Cancel Request
            </Typography.Title>
          </Col>
        </Flex>
      </Row>
      <Flex>
        <Col span={24} align="middle">
          <Row justify={"space-between"}>
            <Col
              span={20}
              style={{ border: "2px dashed #d2d2d2", paddingTop: 10 }}
            >
              <Row align={"middle"} style={{ marginLeft: 10 }}>
                <Image
                  src={contractData?.data?.data?.cancel_contract[0]?.user_account?.image}
                  width={40}
                  height={40}
                  style={{ borderRadius: 20 }}
                />
                <Typography.Text strong={500} style={{ marginLeft: 6 }}>
                  {contractData?.data?.data?.cancel_contract[0]?.user_account?.first_name}{" "}
                  {contractData?.data?.data?.cancel_contract[0]?.user_account?.last_name}
                </Typography.Text>
              </Row>
              <div
                style={{
                  margin: "10px 0px",
                  background: "#d9d9d9",
                  height: 2,
                  width: "100%",
                }}
              ></div>

              <div style={{ padding: "0px 10px" }}>
                {contractData?.data?.data?.cancel_contract &&
                contractData?.data?.data?.cancel_contract.length > 0 ? (
                  <div style={{ overflowY: "auto", height: "50vh" }}>
                    {contractData?.data?.data?.cancel_contract.map(
                      (data, index) => (
                        <div
                          key={index}
                          style={
                            data.user_id === userId
                              ? {
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  width: "100%",
                                }
                              : {
                                  display: "flex",
                                  flexDirection:'column',
                                  justifyContent: "flex-start",
                                  width: "100%",
                                }
                          }
                        >
                          <div
                            style={{
                              width: "60%",
                              marginTop: "10px",
                              background: "#fff",
                              padding: "5px 20px",
                              borderRadius: "12px",
                            }}
                          >
                            <p
                              style={{
                                textAlign: "left",
                                fontSize: 12,
                                margin: "5px 0 0 0",
                                fontWeight: "500",
                                color: "blue",
                              }}
                            >
                              {data.user_id === userId
                                ? ""
                                : `${contractData?.data?.data?.cancel_contract[0]?.user_account?.first_name} ${contractData?.data?.data?.cancel_contract[0]?.user_account?.last_name}`}
                            </p>
                            <p
                              style={{
                                margin: 0,
                                marginTop: 3,
                                fontSize: 16,
                                textAlign: "justify",
                              }}
                            >
                              {data.message}
                            </p>
                            <p
                              style={{
                                textAlign: "right",
                                fontSize: 12,
                                margin: "5px 0 0 0",
                                color: "gray",
                              }}
                            >
                              {moment(data.created_at).format(
                                "h:mma, DD-MM-YY"
                              )}
                            </p>
                          </div>
                          {data.image === null ? null : (
                            <div
                              style={{
                                width: "60%",
                                marginTop: "10px",
                                background: "#fff",
                                padding: "5px 20px",
                                borderRadius: "12px",
                              }}
                            >
                              <p
                                style={{
                                  textAlign: "left",
                                  fontSize: 12,
                                  margin: "5px 0 0 0",
                                  fontWeight: "500",
                                  color: "blue",
                                }}
                              >
                                {data.user_id === userId
                                  ? ""
                                  : `${contractData?.data?.data?.cancel_contract[0]?.user_account?.first_name} ${contractData?.data?.data?.cancel_contract[0]?.user_account?.last_name}`}
                              </p>
                              <Image
                                src={data?.image}
                                width={120}
                                height={120}
                                style={{ borderRadius: 12, marginTop: 3 }}
                              />
                              <p
                                style={{
                                  textAlign: "right",
                                  fontSize: 12,
                                  margin: "5px 0 0 0",
                                  color: "gray",
                                }}
                              >
                                {moment(data.created_at).format(
                                  "h:mma, DD-MM-YY"
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div>
                    <Typography.Text>Data not available</Typography.Text>
                  </div>
                )}
              </div>
              <Row
                justify={"space-evenly"}
                align={"middle"}
                style={{ marginTop: 10, marginBottom: 10 }}
              >
                <Input.TextArea
                  placeholder="Send message here..."
                  enterButton="Send"
                  size="large"
                  style={{ width: "85%" }}
                  autoSize={{
                    minRows: 2,
                    maxRows: 2,
                  }}
                  value={complainRespond}
                  onChange={handleInputChange}
                  onPressEnter={handleKeyPress}
                />
                <Button
                  type="primary"
                  style={{ fontSize: 16, fontWeight: "500", height: "40px" }}
                  onClick={handleSubmit}
                  loading={contractMutation.isPending}
                >
                  Send
                </Button>
              </Row>
            </Col>
          </Row>
        </Col>
      </Flex>
    </div>
  );
};

export default Page;
