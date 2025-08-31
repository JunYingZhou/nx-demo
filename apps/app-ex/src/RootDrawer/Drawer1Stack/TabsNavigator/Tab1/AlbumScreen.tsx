
// 权限管理

// expo-image-picker：访问相册 / 拍照

// expo-media-library：读写用户媒体库（保存、删除、分页获取相册内容）

// expo-document-picker：选择任意文件（PDF、Word、ZIP 等）

// 相册文件选择

// expo-image-picker → 选图片、视频

// expo-document-picker → 选其他文件

// 相册文件管理

// expo-media-library：

// 获取相册列表

// 获取相册里的图片/视频（支持分页）

// 删除文件

// 保存文件到相册

// 展示 UI

// FlatList 网格展示

// 图片：Image

// 视频：expo-av

// 文件：显示文件名 + 图标

// 上传

// 使用 fetch 或 axios 上传（Expo 支持）。


import { useState, useEffect } from 'react';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Modal,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 3; // 3列布局，左右各16px边距，中间16px间距

export function AlbumScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [videos, setVideos] = useState<MediaLibrary.Asset[]>([]);
  const [documents, setDocuments] = useState<DocumentPicker.Document[]>([]);
  const [selectedImages, setSelectedImages] = useState<ImagePicker.ImagePickerAsset[] | any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'photos' | 'videos' | 'documents'>('photos');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewType, setPreviewType] = useState<'selected' | 'photos' | 'videos'>('selected');

  useEffect(() => {
    loadMedia();
  }, []);



/**
 * 加载设备中的媒体文件（图片和视频）
 * 该函数会请求相册权限，然后分别获取最近创建的50张图片和50个视频
 * @returns {Promise<void>}
 */
  const loadMedia = async () => {
    try {
      setLoading(true);  // 设置加载状态为true，显示加载指示器
    // 请求相册访问权限
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
      // 如果用户拒绝权限请求，显示提示并退出函数
        Alert.alert('权限提示', '需要相册权限来访问您的媒体文件');
        setLoading(false);
        return;
      }

      // 获取图片资源
      const photosResult = await MediaLibrary.getAssetsAsync({
        mediaTypes: ['photo'],  // 只获取图片类型
        first: 50,              // 限制获取数量为50张
        sortBy: ['creationTime'], // 按创建时间排序
      });
      console.log('photosResult', photosResult);  // 输出调试信息
      setPhotos(photosResult.assets);  // 更新状态中的图片列表

      // 获取视频资源
      const videosResult = await MediaLibrary.getAssetsAsync({
        mediaTypes: ['video'],  // 只获取视频类型
        first: 50,              // 限制获取数量为50个
        sortBy: ['creationTime'], // 按创建时间排序
      });
      console.log('videosResult', videosResult);  // 输出调试信息
      setVideos(videosResult.assets);  // 更新状态中的视频列表
    } catch (error) {
    // 捕获并处理可能出现的错误
      console.error('加载媒体文件失败:', error);
      Alert.alert('错误', '加载媒体文件时出现错误');
    } finally {
    // 无论成功或失败，最终都会关闭加载状态
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('权限提示', '需要相册权限来选择图片');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        allowsMultipleSelection: true,  // ✅ 开启多选
        quality: 0.8,
      });
      console.log('result', result.assets);

      if (result.assets && result.assets.length > 0) {
        // 先设置选中的图片到临时状态
        setSelectedImages(result.assets);
        console.log('选中的图片:', result.assets);

        // 将选中的图片保存到相册
        for (const asset of result.assets) {
          try {
            await MediaLibrary.saveToLibraryAsync(asset.uri);
          } catch (saveError) {
            console.log('保存图片到相册失败:', saveError);
          }
        }

        // 重新加载媒体文件
        await loadMedia();

        // 清空临时状态
        setSelectedImages([]);
      }
    } catch (error) {
      console.error('选择图片失败:', error);
      Alert.alert('错误', '选择图片时出现错误');
    }
  };

     const pickDocument = async () => {
     try {
       const result = await DocumentPicker.getDocumentAsync({
         type: '*/*',
         copyToCacheDirectory: true,
       });

       if (result.assets && result.assets.length > 0) {
         setDocuments(prev => [...prev, ...result.assets]);
       }
     } catch (error) {
       console.error('选择文件失败:', error);
       Alert.alert('错误', '选择文件时出现错误');
     }
   };

   // 删除文档
   const deleteDocument = (index: number) => {
     Alert.alert(
       '删除文档',
       '确定要删除这个文档吗？',
       [
         { text: '取消', style: 'cancel' },
         {
           text: '删除',
           style: 'destructive',
           onPress: () => {
             setDocuments(prev => prev.filter((_, i) => i !== index));
           },
         },
       ]
     );
   };

   // 处理文档操作
   const handleDocumentAction = (index: number) => {
     const document = documents[index];
     if (!document) return;

     const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(document.name);
     
     Alert.alert(
       '文档操作',
       '选择操作',
       [
         { text: '取消', style: 'cancel' },
         ...(isImage ? [{ text: '预览', onPress: () => previewDocument(index) }] : []),
         { text: '重命名', onPress: () => console.log('重命名文档', index) },
         { text: '分享', onPress: () => console.log('分享文档', index) },
         { text: '删除', style: 'destructive', onPress: () => deleteDocument(index) },
       ]
     );
   };

   // 预览文档（仅支持图片）
   const previewDocument = (index: number) => {
     const document = documents[index];
     if (!document || !document.uri) return;

     const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(document.name);
     if (!isImage) {
       Alert.alert('提示', '只能预览图片类型的文档');
       return;
     }

     setPreviewData([document]);
     setPreviewType('selected');
     setPreviewIndex(0);
     setPreviewVisible(true);
   };

     // 点击小图预览
   const handlePreview = (index: number, type: 'selected' | 'photos' | 'videos' = 'selected') => {
     let data: any[] = [];
     
     switch (type) {
       case 'selected':
         data = selectedImages;
         break;
       case 'photos':
         data = photos;
         break;
       case 'videos':
         data = videos;
         break;
     }
     
     if (index >= 0 && index < data.length && data[index]) {
       setPreviewData(data);
       setPreviewType(type);
       setPreviewIndex(index);
       setPreviewVisible(true);
     }
   };

     const renderMediaItem = ({ item, index }: { item: MediaLibrary.Asset, index: number }) => {
     if (!item || !item.uri) {
       return null;
     }
     return (
       <TouchableOpacity 
         style={styles.mediaItem}
         onPress={() => handlePreview(index, item.mediaType === 'video' ? 'videos' : 'photos')}
       >
         <Image
           source={{ uri: item.uri }}
           style={styles.mediaImage}
           resizeMode="cover"
         />
         {item.mediaType === 'video' && (
           <View style={styles.videoIndicator}>
             <Text style={styles.videoIcon}>▶</Text>
           </View>
         )}
       </TouchableOpacity>
     );
   };



     // 渲染小图
   const renderSelectedImageItem = ({ item, index }: { item: ImagePicker.ImagePickerAsset, index: number }) => {
     if (!item || !item.uri) {
       return null;
     }
     return (
       <TouchableOpacity style={styles.mediaItem} onPress={() => handlePreview(index, 'selected')}>
         <Image source={{ uri: item.uri }} style={styles.mediaImage} resizeMode="cover" />
       </TouchableOpacity>
     );
   };

     // 根据文件扩展名获取图标
   const getFileIcon = (fileName: string) => {
     const extension = fileName.toLowerCase().split('.').pop();
     switch (extension) {
       case 'pdf':
         return '📄';
       case 'doc':
       case 'docx':
         return '📝';
       case 'xls':
       case 'xlsx':
         return '📊';
       case 'ppt':
       case 'pptx':
         return '📈';
       case 'txt':
         return '📃';
       case 'zip':
       case 'rar':
       case '7z':
         return '📦';
       case 'mp3':
       case 'wav':
       case 'aac':
         return '🎵';
       case 'mp4':
       case 'avi':
       case 'mov':
         return '🎬';
       case 'jpg':
       case 'jpeg':
       case 'png':
       case 'gif':
         return '🖼️';
       default:
         return '📄';
     }
   };

   // 格式化文件大小
   const formatFileSize = (bytes: number) => {
     if (bytes === 0) return '0 B';
     const k = 1024;
     const sizes = ['B', 'KB', 'MB', 'GB'];
     const i = Math.floor(Math.log(bytes) / Math.log(k));
     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
   };

   const renderDocumentItem = ({ item, index }: { item: DocumentPicker.Document, index: number }) => {
     if (!item || !item.name) {
       return null;
     }
     
     const fileIcon = getFileIcon(item.name);
     const fileSize = item.size ? formatFileSize(item.size) : '';
     
     const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(item.name);
     
     return (
       <TouchableOpacity 
         style={styles.documentItem}
         onPress={() => isImage && previewDocument(index)}
       >
         <View style={styles.documentIcon}>
           <Text style={styles.documentIconText}>{fileIcon}</Text>
         </View>
         <View style={styles.documentInfo}>
           <Text style={styles.documentName} numberOfLines={2}>
             {item.name}
           </Text>
           {fileSize && (
             <Text style={styles.documentSize}>
               {fileSize}
             </Text>
           )}
         </View>
         <TouchableOpacity 
           style={styles.documentAction}
           onPress={() => handleDocumentAction(index)}
         >
           <Text style={styles.documentActionText}>⋯</Text>
         </TouchableOpacity>
       </TouchableOpacity>
     );
   };

  const renderTabButton = (tab: 'photos' | 'videos' | 'documents', title: string, count: number) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {title}
      </Text>
      <Text style={[styles.tabCount, activeTab === tab && styles.activeTabCount]}>
        {count}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* 头部 */}
      <View style={styles.header}>
        <Text style={styles.title}>相册</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={pickImage}>
            <Text style={styles.headerButtonText}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={pickDocument}>
            <Text style={styles.headerButtonText}>📁</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 标签栏 */}
      <View style={styles.tabBar}>
        {renderTabButton('photos', '图片', photos.length + selectedImages.length)}
        {renderTabButton('videos', '视频', videos.length)}
        {renderTabButton('documents', '文档', documents.length)}
      </View>

      {/* 内容区域 */}
      <View style={styles.content}>
        {activeTab === 'photos' && (
          <FlatList
            data={selectedImages.length > 0 ? selectedImages : photos}
            renderItem={selectedImages.length > 0 ? renderSelectedImageItem : renderMediaItem}
            keyExtractor={(item, index) => {
              if (selectedImages.length > 0) {
                return item?.uri || `selected-${index}`;
              }
              return item?.id || `photo-${index}`;
            }}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.mediaList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📷</Text>
                <Text style={styles.emptyText}>暂无图片</Text>
                <TouchableOpacity style={styles.emptyButton} onPress={pickImage}>
                  <Text style={styles.emptyButtonText}>选择图片</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}

        {activeTab === 'videos' && (
          <FlatList
            data={videos}
            renderItem={renderMediaItem}
            keyExtractor={(item, index) => item?.id || `video-${index}`}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.mediaList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🎥</Text>
                <Text style={styles.emptyText}>暂无视频</Text>
                <TouchableOpacity style={styles.emptyButton} onPress={pickImage}>
                  <Text style={styles.emptyButtonText}>选择视频</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}

        {activeTab === 'documents' && (
          <FlatList
            data={documents}
            renderItem={renderDocumentItem}
            keyExtractor={(item, index) => item?.uri || `document-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.documentList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📄</Text>
                <Text style={styles.emptyText}>暂无文档</Text>
                <TouchableOpacity style={styles.emptyButton} onPress={pickDocument}>
                  <Text style={styles.emptyButtonText}>选择文档</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>

             <Modal visible={previewVisible} transparent={true} onRequestClose={() => setPreviewVisible(false)}>
         <View style={styles.modalContainer}>
           {previewData[previewIndex] && (
             <Image
               source={{ uri: previewData[previewIndex].uri }}
               style={styles.previewImage}
               resizeMode="contain"
             />
           )}
           
           {/* 预览控制按钮 */}
           <View style={styles.previewControls}>
             <TouchableOpacity
               style={[styles.previewButton, previewIndex === 0 && styles.previewButtonDisabled]}
               onPress={() => {
                 if (previewIndex > 0) {
                   setPreviewIndex(previewIndex - 1);
                 }
               }}
               disabled={previewIndex === 0}
             >
               <Text style={styles.previewButtonText}>‹</Text>
             </TouchableOpacity>
             
             <Text style={styles.previewCounter}>
               {previewIndex + 1} / {previewData.length}
             </Text>
             
             <TouchableOpacity
               style={[styles.previewButton, previewIndex === previewData.length - 1 && styles.previewButtonDisabled]}
               onPress={() => {
                 if (previewIndex < previewData.length - 1) {
                   setPreviewIndex(previewIndex + 1);
                 }
               }}
               disabled={previewIndex === previewData.length - 1}
             >
               <Text style={styles.previewButtonText}>›</Text>
             </TouchableOpacity>
           </View>
           
           {/* 关闭按钮 */}
           <TouchableOpacity
             style={styles.closeButton}
             onPress={() => setPreviewVisible(false)}
           >
             <Text style={styles.closeButtonText}>✕</Text>
           </TouchableOpacity>
         </View>
       </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  tabCount: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
    backgroundColor: '#f1f3f4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activeTabCount: {
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    flex: 1,
  },
  mediaList: {
    padding: 16,
  },
  mediaItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    marginBottom: 8,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  videoIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIcon: {
    color: '#fff',
    fontSize: 12,
  },
  documentList: {
    padding: 16,
  },
     documentItem: {
     flexDirection: 'row',
     alignItems: 'center',
     padding: 16,
     backgroundColor: '#fff',
     borderRadius: 12,
     marginBottom: 12,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
     shadowRadius: 4,
     elevation: 3,
   },
   documentIcon: {
     width: 48,
     height: 48,
     borderRadius: 8,
     backgroundColor: '#f8f9fa',
     justifyContent: 'center',
     alignItems: 'center',
     marginRight: 16,
   },
   documentIconText: {
     fontSize: 24,
   },
   documentInfo: {
     flex: 1,
     marginRight: 12,
   },
   documentName: {
     fontSize: 16,
     color: '#212529',
     fontWeight: '500',
     marginBottom: 4,
   },
   documentSize: {
     fontSize: 12,
     color: '#666',
   },
   documentAction: {
     width: 32,
     height: 32,
     borderRadius: 16,
     backgroundColor: '#f8f9fa',
     justifyContent: 'center',
     alignItems: 'center',
   },
   documentActionText: {
     fontSize: 18,
     color: '#666',
     fontWeight: 'bold',
   },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
     emptyButtonText: {
     color: '#fff',
     fontSize: 16,
     fontWeight: '600',
   },
   // 预览模态框样式
   modalContainer: {
     flex: 1,
     backgroundColor: 'rgba(0,0,0,0.9)',
     justifyContent: 'center',
     alignItems: 'center',
   },
   previewImage: {
     width: '90%',
     height: '80%',
   },
   previewControls: {
     position: 'absolute',
     bottom: 50,
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: 'rgba(0,0,0,0.7)',
     borderRadius: 25,
     paddingHorizontal: 20,
     paddingVertical: 10,
   },
   previewButton: {
     width: 40,
     height: 40,
     borderRadius: 20,
     backgroundColor: 'rgba(255,255,255,0.2)',
     justifyContent: 'center',
     alignItems: 'center',
     marginHorizontal: 10,
   },
   previewButtonDisabled: {
     backgroundColor: 'rgba(255,255,255,0.1)',
   },
   previewButtonText: {
     color: '#fff',
     fontSize: 24,
     fontWeight: 'bold',
   },
   previewCounter: {
     color: '#fff',
     fontSize: 16,
     fontWeight: '600',
     marginHorizontal: 15,
   },
   closeButton: {
     position: 'absolute',
     top: 50,
     right: 30,
     width: 40,
     height: 40,
     borderRadius: 20,
     backgroundColor: 'rgba(0,0,0,0.7)',
     justifyContent: 'center',
     alignItems: 'center',
   },
   closeButtonText: {
     color: '#fff',
     fontSize: 20,
     fontWeight: 'bold',
   },
 });