"use client";
import React, { useState } from "react";
import { Row, Button, Typography, Table, message, Flex, Form } from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";
import data from "@/data/response";
import { AiTwotoneLeftCircle } from "react-icons/ai";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiRequest from "@/context/apiRequest";
import FmCardResponse from "@/components/FmCardResponse";
const Page = () => {
  const router = useRouter();
  const params = useParams();
  const responsesFormData = useQuery({
    queryKey: ["responseForm", params.id],
    queryFn: async () => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "get",
        url: `response?id=${params.id}`,
      });
      return response;
    },
    enabled: params.id ? true : false,
  });
  console.log("first", responsesFormData?.data?.data?.user_id);
  const userStatusMutation = useMutation({
    mutationFn: async (e) => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "put",
        url: `updateUserStatus`,
        data: e,
      });

      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        message.success(e.message);
        responsesFormData.refetch();
      } else {
        message.error(e.message);
      }
    },
  });
  const handleStatus = async (e) => {
    await userStatusMutation.mutate(e);
  };
  // const columns = [
  //     responsesFormData?.data?.data?.responses.map((response) => ({
  //     title: response?.question.question,
  //     dataIndex: `response_${response?.question.question}`,
  //     key: `response_${response?.question.question}`,
  //     render: (text) => text || "-",
  //   })),
  // ];
  // const dataSource = [
  //   {
  //     ...responsesFormData?.data?.data?.responses.reduce((acc, response) => {
  //       acc[`response_${response.question.question}`] = response.answer;
  //       return acc;
  //     }, {}),
  //   },
  // ];

  // const transformDataForCSV = (responses) => {
  //   if (!responses || responses.length === 0) {
  //     return null; // Handle the case when there are no responses
  //   }
  //   // Extract unique question headers
  //   const headers = [
  //     ...data.responses.map((response) => ({
  //       label: response.question.question,
  //       key: response.question.question,
  //     })),
  //   ];
  //   const rows = [
  //     {
  //       ...data.responses.reduce((acc, response) => {
  //         acc[`${response.question.question}`] = response.answer;
  //         return acc;
  //       }, {}),
  //     },
  //   ];
  //   // console.log(rows);
  //   return { headers, rows };
  // };
  // const transformedData = transformDataForCSV(
  //   responsesFormData?.data?.data?.responses
  // );
  // console.log("data",responsesFormData?.data?.data)
  return (
    <div>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBlock: "3rem" }}
      >
        <Flex align="flex-end">
          <Button
            htmlType="button"
            style={{ marginRight: 5 }}
            type="dashed"
            size="large"
            icon={
              <AiTwotoneLeftCircle style={{ paddingBottom: 4 }} size={28} />
            }
            onClick={() => router.back()}
          />
          <Typography.Title style={{ marginBottom: 0 }}>
            Responses
          </Typography.Title>
        </Flex>
        <Button
          size="large"
          type="primary"
          onClick={() =>
            handleStatus({
              id: parseInt(responsesFormData?.data?.data?.user_id),
              status: "verified",
            })
          }
          disabled={responsesFormData?.data?.data?.user?.status === "verified"}
        >
          {responsesFormData?.data?.data?.user?.status === "verified"
            ? `Already Verified`
            : "Verified Account"}
        </Button>
        {/* <CSVLink
          data={transformedData?.rows}
          headers={transformedData?.headers}
        >
          <Button size="large" type="primary">
            Export CSV
          </Button>
        </CSVLink> */}
      </Row>

      {responsesFormData?.data?.data?.questions.map((item, index) => (
        <Form
          key={index}
          // form={form}
          name="control-ref"
          layout="vertical"
          // {...formItemLayout}
          // initialValues={{
          //   remember: true,
          // }}
          // onFinish={onSubmit}
          autoComplete="off"
        >
          <FmCardResponse data={item} />
        </Form>
      ))}
    </div>
  );
};

export default Page;
