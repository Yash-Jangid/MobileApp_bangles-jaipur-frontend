import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppSettingsState {
  hasSeenVideoControlsHint: boolean;
  volumeLevel: number;
  isMuted: boolean;
}

const initialState: AppSettingsState = {
  hasSeenVideoControlsHint: false,
  volumeLevel: 1.0,
  isMuted: false,
};

const appSettingsSlice = createSlice({
  name: 'appSettings',
  initialState,
  reducers: {
    setHasSeenVideoControlsHint: (state, action: PayloadAction<boolean>) => {
      state.hasSeenVideoControlsHint = action.payload;
    },
    setVolumeLevel: (state, action: PayloadAction<number>) => {
      state.volumeLevel = Math.max(0, Math.min(1, action.payload));
      state.isMuted = state.volumeLevel === 0;
    },
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
  },
});

export const { 
  setHasSeenVideoControlsHint, 
  setVolumeLevel, 
  setMuted, 
  toggleMute 
} = appSettingsSlice.actions;

export default appSettingsSlice.reducer;
