import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppSettingsState {
  hasSeenVideoControlsHint: boolean;
  volumeLevel: number;
  isMuted: boolean;
  isOffline: boolean;
  isServiceUnavailable: boolean; // For circuit breaker
}

const initialState: AppSettingsState = {
  hasSeenVideoControlsHint: false,
  volumeLevel: 1.0,
  isMuted: false,
  isOffline: false,
  isServiceUnavailable: false,
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
    setOffline: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
    setServiceUnavailable: (state, action: PayloadAction<boolean>) => {
      state.isServiceUnavailable = action.payload;
    },
  },
});

export const {
  setHasSeenVideoControlsHint,
  setVolumeLevel,
  setMuted,
  toggleMute,
  setOffline,
  setServiceUnavailable
} = appSettingsSlice.actions;

export default appSettingsSlice.reducer;
