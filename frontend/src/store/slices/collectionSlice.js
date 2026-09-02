import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import collectionService from '../../services/collectionService';

const initialState = {
  collections: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

export const getMyCollections = createAsyncThunk(
  'collections/getMine',
  async (_, thunkAPI) => {
    try {
      return await collectionService.getMyCollections();
    } catch (error) {
      const message =
        (error && error.response && error.response.data && error.response.data.message) ||
        (error && error.message) ||
        (error && error.toString && error.toString()) ||
        'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const collectionSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyCollections.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyCollections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.collections = action.payload;
      })
      .addCase(getMyCollections.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = collectionSlice.actions;
export default collectionSlice.reducer;