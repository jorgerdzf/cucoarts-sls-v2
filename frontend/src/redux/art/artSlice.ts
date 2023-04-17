import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { getRandomArt } from './artAPI';

export interface artState {
    webImages: any;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: artState = {
    webImages: [],
    status: 'idle',
}

export const getRandomArtForWeb = createAsyncThunk(
    'art/GetRandomArt',
    async () => {
        //debugger;
        const payload = await getRandomArt();
        return payload.data;
    }
);

export const artSlice = createSlice({
    name: 'art',
    initialState,
    reducers: {
        getArt(state, action) {
            state.webImages = action.payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(getRandomArtForWeb.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(getRandomArtForWeb.fulfilled, (state, action) => {
            state.status = 'idle';
            state.webImages = action.payload;
        });
    },
});
export const selectArtImagesStatus = (state:RootState) =>
state.art.status;
export const selectArtImages = (state:RootState) => 
state.art.webImages ? state.art.webImages : [];

export const { getArt } = artSlice.actions;
export default artSlice.reducer;