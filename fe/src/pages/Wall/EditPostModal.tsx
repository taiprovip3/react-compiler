import React from 'react';
import { Modal, Form, Input, UploadProps, Select, InputNumber, Radio, Space, Image, Upload, Button, UploadFile } from 'antd';
import { Post, PostImage } from '../../types/Post';
import { useGlobalMessage } from '../../contexts/GlobalMessageContext';
import { PlusOutlined } from '@ant-design/icons';

const CATEGORY_OPTIONS = [
  'Mainboard', 'Cpu', 'Ram', 'Ssd', 'HDD', 'Card VGA', 'Nguồn', 'Tản nhiệt CPU',
  'Vỏ case', 'Màn hình', 'Chuột', 'Bàn phím', 'Tai nge', 'Loa', 'Dây cáp',
  'Quạt tản nhiệt', 'Card', 'Bàn', 'Ghế', 'Lót chuột', 'ARM màn hình',
  'Phụ kiện', 'USB'
];

interface EditPostModalProps {
  open: boolean;
  onClose: () => void;
  post: Post;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ open, onClose, post }) => {

  // Declare state
  const [form] = Form.useForm();
  const messageApi = useGlobalMessage();
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string>("");
  const [previewTitle, setPreviewTitle] = React.useState<string>("");
  const [thumbnail, setThumbnail] = React.useState<UploadFile[]>([{
        uid: "-1",
        name: "thumbnail",
        status: "done",
        url: post.thumbnailUrl,
      },]);
    const [subImages, setSubImages] = React.useState<UploadFile[]>(
      post.postImages.map((img, idx) => ({
        uid: String(idx),
        name: `sub-${idx}`,
        status: "done",
        url: img.imageUrl,
      }))
    );

  // React hook
  React.useEffect(() => {
    if (post) {
      form.setFieldsValue(post); // Gán data khi mở modal
      console.log('Editing post: ', post);
    }
  }, [post]);

  // Fuctions
  const getBase64 = (file: File | Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleSave = async (values: any) => {
    const thumbnailUrl =
      thumbnail[0]?.url ||
      (thumbnail[0]?.originFileObj
        ? await getBase64(thumbnail[0].originFileObj)
        : "");

    const subImagesData: PostImage[] = await Promise.all(
      subImages.map(async (file) => {
        const url = file.url || (file.originFileObj ? await getBase64(file.originFileObj) : "");
        return {
          id: 0,
          description: file.name,
          imageUrl: url,
        };
      })
    );
    const data: Post = {
      ...post,
      title: values.title,
      description: values.description,
      category: values.category,
      isActive: values.isActive,
      thumbnailUrl: thumbnailUrl || "",
      postImages: subImagesData,
    };
    console.log("🟢 Form values:", data);

    const totalImageSize = subImages.reduce((acc, file) => {
      const originFile = file.originFileObj as File;
      return acc + (originFile?.size || 0);
    }, 0);
    console.log(`📸 Tổng dung lượng ảnh subImages: ${(totalImageSize / 1024 / 1024).toFixed(2)} MB`);

    const jsonStr = JSON.stringify(data);
    const bytes = new TextEncoder().encode(jsonStr).length;
    const sizeInMB = (bytes / 1024 / 1024).toFixed(2);
    console.log(`📦 Kích thước object data: ${sizeInMB} MB`);
  };

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
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1));
  };

  const beforeUpload = (file: File) => {
    console.info('Validating image...');
    const isImage = ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
      messageApi.error("Chỉ hỗ trợ ảnh jpg/jpeg/png!");
      return Upload.LIST_IGNORE;
    }
    if (!isLt2M) {
      messageApi.error("Kích thước ảnh phải nhỏ hơn 2MB!");
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  // UI
  return (
    <>
      <Modal
        open={open}
        title="Chỉnh sửa bài viết"
        onCancel={onClose}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
            <Select>
              {CATEGORY_OPTIONS.map((cat) => (
                <Select.Option key={cat} value={cat}>
                  {cat}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="price" label="Giá (VND)" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="isActive" label="Trạng thái">
            <Radio.Group>
              <Radio value={true}>Hiển thị</Radio>
              <Radio value={false}>Ẩn</Radio>
            </Radio.Group>
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
          <Form.Item label="Ảnh phụ (9) (Sub Images)">
            <Upload
              action={undefined}
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

      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default EditPostModal;