import { Box, Button, Checkbox, FormControl, FormLabel, Image, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Textarea, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { RootState } from '../../../reducers';
import { useSelector } from 'react-redux';
import { apiGetReq, apiPostReq, apiPutReq } from '../../../Constant/api-functions';
interface News {
   _id: string;
   title: string;
   intro: string;
   feature: string;
   tags: string;
   date: string;
   files?: string[];
   content: string;
   link: string;
   nickname: string;
   email: string;
   confirmed: boolean;
 }

 interface ArticleProps {
   tagData?: any[];
   date?:string
 }
const ArticleEdit: React.FC<ArticleProps> = ({date}) => {
   const [cardData, setCardData] = useState<News[]>([]);
   const themeMode = useSelector((state: RootState) => state.themeMode.mode);
   const [preview, setPreview] = useState<string | null>(null);
   const [editData, setEditData] = useState<News | null>(null);
   const [newData, setNewData] = useState<News>({
     _id: "",
     title: "",
     intro: "",
     feature: "",
     files: [""],
     date: "",
     content: "",
     // content: [{ subHead: "", img: "", description: "" }],
     link: "",
     nickname: "",
     email: "",
     confirmed: false,
     tags: "",
   });
   const { isOpen, onClose } = useDisclosure();
   const toast = useToast();
   useEffect(() => {
     fetchArticles();
   }, []);

   const fetchArticles = () => {
     apiGetReq("/news/all?limit=100", {})
       .then((res) => {
         if (res?.news) {
           setCardData(res.news);
         } else {
           console.error("No news data found in API response", res);
         }
       })
       .catch((err) => console.error("API fetch error:", err));
   };

   const uploadImage = async (file: File) => {
     const formData = new FormData();
     formData.append("image", file);

     try {
       const res = await apiPostReq("/upload", formData, true);
       return res?.fileUrl || "";
     } catch (error) {
       console.error("Error uploading image:", error);
       return "";
     }
   };

   const handleImageUpload = async (
     event: React.ChangeEvent<HTMLInputElement>,
     isNew: boolean = false
   ) => {
     const file = event.target.files?.[0];
     if (file) {
       const uploadedImageUrl = await uploadImage(file);
       if (uploadedImageUrl) {
         if (isNew) {
           setNewData((prev) => ({
             ...prev,
             files: [uploadedImageUrl],
           }));
         } else {
           setEditData((prev) =>
             prev ? { ...prev, files: [uploadedImageUrl] } : null
           );
         }
         setPreview(uploadedImageUrl); // Set the preview image
       }
     }
   };

   const handleInputChange = (
     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
     field: string,
     isNew: boolean = false
   ) => {
     const { value } = e.target;
     if (isNew) {
       setNewData((prev) => ({ ...prev, [field]: value }));
     } else {
       setEditData((prev) => (prev ? { ...prev, [field]: value } : null));
     }
   };

   const handleSave = async () => {
     if (!editData || !editData._id) return;
     const updatedData = {
       ...editData,
       date: new Date(editData.date).toISOString(),
       // content: JSON.stringify(editData.content),
       files: editData.files, // Ensure files array is included
     };

     try {
       const res = await apiPutReq(`/news/${editData._id}`, updatedData);
       if (res.success) {
         fetchArticles();
         toast({
           title: "Article updated successfully!",
           status: "success",
           duration: 3000,
           isClosable: true,
         });
         onClose();
       } else {
         toast({
           title: "Failed to update article",
           status: "error",
           duration: 3000,
           isClosable: true,
         });
       }
     } catch (error) {
       console.error("Error updating article:", error);
       toast({
         title: "Error updating article",
         status: "error",
         duration: 3000,
         isClosable: true,
       });
     }
   };
   return (
      <>
          <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="lg" boxShadow="xl" p={4} maxWidth={800}>
          <ModalHeader
            fontSize="2xl"
            fontWeight="bold"
            textAlign="center"
            color="blue.600">
            Edit Article
          </ModalHeader>

          <ModalBody>
            {/* Image Upload Section */}
            <FormControl id="files" isRequired mb={4}>
              <FormLabel>Upload Image</FormLabel>
              {preview && (
                <Box
                  mt={2}
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="md"
                  overflow="hidden"
                  width="150px"
                  height="150px">
                   <Image
                    className="w-full h-full"
                    src={preview}
                    alt="Uploaded Preview"
                    objectFit="fill"
                  />
                </Box>
              )}

              <Input
                type="file"
                p={1}
                onChange={(e) => handleImageUpload(e, false)}
                accept="image/*"
              />

              {/* Remove Image Button */}
              {preview && (
                <Button
                  size="sm"
                  colorScheme="red"
                  mt={2}
                  onClick={() => {
                    setPreview(null);
                    setEditData((prev:any) =>
                      prev ? { ...prev, files: [""] } : null
                    );
                  }}>
                  Remove Image
                </Button>
              )}
            </FormControl>

            {/* Grid Layout for Input Fields */}
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
              <FormControl id="title" isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  value={editData?.title || ""}
                  onChange={(e) => handleInputChange(e, "title", false)}
                  placeholder="Enter title"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl id="nickname" isRequired>
                <FormLabel>Nickname</FormLabel>
                <Input
                  value={editData?.nickname || ""}
                  onChange={(e) => handleInputChange(e, "nickname", false)}
                  placeholder="Enter nickname"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl id="tags" isRequired>
                <FormLabel>Tags</FormLabel>
                <Input
                  value={editData?.tags || ""}
                  onChange={(e) => handleInputChange(e, "tags", false)}
                  placeholder="Enter tags"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={editData?.email || ""}
                  onChange={(e) => handleInputChange(e, "email", false)}
                  placeholder="Enter email"
                  focusBorderColor="blue.500"
                />
              </FormControl>
            </SimpleGrid>

            {/* Introduction Field */}
            <FormControl id="intro" isRequired mt={4}>
              <FormLabel>Introduction</FormLabel>
              <Textarea
                value={editData?.intro || ""}
                onChange={(e) => handleInputChange(e, "intro", false)}
                placeholder="Enter introduction"
                focusBorderColor="blue.500"
              />
            </FormControl>

            {/* Date */}
            {/* <FormControl id="date" isRequired>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                value={editData?.date || ""}
                onChange={(e) => handleInputChange(e, "date", false)}
                focusBorderColor="blue.500"
              />
            </FormControl> */}

            {/* Checkbox */}
            <FormControl
              id="confirmed"
              mt={4}
              display="flex"
              alignItems="center">
              <Checkbox
                colorScheme="blue"
                isChecked={editData?.confirmed || false}
                onChange={(e) =>
                  setEditData((prev:any) =>
                    prev ? { ...prev, confirmed: e.target.checked } : null
                  )
                }>
                Confirmed
              </Checkbox>
            </FormControl>
          </ModalBody>

          {/* Buttons */}
          <ModalFooter>
            <Button onClick={handleSave}>Save</Button>
            <Button variant="ghost" onClick={onClose} className="ml-3">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
         </Modal>
      </>
   )
}

export default ArticleEdit