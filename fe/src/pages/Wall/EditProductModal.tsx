import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  message,
  Space,
} from "antd";
import { PlusOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

interface SubImage {
  des: string;
  url: string;
}

interface Product {
  name: string;
  price: number;
  thumbnailUrl: string;
  subImages: SubImage[];
}

interface EditProductModalProps {
  initialData: Product;
}

const getBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const beforeUpload = (file: File) => {
  const isImage = ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    message.error("Chỉ hỗ trợ ảnh jpg/jpeg/png!");
    alert("Chỉ hỗ trợ ảnh jpg/jpeg/png!");
    return Upload.LIST_IGNORE;
  }
  if (!isLt2M) {
    message.error("Kích thước ảnh phải nhỏ hơn 2MB!");
    alert("Kích thước ảnh phải nhỏ hơn 2MB!");
    return Upload.LIST_IGNORE;
  }

  return isImage && isLt2M;
};

const EditProductModal: React.FC<EditProductModalProps> = ({initialData }) => {
  const [form] = Form.useForm();
  const [thumbnail, setThumbnail] = useState<UploadFile[]>([
    {
      uid: "-1",
      name: "thumbnail",
      status: "done",
      url: initialData.thumbnailUrl,
    },
  ]);
  const [subImages, setSubImages] = useState<UploadFile[]>(
    initialData.subImages.map((img, idx) => ({
      uid: String(idx),
      name: `sub-${idx}`,
      status: "done",
      url: img.url,
    }))
  );

  const handleThumbnailChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setThumbnail(fileList.slice(-1)); // Chỉ lấy 1 file duy nhất
  };

  const handleSubImageChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setSubImages(fileList);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    const imgSrc = file.url || (file.preview as string);
    const win = window.open("", "_blank");
    win?.document.write(`<img src="${imgSrc}" style="max-width:100%"/>`);
  };

  const onFinish = async (values: any) => {
    const thumbnailUrl =
      thumbnail[0]?.url ||
      (thumbnail[0]?.originFileObj
        ? await getBase64(thumbnail[0].originFileObj)
        : "");

    const subImagesData: SubImage[] = await Promise.all(
      subImages.map(async (file) => {
        const url =
          file.url ||
          (file.originFileObj
            ? await getBase64(file.originFileObj)
            : "");
        return {
          des: file.name,
          url,
        };
      })
    );

    const data: Product = {
      name: values.name,
      price: values.price,
      thumbnailUrl: thumbnailUrl || "",
      subImages: subImagesData,
    };

    console.log("🟢 Final product data:", data);
  };

  return (
    <Modal
      title="Chỉnh sửa sản phẩm"
      open={true}
      onOk={() => form.submit()}
      okText="Lưu"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: initialData.name,
          price: initialData.price,
        }}
        onFinish={onFinish}
      >
        <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="price" label="Giá sản phẩm" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Ảnh Thumbnail">
          <Upload
            listType="picture-card"
            fileList={thumbnail}
            onChange={handleThumbnailChange}
            onPreview={handlePreview}
            beforeUpload={beforeUpload}
            onRemove={() => setThumbnail([])}
            maxCount={1}
          >
            {thumbnail.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item label="Ảnh phụ (Sub Images)">
          <Upload
            listType="picture-card"
            fileList={subImages}
            onChange={handleSubImageChange}
            onPreview={handlePreview}
            beforeUpload={beforeUpload}
            multiple
            maxCount={9}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Tải ảnh</div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProductModal;