import React from 'react';
import { Card, Carousel, Row, Col, Typography, Image, Empty } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { postApi } from '../../api';
import { useLoading } from '../../contexts/LoadingContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Post } from '../../types/Post';
import PostDetailModal from './PostDetailModal';
import EditPostModal from './EditPostModal';
dayjs.extend(relativeTime);

const { Title, Paragraph, Text } = Typography;

const WallPage: React.FC = () => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
  const [postDetailModalVisible, setPostDetailModalVisible] = React.useState<boolean>(false);
  const [editPostModalVisible, setEditPostModalVisible] = React.useState<boolean>(false);
  const [editingPost, setEditingPost] = React.useState<Post | null>(null);

  
  // const { setIsLoading } = useLoading();

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        // setIsLoading(true);
        const postList = await postApi.getPosts(1);
        setPosts(postList);
      } catch (error) {
        console.error(error);
        setError('Lỗi khi tải dữ liệu bài viết');
      } finally {
        // setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setPostDetailModalVisible(true);
  };

  const handlePostDetailModalClose = () => {
    setSelectedPost(null);
    setPostDetailModalVisible(false);
  }

  const handleEditPostModalClose = () => {
    setEditPostModalVisible(false);
    setEditingPost(null);
  }

  const handleEdit = (post: Post) => {
    console.log("Edit post:", post.id);
    setEditingPost(post);
    setEditPostModalVisible(true);
    // TODO: Show form update
  };

  const handleDelete = async (postId: number) => {
    try {
      // await axios.delete(`http://localhost:3000/api/posts/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
      setPostDetailModalVisible(false);
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
    }
  };

  if (error) return <div style={{ textAlign: 'center', marginTop: 40 }}>{error}</div>;
  // if (posts.length === 0) return <Empty description="Không có bài viết nào." style={{ marginTop: 80 }} />;

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Row gutter={[24, 24]} justify="center">
        {posts.map(post => (
          <Col key={post.id} xs={24} sm={20} md={16} lg={12} xl={8}>
            <Card
              hoverable
              onClick={() => handlePostClick(post)}
              cover={
                <Carousel autoplay style={{ height: 300 }}>
                  <div>
                    <Image
                      height={300}
                      src={post.thumbnailUrl}
                      alt="Thumbnail"
                      style={{ objectFit: 'cover', width: '100%' }}
                      preview={false}
                    />
                  </div>
                  {post.postImages.map(image => (
                    <div key={image.id}>
                      <Image
                        height={300}
                        src={image.imageUrl}
                        alt={image.description}
                        style={{ objectFit: 'cover', width: '100%' }}
                        preview={false}
                      />
                    </div>
                  ))}
                </Carousel>
              }
            >
              <Title level={4}>{post.title}</Title>
              <Text type="secondary">{post.category}</Text>
              <Paragraph ellipsis={{ rows: 2 }}>{post.description}</Paragraph>
              <Text strong style={{ fontSize: '16px', color: '#fa541c' }}>
                {parseInt(post.price).toLocaleString()}₫
              </Text>
              <div style={{ marginTop: 8 }}>
                <EyeOutlined /> {post.viewsCount} views
              </div>
              <div style={{ marginTop: 4, fontSize: 12, color: '#888' }}>
                By {post.owner.username} • {new Date(post.createdAt).toLocaleDateString()} ({dayjs(post.createdAt).fromNow()})
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <PostDetailModal
        visible={postDetailModalVisible}
        onClose={handlePostDetailModalClose}
        post={selectedPost}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditPostModal
        open={editPostModalVisible}
        post={editingPost}
        onClose={handleEditPostModalClose}      
      />
    </div>
  );
};

export default WallPage;