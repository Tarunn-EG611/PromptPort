import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import templateService from '../../services/templateService';

const initialState = {
  templates: [],
  myTemplates: [],
  currentTemplate: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const extractMessage = (error) =>
  (error && error.response && error.response.data && error.response.data.message) ||
  (error && error.message) ||
  (error && error.toString && error.toString()) ||
  'An error occurred';

export const getPublicTemplates = createAsyncThunk(
  'templates/getPublic',
  async (_, thunkAPI) => {
    try {
      return await templateService.getPublicTemplates();
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error));
    }
  }
);

export const getMyTemplates = createAsyncThunk(
  'templates/getMine',
  async (_, thunkAPI) => {
    try {
      return await templateService.getMyTemplates();
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error));
    }
  }
);

export const getTemplateById = createAsyncThunk(
  'templates/getById',
  async (id, thunkAPI) => {
    try {
      return await templateService.getTemplate(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error));
    }
  }
);

export const createTemplate = createAsyncThunk(
  'templates/create',
  async (templateData, thunkAPI) => {
    try {
      return await templateService.createTemplate(templateData);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error));
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  'templates/delete',
  async (id, thunkAPI) => {
    try {
      return await templateService.deleteTemplate(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error));
    }
  }
);

export const forkTemplate = createAsyncThunk(
  'templates/fork',
  async (id, thunkAPI) => {
    try {
      return await templateService.forkTemplate(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error));
    }
  }
);

export const publishVersion = createAsyncThunk(
  'templates/publishVersion',
  async ({ templateId, versionData }, thunkAPI) => {
    try {
      const data = await templateService.publishVersion(templateId, versionData);
      return { templateId, version: data };
    } catch (error) {
      return thunkAPI.rejectWithValue(extractMessage(error));
    }
  }
);

export const templateSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // getPublicTemplates
      .addCase(getPublicTemplates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPublicTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.templates = action.payload;
      })
      .addCase(getPublicTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // getMyTemplates
      .addCase(getMyTemplates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myTemplates = action.payload;
      })
      .addCase(getMyTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // getTemplateById
      .addCase(getTemplateById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTemplateById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentTemplate = action.payload;
      })
      .addCase(getTemplateById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // createTemplate
      .addCase(createTemplate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.templates.push(action.payload);
        state.message = 'PromptTemplate created successfully.';
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // deleteTemplate
      .addCase(deleteTemplate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.templates = state.templates.filter((t) => t.id !== action.payload);
        state.myTemplates = state.myTemplates.filter((t) => t.id !== action.payload);
        state.message = 'PromptTemplate deleted successfully.';
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // forkTemplate
      .addCase(forkTemplate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forkTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myTemplates.push(action.payload);
        state.message = 'PromptTemplate forked successfully.';
      })
      .addCase(forkTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // publishVersion
      .addCase(publishVersion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(publishVersion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const { templateId, version } = action.payload;
        if (state.currentTemplate && state.currentTemplate.id === templateId) {
          if (!Array.isArray(state.currentTemplate.versions)) {
            state.currentTemplate.versions = [];
          }
          state.currentTemplate.versions.unshift(version);
        }
      })
      .addCase(publishVersion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = templateSlice.actions;
export default templateSlice.reducer;