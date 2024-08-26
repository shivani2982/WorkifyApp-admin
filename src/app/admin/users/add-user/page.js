"use client";
import apiRequest from "@/context/apiRequest";
import { useMutation } from "@tanstack/react-query";
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
} from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
const Page = () => {
  const [form] = Form.useForm();
  const router = useRouter()
  const addUserMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(
        process.env.NEXT_PUBLIC_URL,
        {
          method: "post",
          url: `user`,
          data,
        },
      );

      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        message.success(e.message)
        router.back();
      } else {
        message.error(e.message);
      }
    },
  });

  const handleSubmit = (e) => {
    addUserMutation.mutate(e)
  };
  return (
    <div>
      <Flex justify="flex-start" align="middle" style={{ marginBlock: "3rem" }}>
        <Typography.Title style={{ marginBottom: 0 }}>
          Add user
        </Typography.Title>
      </Flex>
      <Flex>
        <Col span={14}>
          <Form
            form={form}
            name="control-ref"
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Row justify="space-between">
              <Col xs={23} sm={23} md={11} lg={11} xl={11} xxl={11}>
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "this field is mendatory!",
                    },
                  ]}
                  label={
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      Email
                    </Typography.Text>
                  }
                >
                  <Input size="large" placeholder="Email" />
                </Form.Item>
              </Col>
              <Col xs={23} sm={23} md={11} lg={11} xl={11} xxl={11}>
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "this field is mendatory!",
                    },
                  ]}
                  label={
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      User Name
                    </Typography.Text>
                  }
                >
                  <Input size="large" placeholder="User Name" />
                </Form.Item>
              </Col>
              <Col xs={23} sm={23} md={11} lg={11} xl={11} xxl={11}>
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "this field is mendatory!",
                    },
                  ]}
                  label={
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      First Name
                    </Typography.Text>
                  }
                >
                  <Input size="large" placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col xs={23} sm={23} md={11} lg={11} xl={11} xxl={11}>
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "this field is mendatory!",
                    },
                  ]}
                  label={
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      Last Name
                    </Typography.Text>
                  }
                >
                  <Input size="large" placeholder="Last Name" />
                </Form.Item>
              </Col>
              <Col xs={23} sm={23} md={11} lg={11} xl={11} xxl={11}>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "this field is mendatory!",
                    },
                  ]}
                  label={
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      Password
                    </Typography.Text>
                  }
                >
                  <Input.Password size="large" placeholder="Password" />
                </Form.Item>
              </Col>
              <Col xs={23} sm={23} md={11} lg={11} xl={11} xxl={11}>
                <Form.Item
                  name="role_id"
                  rules={[
                    {
                      required: true,
                      message: "this field is mendatory!",
                    },
                  ]}
                  label={
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      Role
                    </Typography.Text>
                  }
                >
                  <Select
                    size="large"
                    showSearch
                    placeholder="Select a Role"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[
                      {
                        label: "Admin",
                        value: 2,
                      },
                      { label: "User", value: 3 },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Button
              htmlType="submit"
              type="primary"
              size="large"
              loading={addUserMutation.isPending}
              // className={styles.btn_submit}
            >
              Create New User
            </Button>
          </Form>
        </Col>
      </Flex>
    </div>
  );
};

export default Page;
