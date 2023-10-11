import {
  Modal,
  DatePicker,
  Form,
  Input,
  Select,
} from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import toast from "react-hot-toast";
import Dayjs from "dayjs";
import request from "helpers/request";

const initialFormData = {
  productName: "",
  productOwnerName: "",
  Developers: [],
  scrumMasterName: "",
  startDate: null,
  methodology: "",
  location: "",
}

// Modal containing the add/update product form
const ProductModal = forwardRef(({ open, setOpen, isUpdateModal = false, refetchData }, ref) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [productId, setProductId] = useState(null); 
  const [form] = Form.useForm();

  // Provides setFormFields() to parent component using ref
  useImperativeHandle(ref, () => ({
    setFormFields(data) {
      const deepCopiedData = JSON.parse(JSON.stringify(data));
      deepCopiedData.startDate = Dayjs(deepCopiedData.startDate);
      
      setProductId(deepCopiedData.productId);

      delete deepCopiedData.productId;
      
      for(const [key, value] of Object.entries(deepCopiedData)) {
        form.setFieldValue(key, value);
      }
    }
  }));

  // Submit form data to API, refetch data to update locally
  const handleSubmit = async (formValues) => {
    setConfirmLoading(true);

    try {
      if(isUpdateModal) {
        await updateProduct(formValues);
      } else {
        await addProduct(formValues);
      }

      const loadingToastId = toast.loading("Loading...");
      await refetchData();
      toast.dismiss(loadingToastId);
      
      setOpen(false);
      form.resetFields();
    } catch (err) {
      const errorMessage = err.response.data.message;

      if(Array.isArray(errorMessage)) {
        // Show only one error so the user is not flooded.
        toast.error(errorMessage[0]);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  async function addProduct(formValues) {
    const data = JSON.parse(JSON.stringify(formValues));

    data.startDate = formValues.startDate.format("YYYY/MM/DD");
    try {
      await request.post("/product", data);
      toast.success("Product Added Succesfully!");
    } catch (err) {
      throw err;
    }
  }

  async function updateProduct(formValues) {
    const data = JSON.parse(JSON.stringify(formValues));

    data.startDate = formValues.startDate.format("YYYY/MM/DD");
    try {
      await request.patch(`/product/${productId}`, data);
      
      toast.success("Product Updated Succesfully!");
    } catch (err) {
      throw err;
    }
  }

  // Reset fields, close modal on cancel
  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
  };

  return (
    <Modal
      title={isUpdateModal ? "Update Product": "Add New Product" }
      open={open}
      onOk={form.submit}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleSubmit} initialValues={initialFormData} className="pt-4" {...formItemLayout} style={{ maxWidth: 600 }}>
        <Form.Item rules={[{required: true, message: "Please enter Product Name"}]} name="productName" label="Product Name">
          <Input />
        </Form.Item>
        <Form.Item rules={[{required: true, message: "Please enter Product Owner Name"}]} name="productOwnerName" label="Product Owner">
          <Input />
        </Form.Item>
        <Form.Item rules={[{required: true, message: "Please enter atleast 1 Developer"}, {type: 'array', max: 5, message: "Can only have 5 Developers max"}]} name="Developers" label="Developers" tooltip="Enter comma separated list of developers (Upto 5 Entries)">
        <Select
          maxTagCount={5}
          mode="tags"
          style={{ width: '100%' }}
          tokenSeparators={[',']}
          options={null}
          dropdownRender={()=>null}
          dropdownStyle={{display: "none"}}
        />
        </Form.Item>
        <Form.Item rules={[{required: true, message: "Please enter Scrum Master Name"}]} name="scrumMasterName" label="Scrum Master">
          <Input />
        </Form.Item>
        <Form.Item rules={[{required: true, message: "Please enter Start Date"}]} name="startDate" label = "Start Date">
          <DatePicker />
        </Form.Item>
        <Form.Item rules={[{required: true, message: "Please enter Location"}]} name="location" label="Location">
          <Input />
        </Form.Item>
        <Form.Item rules={[{required: true, message: "Please select Methodology"}]} name="methodology" label = "Methodology">
        <Select
          showSearch
          placeholder="Select methodology"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={[
            {
              value: 'Agile',
              label: 'Agile',
            },
            {
              value: 'Waterfall',
              label: 'Waterfall',
            }
          ]}
        />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default ProductModal;
