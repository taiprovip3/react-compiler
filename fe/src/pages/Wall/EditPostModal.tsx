import React from 'react';
import { Modal, Form, Input, UploadProps, Select, InputNumber, Radio, Space, Image, Upload, Button } from 'antd';
import { Post, PostImage } from '../../types/Post';
import { isValidImageFile } from '../../utils/validate-img';
import { useGlobalMessage } from '../../contexts/GlobalMessageContext';
import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

const CATEGORY_OPTIONS = [
  'Mainboard', 'Cpu', 'Ram', 'Ssd', 'HDD', 'Card VGA', 'Nguồn', 'Tản nhiệt CPU',
  'Vỏ case', 'Màn hình', 'Chuột', 'Bàn phím', 'Tai nge', 'Loa', 'Dây cáp',
  'Quạt tản nhiệt', 'Card', 'Bàn', 'Ghế', 'Lót chuột', 'ARM màn hình',
  'Phụ kiện', 'USB'
];
const BLANK_IMAGE = 'https://ph-hldgs.co.jp/wp-content/themes/PlusAdd/assets/images/common/noimage.png';
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

interface EditPostModalProps {
  open: boolean;
  post: Post;
  onClose: () => void;
  onSubmit?: (updatedPost: Post) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ open, post, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [editedPost, setEditedPost] = React.useState<Post>({ ...post });
  const [thumbnailPreview, setThumbnailPreview] = React.useState(editedPost.thumbnailUrl || '');
  const [postImages, setPostImages] = React.useState<PostImage[]>(editedPost.postImages || []);
  const messageApi = useGlobalMessage();

  const handleInputChange = (field: keyof Post, value: any) => {
    setEditedPost({ ...editedPost, [field]: value });
  };

  const handleThumbnailChange: UploadProps["beforeUpload"] = (file) => {
    const isImage = file.type.startsWith("image/");
    const isLt2M = file.size < MAX_IMAGE_SIZE;

    if (!isImage) {
      messageApi.error("Chỉ hỗ trợ định dạng ảnh");
      return false;
    }

    if (!isLt2M) {
      messageApi.error("Ảnh phải nhỏ hơn 2MB");
      return false;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    return false; // prevent upload
  };

  const handleRemoveThumbnail = () => {
    setThumbnailPreview('');
    setEditedPost({ ...editedPost, thumbnailUrl: '' });
  };

  const handlePostImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    for (const file of files) {
      if (!isValidImageFile(file) || file.size > 2 * 1024 * 1024) {
        alert(`File ${file.name} không hợp lệ (ảnh hoặc >2MB).`);
        continue;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPostImages(prev => {
          if (prev.length < 9) {
            const newImage: PostImage = {
              id: Date.now(),
              imageUrl: base64,
              description: ''
            }
            const updated = [...prev, newImage];
            setEditedPost({ ...editedPost, postImages: updated });
            return updated;
          } else {
            alert('Tối đa chỉ được 9 ảnh con');
            return prev;
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePostImage = (index: number) => {
    const updated = postImages.filter((_, i) => i !== index);
    setPostImages(updated);
    setEditedPost({ ...editedPost, postImages: updated });
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedPost: Post = {
          ...post!,
          ...values,
          thumbnailUrl: thumbnailPreview,
          postImages,
        };

        console.log("✅ Post đã chỉnh sửa:", updatedPost);
        // onSave(updatedPost);
      })
      .catch((error) => {
        console.error("Lỗi validate:", error);
      });
  };

  const handleFinish = (values: any) => {
    const updatedPost = { ...post, ...values };
    onSubmit?.(updatedPost);
    onClose();
  };

  React.useEffect(() => {
    if (post) {
      form.setFieldsValue(post); // Gán data khi mở modal
    }
  }, [post]);

  return (
    <Modal
      open={open}
      title="Chỉnh sửa bài viết"
      onCancel={onClose}
      onOk={handleSave}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
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

        <Form.Item label="Ảnh đại diện (Thumbnail)">
          <Space direction="horizontal">
            {thumbnailPreview ? (
              <Image
                src={thumbnailPreview}
                width={100}
                height={100}
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: 100,
                  height: 100,
                  border: "1px dashed #ccc",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#999",
                }}
              >
                Trống
              </div>
            )}
            <Upload beforeUpload={handleThumbnailChange} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            {thumbnailPreview && (
              <Button danger icon={<DeleteOutlined />} onClick={handleRemoveThumbnail} />
            )}
          </Space>
        </Form.Item>

        <Form.Item label="Ảnh con (tối đa 9)">
          <Space wrap>
            {postImages.map((img) => (
              <div key={img.id} style={{ position: "relative" }}>
                <Image
                  src={img.imageUrl}
                  width={100}
                  height={100}
                  style={{ objectFit: "cover", border: "1px solid #ccc" }}
                />
                <Button
                  type="primary"
                  danger
                  shape="circle"
                  icon={<DeleteOutlined />}
                  size="small"
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                  }}
                  onClick={() => handleRemovePostImage(img.id)}
                />
              </div>
            ))}
          </Space>
          <div style={{ marginTop: 12 }}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePostImagesUpload}
              style={{ display: "none" }}
              id="upload-post-images"
            />
            <label htmlFor="upload-post-images">
              <Button icon={<PlusOutlined />}>Thêm ảnh con</Button>
            </label>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPostModal;