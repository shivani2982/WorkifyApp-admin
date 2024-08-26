"use client";
import React, { useState } from "react";
import { Row, Button, Typography, Table, message, Flex } from "antd";
import { useRouter } from "next/navigation";
import { AiTwotoneEdit, AiTwotoneDelete, AiOutlineRight } from "react-icons/ai";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiRequest from "@/context/apiRequest";
import moment from "moment";

const Page = () => {
  const router = useRouter();
  const disputeData = useQuery({
    queryKey: ["dsputes"],
    queryFn: async () => {
      const response = await apiRequest(
        process.env.NEXT_PUBLIC_URL,
        {
          method: "get",
          url: `disputes`,
        },
        router
      );
      return response;
    },
  });
  const delDisputeMutation = useMutation({
    mutationFn: async (e) => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "delete",
        url: `dispute?dispute_id=${e}`,
      });

      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        disputeData.refetch();
        message.success(e.message);
      } else {
        message.error(e.message);
      }
    },
  });
  const statusMutation = useMutation({
    mutationFn: async (e) => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "put",
        url: `disputeStatus`,
        data: e,
      });

      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        message.success(e.message);
        formData.refetch();
      } else {
        message.error(e.message);
      }
    },
  });
  const handleStatus = async (e) => {
    await statusMutation.mutate(e);
  };
  const handleDelete = async (e) => {
    await delDisputeMutation.mutate(e);
  };
  const columns = [
    {
      title: "User Name",
      dataIndex: "",
      key: 1,
      render: (e) => e.user_account?.user_name,
    },
    {
      title: "Complain Title",
      dataIndex: "complain_title",
      key: 2,
    },
    {
      title: "Complain Message",
      dataIndex: "complain_msg",
      key: 3,
    },
    {
      title: "Status",
      dataIndex: "",
      key: 4,
      render: (e) => (
        <div>
          <Button
            htmlType="button"
            style={{
              marginLeft: 5,
              color: e.status === 'active' ? "green" : "red",
              backgroundColor: e.status === 'active' ? "lightgreen" : "#ffcccb",
            }}
            type="dashed"
            size="large"
            onClick={() => handleStatus({ id: e.dispute_id, status: e.status === 'active' ? "closed" : "active" })}
          >
            {e.status === 'active' ? "Active" : "Closed"}
          </Button>
        </div>
      ),
    },

    {
      title: "Created At",
      dataIndex: "updated_at",
      key: 5,
      render: (updated_at) => moment(updated_at).format("YYYY-MM-DD, h:mma"),
    },
    {
      title: "Action",
      dataIndex: "",
      key: 6,
      render: (e) => (
        <div>
          <Button
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
            onClick={() => {
              handleDelete(e.dispute_id);
            }}
            size="large"
          />
          <Button
            htmlType="button"
            style={{ marginLeft: 5 }}
            type="dashed"
            icon={<AiOutlineRight style={{ paddingBottom: 4 }} size={28} />}
            size="large"
            onClick={() =>
              router.push(`/admin/disputes/dispute/${e.dispute_id}`)
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
        style={{ marginBlock: "3rem" }}
      >
        <Typography.Title style={{ marginBottom: 0 }}>
          Manage Dispute Center
        </Typography.Title>
      </Row>
      <Row>
        <Table
          style={{ width: "100%" }}
          columns={columns}
          dataSource={disputeData?.data?.data}
          size="middle"
          scroll={{ x: true }}
          loading={disputeData.isLoading}
          onChange={(e) => {
            setPageSize(e.pageSize), setOffset(e.current);
          }}
        />
      </Row>
    </div>
  );
};

export default Page;
