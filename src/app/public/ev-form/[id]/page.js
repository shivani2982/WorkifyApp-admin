"use client";
import FmCard from "@/components/FmCard";
import { Button, Flex, Form, Card, Typography, message } from "antd";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { decryptUrl } from "@/context/decryptUrl";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiRequest from "@/context/apiRequest";
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

export default function Home() {
  const [form] = Form.useForm();
  const pathname = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const [submitStatus, setSubmitStatus] = useState(false);
  const [id, setId] = useState(null);
  useEffect(() => {
    if (params.id) {
      const decryptedUrl = decryptUrl(params.id, pathname.get("title"));
      const status = localStorage.getItem("@alreadySubmit");
      setId(decryptedUrl);
      setSubmitStatus(Boolean(status));
    }
  }, []);

  const publicFormData = useQuery({
    queryKey: ["publicForm", id],
    queryFn: async () => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_IP_URL, {
        method: "get",
        url: `form?id=${id}`,
      });

      return response;
    },
    enabled: id ? true : false,
  });

  const publicFormMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_IP_URL, {
        method: "post",
        url: `response`,
        data,
      });

      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        message.success(e.message);
        await localStorage.setItem("@alreadySubmit", true);
        setSubmitStatus(true);
      } else {
        message.error(e.message);
        setSubmitStatus(false);
      }
    },
  });

  const onSubmit = (data) => {
    const formDataJson = {
      form_id: Number(id),
      responses: Object.entries(data).map((item) => {
        return Array.isArray(item[1]) || typeof item[1] === "number"
          ? { question_id: Number(item[0]), response_options: item[1]}
          : { question_id: Number(item[0]), answer: item[1] };
      }),
    };
    // console.log(formDataJson);
    publicFormMutation.mutate(formDataJson);
  };

  return (
    <div className={styles.container}>

      {publicFormData?.data?.data?.live === false ||
      publicFormData?.data?.data === null ? (
        <Flex justify="center" align="center">
          <Card style={{ width: "600px" }}>
            <Typography.Title level={2}>
              {publicFormData?.data?.data?.title
                ? publicFormData?.data?.data?.title
                : "Form no longer exist"}
            </Typography.Title>
            <Typography.Text>
              The {publicFormData?.data?.data?.title} form is no longer
              accepting responses.
              <br />
              Try contacting the owner of the form if you think this is a
              mistake.
            </Typography.Text>
          </Card>
        </Flex>
      ) : submitStatus === true ? (
        <Flex justify="center" align="center">
          <Card style={{ width: "600px" }}>
            <Typography.Title level={2}>
              {publicFormData?.data?.data?.title}
            </Typography.Title>

            <Typography.Text>Your response has been recorded.</Typography.Text>
            <br />
            <Button
              style={{ padding: 0 }}
              type="link"
              onClick={async () => {
                await localStorage.removeItem("@alreadySubmit");
                window.location.reload();
              }}
            >
              Submit another response
            </Button>
          </Card>
        </Flex>
      ) : (
        <Flex vertical="vertical" gap="large">
          <Card>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {publicFormData?.data?.data?.title}
            </Typography.Title>
          </Card>
          {publicFormData.data?.data?.questions.map((item, index) => (
            <Form
              key={index}
              form={form}
              name="control-ref"
              layout="vertical"
              {...formItemLayout}
              initialValues={{
                remember: true,
              }}
              onFinish={onSubmit}
              autoComplete="off"
            >
              <FmCard data={item} form={form} />
            </Form>
          ))}

          <Button
            onClick={() => form.submit()}
            type="primary"
            size="large"
            loading={publicFormMutation.isPending}
            className={styles.btn_submit}
          >
            Submit
          </Button>
        </Flex>
      )}
    </div>
  );
}
