import conf from "../conf.js"
import { Client, Storage, Query, Databases, ID } from "appwrite";


export class Service {
  client = new Client();
  databases;
  bucket;
  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }
  
  async createPost({ title, slug, content, featuredImage,status,userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title, content, featuredImage, status, userId,
        }
      )
    }
    catch (error) {
      console.log("Appwrite service :: createPost :: error, error")
    }
  }
  async updatePost(slug,{title, content, featuredImage,status}){
    try {
      return await this.databases.updateDocument(
        conf.appwriteCollectionId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      )
    } catch (error) {
      console.log("Apperite service :: updatePost :: error",error);
    }
  }
  async deletePost(slug){
    try {
      await this.databases.deleteDocument(
        conf.appwriteCollectionId,
        conf.appwriteDatabaseId,
        slug
      )
      return true
    } catch (error) {
      console.log("Appwrite Service :: deletePost :: error",error);
    }
  }
  async getPost(slug){
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      )
    } catch (error) {
      console.log("Appwrite service :: getPost :: error",error);
      return false;
    }
  }
  async getPosts(queries = [Query.equal("status","active")]){
    try {
      return await this.databases.listDocuments(
        conf.appwriteCollectionId,
        conf.appwriteDatabaseId,
        queries,
        
      )
    } catch (error) {
      console.log("Appwrite service :: getPost :: error",error)
      return false;
    }
  }
  // file uplode services
  async uploadFile(file){
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      )
    } catch (error) {
      console.log("Appwrite service :: UploadFile :: error",error);
      return false;
    }
  }
  async deleteFile(fileId){
    try {
      await this.bucket.deleteFile(
        conf.appwriteBucketId,
        fileId
      )
    } catch (error) {
      console.log("Appwrite service :: UploadFile :: error",error);
      return false
    }
  }
  getFilePreview(fileId){
    return this.bucket.getFilePreview(
      conf.appwriteBucketId,fileId
    )
  }
}

const service = new Service()

export default Service