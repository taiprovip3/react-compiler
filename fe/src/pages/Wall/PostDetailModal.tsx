import React from 'react';
import { Modal, Typography, Carousel, Image, Button, Space, Popconfirm, Divider, Dropdown, MenuProps } from 'antd';
import { Post } from '../../types/Post';
import { DeleteOutlined, EditOutlined, MenuOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface Props {
  visible: boolean;
  onClose: () => void;
  post: Post | null;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: number) => void;
}

const PostDetailModal: React.FC<Props> = ({ visible, onClose, post, onEdit, onDelete }) => {
  if (!post) return null;

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case "UPDATE":
        onEdit?.(post); // Gọi callback truyền từ component cha
        break;
      case "DELETE":
        break;
      default:
        break;
    }
  };

  const items: MenuProps['items'] = [
    {
      label: 'Chỉnh sửa',
      key: 'UPDATE',
      icon: <EditOutlined />,
    },
    {
      label: (
        <Popconfirm
          title="Xác nhận xóa bài viết này?"
          okText="Xóa"
          cancelText="Hủy"
          onConfirm={() => onDelete?.(post.id)}
        >
          Xóa bài
        </Popconfirm>
      ),
      key: 'DELETE',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title={`Chi tiết bài viết: ${post.title}`}
      footer={null}
      width={800}
    >
      <div style={{ position: 'relative' }}>
        <Carousel autoplay>
          <div>
            <Image width="100%" height={400} src={post.thumbnailUrl} style={{ objectFit: 'cover' }} />
          </div>
          {post.postImages.map(image => (
            <div key={image.id}>
              <Image width="100%" height={400} src={image.imageUrl} style={{ objectFit: 'cover' }} />
            </div>
          ))}
        </Carousel>
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <Dropdown menu={menuProps} trigger={['click']} >
            <Button><MenuOutlined /></Button>
          </Dropdown>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Title level={4}>{post.title}</Title>
        <Text type="secondary">Danh mục: {post.category}</Text>
        <Paragraph style={{ marginTop: 8 }}>{post.description}</Paragraph>
        <Text strong style={{ fontSize: '16px', color: '#fa541c' }}>
          {parseInt(post.price).toLocaleString()}₫
        </Text>
        <div style={{ marginTop: 8 }}>
          Lượt xem: {post.viewsCount} | Trạng thái: {post.isActive ? 'Hiển thị' : 'Ẩn'}
        </div>
        <div style={{ marginTop: 4, fontSize: 12, color: '#888' }}>
          Người đăng: {post.owner.username} ({post.owner.email})
        </div>
      </div>
    </Modal>
  );
};

export default PostDetailModal;