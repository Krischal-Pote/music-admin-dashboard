import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select } from "antd";
import { FormInstance } from "antd/es/form";

interface ArtistFormProps {
  onSubmit: (artistData: any) => void;
  initialValues?: any; // Use appropriate type for artist
}

const ArtistForm: React.FC<ArtistFormProps> = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm<FormInstance>();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <Form form={form} onFinish={handleFinish} layout="vertical">
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please enter the artist's name" }]}
      >
        <Input />
      </Form.Item>
      {/* <Form.Item name="dob" label="Date of Birth">
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item> */}
      <Form.Item
        name="dob"
        label="Date of Birth"
        rules={[{ required: true, message: "Please select a date" }]}
      >
        <input type="date" />
      </Form.Item>
      <Form.Item name="gender" label="Gender">
        <Select>
          <Select.Option value="m">Male</Select.Option>
          <Select.Option value="f">Female</Select.Option>
          <Select.Option value="o">Other</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="address" label="Address">
        <Input />
      </Form.Item>
      <Form.Item name="first_release_year" label="First Release Year">
        <Input type="number" />
      </Form.Item>
      <Form.Item name="no_of_albums_released" label="No. of Albums Released">
        <Input type="number" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {initialValues ? "Update Artist" : "Add Artist"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ArtistForm;
