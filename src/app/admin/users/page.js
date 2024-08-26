"use client";
import React, { useState } from "react";
import { Row, Button, Typography, Table, message, Input } from "antd";
import { useRouter } from "next/navigation";
import { AiTwotoneDelete, AiOutlineRight } from "react-icons/ai";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiRequest from "@/context/apiRequest";
import moment from "moment";

const Page = () => {
  const router = useRouter();
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(1);
  const [searchText, setSearchText] = useState("");

  const userData = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await apiRequest(
        process.env.NEXT_PUBLIC_URL,
        {
          method: "get",
          url: `usersByAdmin`,
        },
        router
      );
      return response;
    },
  });

  const delUserMutation = useMutation({
    mutationFn: async (e) => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "delete",
        url: `user?user_id=${e}`,
      });

      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        message.success(e.message);
        userData.refetch();
      } else {
        message.error(e.message);
      }
    },
  });

  const handleDelete = async (e) => {
    await delUserMutation.mutate(e);
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "user_name",
      key: 1,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: 2,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: 3,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: 4,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: 5,
    },
    {
      title: "Role",
      dataIndex: "",
      key: 6,
      render: (e) => e.role?.name,
    },
    {
      title: "Status",
      dataIndex: "",
      key: 7,
      render: (e) => (
        <div
          style={{
            color: e.status === "unverified" ? "grey" : "#1677ff",
            backgroundColor: e.status === "unverified" ? "lightgrey" : "#cae2fc",
            textTransform: "capitalize",
            padding: 5,
            borderRadius: 6,
          }}
        >
          {e.status}
        </div>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: 8,
      render: (created_at) => moment(created_at).format("YYYY-MM-DD, h:mma"),
    },
    {
      title: "Action",
      dataIndex: "",
      key: 9,
      render: (e) =>
        e.role.name === "admin" ? null : (
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
                handleDelete(e.user_id);
              }}
              size="large"
            />
            <Button
              htmlType="button"
              style={{ marginLeft: 5 }}
              type="dashed"
              icon={<AiOutlineRight style={{ paddingBottom: 4 }} size={28} />}
              size="large"
              onClick={() => router.push(`/admin/users/user/${e.user_id}`)}
            />
          </div>
        ),
    },
  ];

  const filteredData = userData.data?.data?.filter((user) =>
    user.user_name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBlock: "3rem" }}>
        <Typography.Title style={{ marginBottom: 0 }}>
          Manage Users
        </Typography.Title>

        <Button size="large" type="primary" onClick={() => router.push("/admin/users/add-user")}>
          Add New User
        </Button>
      </Row>
      <Row style={{ marginBottom: "1rem" }}>
        <Input
          placeholder="Search by User Name"
          value={searchText}
          size="large"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </Row>
      <Row>
        <Table
          style={{ width: "100%" }}
          columns={columns}
          dataSource={filteredData}
          size="middle"
          scroll={{ x: true }}
          loading={userData.isLoading}
          onChange={(e) => {
            setPageSize(e.pageSize);
            setOffset(e.current);
          }}
        />
      </Row>
    </div>
  );
};

export default Page;
