import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
//STEP1 I CREATED THE FETCH AND CREATE THUNK
const BASE_URL = "http://localhost:3001/api/notes";
export const fetchNotes = createAsyncThunk(
  "notes/fetchNote",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const createNote = createAsyncThunk(
  "notes/createNote",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);



export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  notes: [],
  loading: false,
  error: null,
};
const noteSlice = createSlice({
  initialState,
  name: "notes",
  extraReducers: (builder) => {
    //FETCHING NOTES
    builder
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    //CREATING NOTES
    builder
      .addCase(createNote.fulfilled, (state, action) => {
        state.notes.push(action.payload);
        state.loading = false;
      })
      .addCase(createNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      //delete Note 
builder.addCase(deleteNote.fulfilled,(state,action)=>{
  state.notes=state.notes.filter((note)=>note.id!=action.payload)
}).addCase(deleteNote.rejected,state=>{
  state.error=action.payload
})
  },
});





export default noteSlice.reducer;
