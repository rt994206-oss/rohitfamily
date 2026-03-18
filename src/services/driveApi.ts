import axios from 'axios';

const API_KEY = 'AIzaSyA0rl7b4EF5MqN_dEvKARnNdJfSeQWW5wk';
const FOLDER_ID = '1ispVllLvM2N048xSsSEeAgXsCavy6SG4';
const BASE_URL = 'https://www.googleapis.com/drive/v3/files';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
  imageMediaMetadata?: {
    width: number;
    height: number;
  };
}

export const fetchDriveFiles = async (pageToken?: string) => {
  try {
    const params = new URLSearchParams({
      q: `'${FOLDER_ID}' in parents and trashed = false`,
      key: API_KEY,
      fields: 'nextPageToken, files(id, name, mimeType, thumbnailLink, webContentLink, imageMediaMetadata)',
      pageSize: '100',
      orderBy: 'createdTime desc',
    });

    if (pageToken) {
      params.append('pageToken', pageToken);
    }

    const response = await axios.get(`${BASE_URL}?${params.toString()}`);
    return {
      files: response.data.files as DriveFile[],
      nextPageToken: response.data.nextPageToken,
    };
  } catch (error) {
    console.error('Error fetching from Google Drive:', error);
    throw error;
  }
};

export const getImageUrl = (id: string) => {
  return `https://drive.google.com/uc?export=view&id=${id}`;
};
