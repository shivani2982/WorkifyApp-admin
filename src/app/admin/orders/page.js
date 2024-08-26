"use client";
import React, { useState } from "react";
import {
  Row,
  Button,
  Typography,
  Table,
  message,
  Flex,
  Space,
  Radio,
} from "antd";
import { useRouter } from "next/navigation";
import { AiTwotoneEdit, AiTwotoneDelete, AiOutlineRight } from "react-icons/ai";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiRequest from "@/context/apiRequest";
import moment from "moment";

const Page = () => {
  const router = useRouter();
  const [position, setPosition] = useState("all");
  const contractData = useQuery({
    queryKey: ["contracts"],
    queryFn: async () => {
      const response = await apiRequest(
        process.env.NEXT_PUBLIC_URL,
        {
          method: "get",
          url: `contracts`,
        },
        router
      );
      return response;
    },
  });
  const cancelContractData = useQuery({
    queryKey: ["cancelContract"],
    queryFn: async () => {
      const response = await apiRequest(
        process.env.NEXT_PUBLIC_URL,
        {
          method: "get",
          url: `cancelContracts`,
        },
        router
      );
      return response;
    },
  });
  const cancelStatusMutation = useMutation({
    mutationFn: async (e) => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "put",
        url: `updateCancelContractStatus`,
        data: e,
      });

      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        message.success(e.message);
        cancelContractData.refetch();
      } else {
        message.error(e.message);
      }
    },
  });
  const handleCancelStatus = async (e) => {
    await cancelStatusMutation.mutate(e);
  };
  const allColumns = [
    {
      title: "Job Post User",
      dataIndex: "",
      key: 1,
      render: (e) => (
        <>
          {e.proposal?.job?.freelancer == null
            ? `${e.proposal?.job?.client?.user_account?.first_name} ${e.proposal?.job?.client?.user_account?.last_name}`
            : `${e.proposal?.job?.freelancer?.user_account?.first_name} ${e.proposal?.job?.freelancer?.user_account?.last_name}`}
        </>
      ),
    },
    {
      title: "Job Work User",
      dataIndex: "",
      key: 2,
      render: (e) =>
        `${e.proposal?.user_account?.first_name} ${e.proposal?.user_account?.last_name}`,
    },
    {
      title: "Proposal Description",
      dataIndex: "",
      key: 3,
      render: (e) => e.proposal?.description,
    },
    {
      title: "Revision",
      dataIndex: "",
      key: 4,
      render: (e) => e.proposal?.revisions,
    },
    {
      title: "Work Duration",
      dataIndex: "",
      key: 5,
      render: (e) => e.proposal?.duration,
    },
    {
      title: "Amount",
      dataIndex: "",
      key: 5,
      render: (e) => `$${e.proposal?.payment?.payment_amount}`,
    },
    {
      title: "Status",
      dataIndex: "",
      key: 6,
      render: (e) => (
        <div>
          <Button
            htmlType="button"
            style={{
              // marginLeft: 5,
              color:
                e.contract_status === "complete"
                  ? "green"
                  : e.contract_status === "working"
                  ? "#707003"
                  : "red",
              backgroundColor:
                e.contract_status === "complete"
                  ? "lightgreen"
                  : e.contract_status === "working"
                  ? "#fcfcbb"
                  : "#ffcccb",
              textTransform: "capitalize",
            }}
            type="dashed"
            size="large"
            // onClick={() =>
            //   handleLive({
            //     id: e.dispute_id,
            //     status: e.status === "active" ? "closed" : "active",
            //   })
            // }
          >
            {e.contract_status}
          </Button>
        </div>
      ),
    },

    {
      title: "Created At",
      dataIndex: "updated_at",
      key: 7,
      render: (updated_at) => moment(updated_at).format("YYYY-MM-DD, h:mma"),
    },
    {
      title: "Action",
      dataIndex: "",
      key: 8,
      render: (e) => (
        <div>
          {/* <Button
            htmlType="button"
            style={{ marginLeft: 5 }}
            type="dashed"
            icon={
              <AiTwotoneDelete
                color="red"
                style={{ paddingBottom: 4 }}
                size={28}
              />
            }
            // onClick={() => {
            //   handleDelete(e.dispute_id);
            // }}
            size="large"
          /> */}
          <Button
            htmlType="button"
            style={{ marginLeft: 5 }}
            type="dashed"
            icon={<AiOutlineRight style={{ paddingBottom: 4 }} size={28} />}
            size="large"
            // onClick={() =>
            //   router.push(`/admin/disputes/dispute/${e.dispute_id}`)
            // }
          />
        </div>
      ),
    },
  ];
  const cancelColumns = [
    {
      title: "Job Post User",
      dataIndex: "",
      key: 1,
      render: (e) => (
        <>
          {e.proposal?.job?.freelancer == null
            ? `${e.proposal?.job?.client?.user_account?.first_name} ${e.proposal?.job?.client?.user_account?.last_name}`
            : `${e.proposal?.job?.freelancer?.user_account?.first_name} ${e.proposal?.job?.freelancer?.user_account?.last_name}`}
        </>
      ),
    },
    {
      title: "Job Work User",
      dataIndex: "",
      key: 2,
      render: (e) =>
        `${e.proposal?.user_account?.first_name} ${e.proposal?.user_account?.last_name}`,
    },
    {
      title: "Cancel Reason",
      dataIndex: "",
      key: 3,
      render: (e) => e.cancel_contract[0]?.message,
    },

    {
      title: "Work Duration",
      dataIndex: "",
      key: 4,
      render: (e) => e.proposal?.duration,
    },

    {
      title: "Status",
      dataIndex: "",
      key: 5,
      render: (e) => (
        <div>
          <Button
            htmlType="button"
            style={{
              color: e.contract_status === "cancel request" ? "#707003" : "red",
              backgroundColor:
                e.contract_status === "cancel request" ? "#fcfcbb" : "#ffcccb",
              textTransform: "capitalize",
            }}
            type="dashed"
            size="large"
            onClick={() => {
              e.contract_status === "cancel request"
                ? handleCancelStatus({
                    id: e.contract_id,
                    status:
                      e.contract_status === "cancel request"
                        ? "order cancel"
                        : "cancel request",
                  })
                : null;
            }}
          >
            {e.contract_status}
          </Button>
        </div>
      ),
    },

    {
      title: "Created At",
      dataIndex: "updated_at",
      key: 7,
      render: (updated_at) => moment(updated_at).format("YYYY-MM-DD, h:mma"),
    },
    {
      title: "Action",
      dataIndex: "",
      key: 8,
      render: (e) => (
        <div>
          <Button
            htmlType="button"
            style={{ marginLeft: 5 }}
            type="dashed"
            icon={<AiOutlineRight style={{ paddingBottom: 4 }} size={28} />}
            size="large"
            onClick={() =>
              router.push(`/admin/orders/cancel-order/${e.contract_id}`)
            }
          />
        </div>
      ),
    },
  ];
  return (
    <div>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBlock: "2rem" }}
      >
        <Typography.Title style={{ marginBottom: 0, color: "#212135" }}>
          Manage Orders
        </Typography.Title>
      </Row>
      <Space>
        <Radio.Group
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          style={{ marginBottom: 10 }}
        >
          <Radio.Button
            style={{
              color: position === "all" ? "#fff" : "inherit",
              backgroundColor: position === "all" ? "#212135" : "inherit",
            }}
            value="all"
          >
            All Orders
          </Radio.Button>
          <Radio.Button
            style={{
              color: position === "cancel" ? "#fff" : "inherit",
              backgroundColor: position === "cancel" ? "#212135" : "inherit",
            }}
            value="cancel"
          >
            Cancel Request
          </Radio.Button>
          <Radio.Button
            style={{
              color: position === "notDelivered" ? "#fff" : "inherit",
              backgroundColor:
                position === "notDelivered" ? "#212135" : "inherit",
            }}
            value="notDelivered"
          >
            Not Delivered
          </Radio.Button>
        </Radio.Group>
      </Space>
      <Row>
        {position === "all" ? (
          <Table
            style={{ width: "100%" }}
            columns={allColumns}
            dataSource={contractData?.data?.data}
            size="middle"
            scroll={{ x: true }}
            loading={contractData.isLoading}
            onChange={(e) => {
              setPageSize(e.pageSize), setOffset(e.current);
            }}
          />
        ) : (
          <Table
            style={{ width: "100%" }}
            columns={cancelColumns}
            dataSource={cancelContractData?.data?.data}
            size="middle"
            scroll={{ x: true }}
            loading={cancelContractData.isLoading}
            onChange={(e) => {
              setPageSize(e.pageSize), setOffset(e.current);
            }}
          />
        )}
      </Row>
    </div>
  );
};

export default Page;
