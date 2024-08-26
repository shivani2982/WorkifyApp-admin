"use client";
import React, { useState } from "react";
import {
  Row,
  Button,
  Typography,
  Table,
  message,
  Input,
  Col,
  Card,
} from "antd";
import { useRouter } from "next/navigation";
import { AiTwotoneDelete, AiOutlineRight } from "react-icons/ai";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiRequest from "@/context/apiRequest";
import moment from "moment";

const Page = () => {
  const [searchText, setSearchText] = useState("");

  const {data: countData} = useQuery({
    queryKey: ["allCountData"],
    queryFn: async () => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "get",
        url: `allCountData`,
      });
      return response;
    },
  });

  console.log("first", countData)

  return (
    <div>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBlock: "3rem" }}
      >
        <Typography.Title style={{ marginBottom: 0 }}>
          Dashboard
        </Typography.Title>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Card
            title="Total User"
            bordered={false}
            style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}
          >
            {countData?.data?.countUser}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Total Client User"
            bordered={false}
            style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}
          >
            {countData?.data?.countClient}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Total Freelancer User"
            bordered={false}
            style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}
          >
            {countData?.data?.countFreelancer}
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{marginTop: 20}}>
        <Col span={8}>
          <Card
            title="Total Job"
            bordered={false}
            style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}
          >
            {countData?.data?.countJob}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Total Feature Job"
            bordered={false}
            style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}
          >
            {countData?.data?.countFeatureJob}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Total Active Disputes"
            bordered={false}
            style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}
          >
            {countData?.data?.countActiveDispute}
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{marginTop: 20}}>
        <Col span={8}>
          <Card
            title="Total Working Contract"
            bordered={false}
            style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}
          >
            {countData?.data?.countWorkingContract}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Total Complete Contract"
            bordered={false}
            style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}
          >
            {countData?.data?.countCompleteContract}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Total Cancel Contract"
            bordered={false}
            style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}
          >
            {countData?.data?.countCancelContract}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Page;
