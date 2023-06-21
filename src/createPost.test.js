import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import CreatePost from './components/CreatePost';

describe('CreatePost', () => {
  test('should upload a photo correctly', async () => {
    // Mock the necessary Firebase dependencies
    jest.mock('./config/firebase', () => ({
      db: {
        firestore: jest.fn(),
        FieldValue: {
          serverTimestamp: jest.fn(),
        },
      },
      auth: {
        currentUser: {
          uid: 'user123',
          displayName: 'John Doe',
        },
      },
      storage: {
        ref: jest.fn(),
        uploadBytesResumable: jest.fn().mockReturnThis(),
        snapshot: {
          ref: {
            getDownloadURL: jest.fn(),
          },
        },
      },
    }));

    // Mock the navigate function from react-router
    const mockNavigate = jest.fn();
    jest.mock('react-router', () => ({
      useNavigate: jest.fn().mockReturnValue(mockNavigate),
    }));

    // Render the CreatePost component
    const { getByPlaceholderText, getByText } = render(<CreatePost getPostList={jest.fn()} />);

    // Set the new post title and photo upload
    const newPostTitleInput = getByPlaceholderText('Add a caption...');
    fireEvent.change(newPostTitleInput, { target: { value: 'My New Post' } });

    const photoUploadInput = getByText('Submit post').previousSibling;
    fireEvent.change(photoUploadInput, { target: { files: [new File([], 'photo.jpg')] } });

    // Submit the post
    fireEvent.click(getByText('Submit post'));

    // Wait for the post to be uploaded
    await waitFor(() => expect(getByText('Submit post')).toBeDisabled());

    // Check the assertions
    expect(mockNavigate).toHaveBeenCalledWith('/');
    // Add more assertions to check if the photo was uploaded correctly
  });
});
