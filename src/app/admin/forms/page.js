"use client";
import React, { useState } from "react";
import { Row, Button, Typography, Table, message } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { AiTwotoneEdit, AiTwotoneDelete, AiTwotoneCopy } from "react-icons/ai";
import apiRequest from "@/context/apiRequest";
import { useMutation, useQuery } from "@tanstack/react-query";
const Page = () => {
  const router = useRouter();
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(1);
  const formData = useQuery({
    queryKey: ["forms"],
    queryFn: async () => {
      const response = await apiRequest(
        process.env.NEXT_PUBLIC_URL,
        {
          method: "get",
          url: `forms`,
        },
        router
      );

      return response;
    },
  });
  console.log("first", formData);

  const delFormMutation = useMutation({
    mutationFn: async (e) => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "delete",
        url: `form?id=${e}`,
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
  const liveMutation = useMutation({
    mutationFn: async (e) => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "put",
        url: `live`,
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
  const handleLive = async (e) => {
    await liveMutation.mutate(e);
  };
  const handleDelete = async (e) => {
    await delFormMutation.mutate(e);
  };
  const columns = [
    {
      title: "User Name",
      dataIndex: "",
      key: 1,
      render: (e) => 
        e.user?.user_name,
    },
    {
      title: "title",
      dataIndex: "title",
      key: 2,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: 3,
    },
    {
      title: "Responses",
      dataIndex: "",
      key: 4,
      render: (e) => (
        <div>
          <Button
            htmlType="button"
            style={{ marginLeft: 5 }}
            type="dashed"
            size="large"
            onClick={() => router.push(`/admin/forms/responses/${e.id}`)}
          >
            View Responses
          </Button>
        </div>
      ),
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
              marginLeft: 5,
              color: e.live === true ? "green" : "red",
              backgroundColor: e.live === true ? "lightgreen" : "#ffcccb",
            }}
            type="dashed"
            size="large"
            onClick={() => handleLive({ id: e.id, live: !e.live })}
          >
            {e.live === true ? "Live" : "Not Live"}
          </Button>
        </div>
      ),
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
            icon={<AiTwotoneCopy style={{ paddingBottom: 4 }} size={28} />}
            size="large"
            onClick={(d) => {
              d.stopPropagation();
              if (typeof window !== "undefined") {
                const hostname = window.location.host;
                navigator.clipboard.writeText(
                  `${hostname}/public/ev-form/${e.url}?title=${e.title}`
                );
              }
            }}
          />

          {/* <Button
            htmlType="button"
            style={{ marginLeft: 5 }}
            type="dashed"
            icon={<AiTwotoneEdit style={{ paddingBottom: 4 }} size={28} />}
            size="large"
          /> */}

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
              handleDelete(e.id);
            }}
            size="large"
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
          Manage Forms
        </Typography.Title>

        {/* <Button
          size="large"
          type="primary"
          onClick={() => router.push("/admin/forms/add-form")}
        >
          Add New Form
        </Button> */}
      </Row>
      <Row>
        <Table
          style={{ width: "100%" }}
          columns={columns}
          dataSource={formData?.data?.data}
          loading={formData.isLoading}
          size="middle"
          scroll={{ x: true }}
          pagination={{
            current: offset,
            pageSize: pageSize,
            position: ["bottomRight"],
            total: 1,
            showSizeChanger: false,
          }}
          onChange={(e) => {
            setPageSize(e.pageSize), setOffset(e.current);
          }}
        />
      </Row>
    </div>
  );
};

export default Page;
