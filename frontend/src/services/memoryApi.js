const API_BASE_URL = 'http://127.0.0.1:8000'; // Change this to your backend URL

// Helper function to get auth token (adjust based on your auth setup)
const getAuthToken = () => {
  return localStorage.getItem('token'); // or however you store your token
};

// Convert base64 to File object
const base64ToFile = (base64String, filename = 'image.jpg') => {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

// Create a new memory
export const createMemory = async (memoryData) => {
  try {
    const formData = new FormData();
    
    // Add required field
    formData.append('description', memoryData.whatToRemember);
    
    // Add optional fields
    if (memoryData.location) {
      formData.append('location', memoryData.location);
    }
    if (memoryData.person) {
      formData.append('person', memoryData.person);
    }
    if (memoryData.tags) {
      formData.append('tags', memoryData.tags);
    }
    
    // Convert base64 image to File and append
    if (memoryData.image) {
      const imageFile = base64ToFile(memoryData.image, 'memory-photo.jpg');
      formData.append('image', imageFile);
    }

    const response = await fetch(`${API_BASE_URL}/memory/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        // Don't set Content-Type - let browser set it with boundary for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create memory');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating memory:', error);
    throw error;
  }
};

// Get all memories for current user
export const getAllMemories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/memory/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch memories');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching memories:', error);
    throw error;
  }
};

// Get single memory by ID
export const getMemoryById = async (memoryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/memory/${memoryId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Memory not found');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching memory:', error);
    throw error;
  }
};

// Update a memory
export const updateMemory = async (memoryId, memoryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/memory/${memoryId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: memoryData.whatToRemember,
        image_url: memoryData.image,
        location: memoryData.location || null,
        person: memoryData.person || null,
        tags: memoryData.tags || null,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update memory');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating memory:', error);
    throw error;
  }
};

// Delete a memory
export const deleteMemory = async (memoryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/memory/${memoryId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete memory');
    }

    return true;
  } catch (error) {
    console.error('Error deleting memory:', error);
    throw error;
  }
};

// Mark memory as complete/incomplete
export const toggleMemoryComplete = async (memoryId, isCompleted) => {
  try {
    const response = await fetch(`${API_BASE_URL}/memory/${memoryId}/complete`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        is_completed: isCompleted,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update completion status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error toggling completion:', error);
    throw error;
  }
};