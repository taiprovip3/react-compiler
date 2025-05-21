import React from 'react';
import { Modal, Form, Input } from 'antd';
import { Post } from '../../types/Post';

interface Props {
  open: boolean;
  post: Post | null;
  onClose: () => void;
  onSubmit?: (updatedPost: Post) => void;
}

const EditPostModal: React.FC<Props> = ({ open, post, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (post) {
      form.setFieldsValue(post); // Gán data khi mở modal
    }
  }, [post]);

  const handleFinish = (values: any) => {
    const updatedPost = { ...post, ...values };
    onSubmit?.(updatedPost);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Chỉnh sửa bài viết"
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="category" label="Danh mục">
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Giá">
          <Input type="number" />
        </Form.Item>
        {/* Bạn có thể bổ sung các trường khác như thumbnailUrl, postImages... */}
      </Form>
    </Modal>
  );
};

export default EditPostModal;