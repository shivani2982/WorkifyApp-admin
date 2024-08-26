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
  Modal,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AiTwotoneLeftCircle } from "react-icons/ai";
const Page = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userData = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await apiRequest(
        process.env.NEXT_PUBLIC_URL,
        {
          method: "get",
          url: `userByAdmin?id=${params.id}`,
        },
        router
      );
      return response;
    },
    enabled: params.id ? true : false,
  });
  const disputeMutation = useMutation({
    mutationKey: ["newDispute"],
    mutationFn: async (data) => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "post",
        url: `dispute`,
        data,
      });
      console.log("sss",response)
      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        message.success(e.message);
      } else {
        message.error(e.message);
      }
    },
  });
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async (e) => {
    const data = {
      useraccount_id: parseInt(userData?.data?.data?.user_id),
      complain_title: e.title,
      complain_msg: e.message,
    };
    await disputeMutation.mutate(data);
    setIsModalOpen(false);
    form.resetFields();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  // console.log("dataa", userData?.data?.data);

  return (
    <div>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBlock: "3rem" }}
      >
        <Flex align="middle">
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
          <Typography.Title style={{ marginBottom: 0 }}>
            User Detail's
          </Typography.Title>
        </Flex>
        <div>
          <Button
            size="large"
            type="primary"
            onClick={() => router.push("/admin/forms/add-form")}
            style={{ marginRight: 20 }}
          >
            Create Form
          </Button>
          <Button size="large" type="primary" onClick={showModal}>
            Create Dispute
          </Button>
          <Modal
            title="Create Dispute"
            open={isModalOpen}
            onOk={form.submit}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button
                htmlType="submit"
                key="submit"
                type="primary"
                loading={disputeMutation.isPending}
                onClick={form.submit}
              >
                Submit
              </Button>,
            ]}
          >
            <Form
              form={form}
              name="control-ref"
              layout="vertical"
              onFinish={handleOk}
              autoComplete="off"
            >
              <Form.Item
                name="title"
                rules={[
                  {
                    required: true,
                    message: "this field is mendatory!",
                  },
                ]}
                label={
                  <Typography.Text strong style={{ fontSize: 14 }}>
                    Title
                  </Typography.Text>
                }
              >
                <Input size="large" placeholder="Title" />
              </Form.Item>
              <Form.Item
                name="message"
                rules={[
                  {
                    required: true,
                    message: "this field is mendatory!",
                  },
                ]}
                label={
                  <Typography.Text strong style={{ fontSize: 14 }}>
                    Message
                  </Typography.Text>
                }
              >
                <Input.TextArea
                  size="large"
                  placeholder="Write message here.."
                  autoSize={{
                    minRows: 2,
                    maxRows: 2,
                  }}
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Row>
      <Flex>
        <Col span={14}>
          <Row>
            <Typography.Text style={{ marginRight: 5 }}>
              User Name:
            </Typography.Text>
            <Typography.Text style={{ marginBottom: 0 }}>
              {userData?.data?.data?.user_name}
            </Typography.Text>
          </Row>
          <Row>
            <Typography.Text style={{ marginRight: 5 }}>
              First Name:
            </Typography.Text>
            <Typography.Text style={{ marginBottom: 0 }}>
              {userData?.data?.data?.first_name}
            </Typography.Text>
          </Row>
        </Col>
      </Flex>
    </div>
  );
};

export default Page;
