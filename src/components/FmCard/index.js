import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Checkbox,
  Radio,
  Space,
  Select,
  Flex,
} from "antd";
const FmCard = ({ data, form }) => {
  return data.question_type.label === "Short" ? (
    <Card sx={{ minWidth: 275 }}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        {data?.question}
        {data.required === true ? (
          <span style={{ color: "red", fontSize: "20px" }}>*</span>
        ) : null}
      </Typography.Title>
      <br />
      <Form.Item
        name={data.id}
        rules={[
          {
            required: data.required,
            message: "Please input your answer!",
          },
        ]}
      >
        <Input size="large" placeholder="Short Answer" />
      </Form.Item>
      {data.required === false ? (
        <Flex justify="flex-end">
          <Button onClick={() => form.resetFields([data.id])} type="text">
            Delete Selection
          </Button>
        </Flex>
      ) : null}
    </Card>
  ) : data.question_type.label === "Long" ? (
    <Card sx={{ minWidth: 275 }}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        {data?.question}
        {data.required === true ? (
          <span style={{ color: "red", fontSize: "20px" }}>*</span>
        ) : null}
      </Typography.Title>
      <br />
      <Form.Item
        name={data.id}
        rules={[
          {
            required: data.required,
            message: "Please input your answer!",
          },
        ]}
      >
        <Input.TextArea size="large" placeholder="Long Answer" />
      </Form.Item>
      {data.required === false ? (
        <Flex justify="flex-end">
          <Button onClick={() => form.resetFields([data.id])} type="text">
            Delete Selection
          </Button>
        </Flex>
      ) : null}
    </Card>
  ) : data.question_type.label === "Check" ? (
    <Card sx={{ minWidth: 275 }}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        {data?.question}
        {data.required === true ? (
          <span style={{ color: "red", fontSize: "20px" }}>*</span>
        ) : null}
      </Typography.Title>
      <br />
      <Form.Item
        name={data.id}
        rules={[
          {
            required: data.required,
            message: "Please input your answer!",
          },
        ]}
      >
        <Checkbox.Group defaultValue={["Apple"]}>
          <Space direction="vertical">
            {data.options.map((item, index) => (
              <Checkbox key={index} value={item.id}>
                {item.label}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </Form.Item>
      {data.required === false ? (
        <Flex justify="flex-end">
          <Button onClick={() => form.resetFields([data.id])} type="text">
            Delete Selection
          </Button>
        </Flex>
      ) : null}
    </Card>
  ) : data.question_type.label === "Radio" ? (
    <Card sx={{ minWidth: 275 }}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        {data?.question}
        {data.required === true ? (
          <span style={{ color: "red", fontSize: "20px" }}>*</span>
        ) : null}
      </Typography.Title>
      <br />
      <Form.Item
        name={data.id}
        rules={[
          {
            required: data.required,
            message: "Please input your answer!",
          },
        ]}
      >
        <Radio.Group>
          <Space direction="vertical">
            {data.options.map((item, index) => (
              <Radio key={index} value={item.id}>
                {item.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Form.Item>
      {data.required === false ? (
        <Flex justify="flex-end">
          <Button onClick={() => form.resetFields([data.id])} type="text">
            Delete Selection
          </Button>
        </Flex>
      ) : null}
    </Card>
  ) : data.question_type.label === "Dropdown" ? (
    <Card sx={{ minWidth: 275 }}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        {data?.question}
        {data.required === true ? (
          <span style={{ color: "red", fontSize: "20px" }}>*</span>
        ) : null}
      </Typography.Title>
      <br />
      <Form.Item
        name={data.id}
        rules={[
          {
            required: data.required,
            message: data.error? data.error:"Please input your answer!",
          },
        ]}
      >
        <Select
          showSearch
          placeholder="Select a person"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={data.options.map(({ id, label }) => ({ value: id, label }))}
        />
      </Form.Item>
      {data.required === false ? (
        <Flex justify="flex-end">
          <Button onClick={() => form.resetFields([data.id])} type="text">
            Delete Selection
          </Button>
        </Flex>
      ) : null}
    </Card>
  ) : null;
};

export default FmCard;
